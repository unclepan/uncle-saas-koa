const {Option, OptionValue} = require('../models/option');
const User = require('../models/users');
const Role = require('../models/role');

class OptionCtl {
	async find(ctx) {
		const { search } = ctx.query;
		const { id } = ctx.params; 
		let data;
		const conditions = {del: false, name: new RegExp(search)};
		if(id === 'users') { // 用户的公共选项接口数据
			data = await User.find(conditions);
		} else if(id === 'roles') { // 角色的公共选项接口数据
			data = await Role.find(conditions);
		} else { // 选项配置里的的公共选项接口数据
			const o = await OptionValue.find(conditions)
				.select('+optionId')
				.populate('optionId');
			data = o.filter(item => {
				return item.optionId && item.optionId.ename === id;
			});
		}

		ctx.body = data.map(item => {
			const { _id: value, name } = item;
			return {name, value: item.value || value};
		}); 
	}

	async findOption(ctx) {
		const { size = 10, current = 1, name } = ctx.query;
		let page = Math.max(current * 1, 1) - 1;
		const perPage = Math.max(size * 1, 1);
		const conditions = {del: false, name: new RegExp(name)};
		const count = await Option.count(conditions);

		let data = await Option.find(conditions)
			.limit(perPage)
			.skip(page * perPage)
			.sort({'updatedAt': -1});

		if(!data.length && page > 0){
			page = 0;
			data = await Option.find(conditions)
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
	async checkOptionExist(ctx, next) {
		const option = await Option.findById(ctx.params.id);
		if (!option) {
			ctx.throw(404, '当前选项不存在');
		}
		ctx.state.option = option;
		await next();
	}
  
	async findOptionById(ctx) {
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
		const option = await Option.findById(ctx.params.id)
			.select(selectFields)
			.populate(populateStr);
		if (!option) {
			ctx.throw(404, '当前选项不存在');
		}
		ctx.body = option;
	}
  
	async createOption(ctx) {
		ctx.verifyParams({
			name: { type: 'string', required: true },
			ename: { type: 'string', required: true },
			description: { type: 'string', required: true },
		});
		const { ename } = ctx.request.body;
		const repeatedOption = await Option.findOne({ ename });
		if (repeatedOption) {
			ctx.throw(409, '选项英文名已经存在');
		}
		const option = await new Option({
			...ctx.request.body,
		}).save();
		ctx.body = option;
	}
  
	async updateOption(ctx) {
		ctx.verifyParams({
			name: { type: 'string', required: false },
			ename: { type: 'string', required: false },
			description: { type: 'string', required: false },
			del: { type: 'boolean', required: false },
		});
		const { ename } = ctx.request.body;
		if(ename){
			const repeatedOption = await Option.findOne({ ename });
			if (repeatedOption && ctx.params.id !== repeatedOption.id) {
				ctx.throw(409, '选项英文名已经存在');
			}
		}
		await ctx.state.option.update(ctx.request.body);
		ctx.body = ctx.state.option;
	}
  
	async deleteOption(ctx) {
		await Option.findByIdAndRemove(ctx.params.id);
		ctx.status = 204;
	}
	

	// 以下为选项值
	async findOptionValue(ctx) {
		const { size = 10, current = 1, name } = ctx.query;
		let page = Math.max(current * 1, 1) - 1;
		const perPage = Math.max(size * 1, 1);
		const conditions = {del: false, optionId: ctx.params.id, name: new RegExp(name)};
		const count = await OptionValue.count(conditions);

		let data = await OptionValue.find(conditions)
			.limit(perPage)
			.skip(page * perPage)
			.sort({'updatedAt': -1});

		if(!data.length && page > 0){
			page = 0;
			data = await OptionValue.find(conditions)
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
  
	async checkOptionValueExist(ctx, next) {
		const optionValue = await OptionValue.findById(ctx.params.vid);
		if (!optionValue) {
			ctx.throw(404, '当前选项值不存在');
		}
		ctx.state.optionValue = optionValue;
		await next();
	}
  
	async findOptionValueById(ctx) {
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
		const optionValue = await OptionValue.findById(ctx.params.vid)
			.select(selectFields)
			.populate(populateStr);
		ctx.body = optionValue;
	}
  
	async createOptionValue(ctx) {
		ctx.verifyParams({
			name: { type: 'string', required: true },
			ename: { type: 'string', required: true },
			value: { type: 'string', required: true },
			description: { type: 'string', required: true },
		});
		const { value } = ctx.request.body;
		const repeatedOptionValue = await OptionValue.findOne({ value, optionId: ctx.params.id });
		if (repeatedOptionValue) {
			ctx.throw(409, '选项值已经存在');
		}
		const optionValue = await new OptionValue({
			...ctx.request.body,
			optionId: ctx.params.id
		}).save();
		ctx.body = optionValue;
	}
  
	async updateOptionValue(ctx) {
		ctx.verifyParams({
			name: { type: 'string', required: false },
			ename: { type: 'string', required: false },
			value: { type: 'string', required: false },
			description: { type: 'string', required: false },
			del: { type: 'boolean', required: false },
		});
		const { value } = ctx.request.body;
		if(value){
			const repeatedOptionValue = await OptionValue.findOne({ value, optionId: ctx.params.id });
			if (repeatedOptionValue && ctx.params.vid !== repeatedOptionValue.id) {
				ctx.throw(409, '选项值已经存在');
			}
		}
		await ctx.state.optionValue.update(ctx.request.body);
		ctx.body = ctx.state.optionValue;
	}
  
	async deleteOptionValue(ctx) {
		await OptionValue.findByIdAndRemove(ctx.params.vid);
		ctx.status = 204;
	}
  
}
module.exports = new OptionCtl();
