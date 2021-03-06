const SystemModule = require('../models/system-module');
const Functive = require('../models/functive');
const common = require('../common/db');

class SystemModuleCtl {
	async find(ctx) {
		const { size = 10, current = 1, name, state } = ctx.query;
		let page = Math.max(current * 1, 1) - 1;
		const perPage = Math.max(size * 1, 1);
		const conditions = {del: false, name: new RegExp(name)};
		if(state){
			conditions.state = state;
		}
		const count = await SystemModule.countDocuments(conditions);

		let data = await SystemModule.find(conditions)
			.limit(perPage)
			.skip(page * perPage)
			.sort({'updatedAt': -1})
			.lean();

		if(!data.length && page > 0){
			page = 0;
			data = await SystemModule.find(conditions)
				.limit(perPage)
				.skip(page * perPage)
				.sort({'updatedAt': -1})
				.lean();
		} 

		if(ctx.state.functive) {
			data = data.map(item => {
				const functive = ctx.state.functive.some(i => {
					return i.moduleId ? i.moduleId.toString() === item._id.toString() : false;
				});
				return { ...item, functive };
			});
		}
		ctx.body = {
			data,
			count,
			current: page + 1,
			size: perPage
		}; 
	}

	async findFunctive(ctx, next) {
		const functive = await Functive.find({type:'menu', del:false});
		ctx.state.functive = functive;
		await next();
	}
  
	async checkSystemModuleExist(ctx, next) {
		const systemModule = await SystemModule.findById(ctx.params.id).select('+del');
		if (!systemModule || systemModule.del) {
			ctx.throw(404, '当前模块不存在');
		}
		ctx.state.systemModule = systemModule;
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
		const sm = await SystemModule.findById(ctx.params.id)
			.select(`${selectFields} +del`)
			.populate(populateStr);
		if (!sm || sm.del) {
			ctx.throw(404, '当前模块不存在');
		}
		ctx.body = sm;
	}
  
	async create(ctx) {
		ctx.verifyParams({
			name: { type: 'string', required: true },
			ename: { type: 'string', required: true },
			module: {type:'array',required: false },
			description: { type: 'string', required: false },
			state: { type: 'boolean', required: false },
		});
		const { ename } = ctx.request.body;
		if(common.dbModelName.indexOf(ename) >= 0){
			ctx.throw(409, '模块英文名与系统预定义dbName冲突');
		}
		const repeatedSystemModule = await SystemModule.findOne({ ename, del: false  });
		if (repeatedSystemModule) {
			ctx.throw(409, '模块英文名已经存在');
		}
		const systemModule = await new SystemModule({
			...ctx.request.body,
		}).save();
		ctx.body = systemModule;
	}
  
	async update(ctx) {
		ctx.verifyParams({
			name: { type: 'string', required: false },
			ename: { type: 'string', required: false },
			module: {type:'array',required: false },
			description: { type: 'string', required: false },
			state: { type: 'boolean', required: false },
			del: { type: 'boolean', required: false },
		});
		const { ename } = ctx.request.body;
		if(common.dbModelName.indexOf(ename) >= 0){
			ctx.throw(409, '模块英文名与系统预定义dbName冲突');
		}
		if(ename){
			const repeatedSystemModule = await SystemModule.findOne({ ename, del: false   });
			if (repeatedSystemModule && ctx.params.id !== repeatedSystemModule.id) {
				ctx.throw(409, '模块英文名已经存在');
			}
		}
		await ctx.state.systemModule.update(ctx.request.body);
		ctx.body = ctx.state.systemModule;
	}
  
	async delete(ctx) {
		await SystemModule.findByIdAndRemove(ctx.params.id);
		ctx.status = 204;
	} 
}
module.exports = new SystemModuleCtl();
