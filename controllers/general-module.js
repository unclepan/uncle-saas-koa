
const generalModuleFunc = require('../models/general-module');
// const SystemModule = require('../models/system-module');
const lodash = require('lodash');

const fieldDataTypeEnum = {
	TEXT: { name:'string', type: String },
	TEXTAREA: { name:'string', type: String },
	NUMBER: { name:'number', type: Number },
	CURRENCY: { name:'number', type: Number },
	PERCENT: { name:'number', type: Number },
	DATE: { name:'date', type: Date },
	SELECT: { name:'string', type: String },
	SWITCH: { name:'boolean', type: Boolean },
	UPLOAD: { name:'string', type: String },
	RADIO: { name:'string', type: String },
};

class GeneralModuleCtl {
	async createModelInstance(ctx, next) {
		const { systemModule } = ctx.state;
		if(!systemModule.state) {
			ctx.throw(404, '模块是未启动状态');
		}
		// 1.先将module里的list拍平成一个数组
		const moduleFields = systemModule.module.reduce((arr, item) => { 
			let a = arr;
			a = lodash.cloneDeep(item.list).concat(arr);
			return a;
		}, []);
		
		// 2.生成schema需要用到的字段格式
		const ins = moduleFields.reduce((obj, item) => {
			obj[item.name] = {
				type: fieldDataTypeEnum[item.type].type,
				required: item.required
			};
			return obj;
		}, {});

		// 3.生成schema，并且返回model
		const modelInstance = generalModuleFunc.init(ins, systemModule.ename);
		ctx.state.modelInstance = modelInstance;
		ctx.state.moduleFields = moduleFields;
		await next();
	}

	async create(ctx) {
		const verifyParams = ctx.state.moduleFields.reduce((obj, item) => {
			obj[item.name] = {
				type: fieldDataTypeEnum[item.type].name,
				required: item.required
			};
			return obj;
		}, {});
		ctx.verifyParams(verifyParams);

		const modelInstance = await new ctx.state.modelInstance({
			...ctx.request.body,
		}).save();
		ctx.body = modelInstance;
	}

	async find(ctx) {
		const { size = 10, current = 1 } = ctx.query;
		let page = Math.max(current * 1, 1) - 1;
		const perPage = Math.max(size * 1, 1);
		const conditions = {del: false};
		const count = await ctx.state.modelInstance.countDocuments(conditions);

		let data = await ctx.state.modelInstance.find(conditions)
			.limit(perPage)
			.skip(page * perPage)
			.sort({'updatedAt': -1});

		if(!data.length && page > 0){
			page = 0;
			data = await ctx.state.modelInstance.find(conditions)
				.limit(perPage)
				.skip(page * perPage)
				.sort({'updatedAt': -1});
		} 
		ctx.body = {
			data,
			count,
			current: page + 1,
			size: perPage
		}; 
	}
  
	async checkExist(ctx, next) {
		const instanceDataItem = await ctx.state.modelInstance.findById(ctx.params.vid).select('+del');
		if (!instanceDataItem || instanceDataItem.del) {
			ctx.throw(404, '数据不存在');
		}
		ctx.state.instanceDataItem = instanceDataItem;
		await next();
	}
  
	async findById(ctx) {
		const { fields = '' } = ctx.query;
		const selectFields = fields
			.split(';')
			.filter((f) => f)
			.map((f) => '+' + f)
			.join(' ');
		const populateStr = fields
			.split(';')
			.filter((f) => f)
			.map((f) => f)
			.join(' ');
		const modelInstance = await ctx.state.modelInstance.findById(ctx.params.vid)
			.select(`${selectFields} +del`)
			.populate(populateStr);
		if (!modelInstance || modelInstance.del) {
			ctx.throw(404, '数据不存在');
		}
		ctx.body = modelInstance;
	}
  
  
	async update(ctx) {
		const verifyParams = ctx.state.moduleFields.reduce((obj, item) => {
			obj[item.name] = {
				type: fieldDataTypeEnum[item.type].name,
				required: false
			};
			return obj;
		}, {});
		ctx.verifyParams(verifyParams);

		await ctx.state.instanceDataItem.update(ctx.request.body);
		ctx.body = ctx.state.instanceDataItem;
	}
  

	async delete(ctx) {
		await ctx.state.modelInstance.findByIdAndRemove(ctx.params.vid);
		ctx.status = 204;
	}
  
}
module.exports = new GeneralModuleCtl();
