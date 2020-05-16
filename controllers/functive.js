const Functive = require('../models/functive');

class FunctiveCtl {
	async find(ctx) {
		const { size = 10 } = ctx.query;
		const page = Math.max(ctx.query.page * 1, 1) - 1;
		const perPage = Math.max(size * 1, 1);
		ctx.body = await Functive.find({name: new RegExp(ctx.query.q)})
			.limit(perPage)
			.skip(page * perPage);
	}
  
	async checkFunctiveExist(ctx, next) {
		const functive = await Functive.findById(ctx.params.id);
		if (!functive) {
			ctx.throw(404, '当前功能项不存在');
		}
		ctx.state.functive = functive;
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
		const functive = await Functive.findById(ctx.params.id)
			.select(selectFields)
			.populate(populateStr);
		if (!functive) {
			ctx.throw(404, '当前功能项不存在');
		}
		ctx.body = functive;
	}
  
	async create(ctx) {
		ctx.verifyParams({
			name: { type: 'string', required: true },
			ename: { type: 'string', required: true },
			link: { type: 'string', required: false },
			icon: { type: 'string', required: false },
			description: { type: 'string', required: false },
			sort: { type: 'number', required: false },
			type: { type: 'string', required: true },
			state: { type: 'boolean', required: true },
			parent: { type: 'string', required: false },
		});
		const functive = await new Functive({
			...ctx.request.body,
		}).save();
		ctx.body = functive;
	}
  
	async update(ctx) {
		ctx.verifyParams({
			name: { type: 'string', required: false },
			ename: { type: 'string', required: false },
			link: { type: 'string', required: false },
			icon: { type: 'string', required: false },
			description: { type: 'string', required: false },
			sort: { type: 'number', required: false },
			type: { type: 'string', required: false },
			state: { type: 'boolean', required: false },
			parent: { type: 'string', required: false },
		});
		await ctx.state.functive.update(ctx.request.body);
		ctx.body = ctx.state.functive;
	}
  

	async delete(ctx) {
		await Functive.findByIdAndRemove(ctx.params.id);
		ctx.status = 204;
	}
  
}
module.exports = new FunctiveCtl();
