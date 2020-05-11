const {Option, OptionValue} = require('../models/option');

class OptionCtl {
	async findOption(ctx) {
		const { size = 10 } = ctx.query;
		const page = Math.max(ctx.query.page * 1, 1) - 1;
		const perPage = Math.max(size * 1, 1);
		ctx.body = await Option.find({name: new RegExp(ctx.query.q)})
			.limit(perPage)
			.skip(page * perPage);
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
		ctx.body = option;
	}
  
	async createOption(ctx) {
		ctx.verifyParams({
			name: { type: 'string', required: true },
			ename: { type: 'string', required: true },
			description: { type: 'string', required: true },
		});
		const option = await new Option({
			...ctx.request.body,
		}).save();
		ctx.body = option;
	}
  
	async updateOption(ctx) {
		ctx.verifyParams({
			name: { type: 'string', required: false },
			ename: { type: 'string', required: false },
			description: { type: 'string', required: false } 
		});
		await ctx.state.option.update(ctx.request.body);
		ctx.body = ctx.state.option;
	}
  
	async deleteOption(ctx) {
		await Option.findByIdAndRemove(ctx.params.id);
		ctx.status = 204;
	}

	// 以下为选项值
	async findOptionValue(ctx) {
		const { size = 10 } = ctx.query;
		const page = Math.max(ctx.query.page * 1, 1) - 1;
		const perPage = Math.max(size * 1, 1);
		ctx.body = await OptionValue.find({optionId: ctx.params.id, name: new RegExp(ctx.query.q)})
			.limit(perPage)
			.skip(page * perPage);
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
			value: { type: 'string', required: true },
			description: { type: 'string', required: false } 
		});
		await ctx.state.optionValue.update(ctx.request.body);
		ctx.body = ctx.state.optionValue;
	}
  
	async deleteOptionValue(ctx) {
		await OptionValue.findByIdAndRemove(ctx.params.vid);
		ctx.status = 204;
	}
  
}
module.exports = new OptionCtl();
