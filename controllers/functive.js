const Functive = require('../models/functive');

class FunctiveCtl {
	async find(ctx) {
		const { size = 10, current = 1, name, state } = ctx.query;
		let page = Math.max(current * 1, 1) - 1;
		const perPage = Math.max(size * 1, 1);
		const conditions = {del: false, name: new RegExp(name)};
		if(state){
			conditions.state = state;
		}
		const count = await Functive.countDocuments(conditions);

		let data = await Functive.find(conditions)
			.limit(perPage)
			.skip(page * perPage)
			.sort({'updatedAt': -1});

		if(!data.length && page > 0){
			page = 0;
			data = await Functive.find(conditions)
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
	async findTree(ctx){
		let data = await Functive.find({ del: false });

		function treeData(){
			let cloneData = JSON.parse(JSON.stringify(data));
			return cloneData.filter(father => {               
				let branchArr = cloneData.filter(child => father._id === child.parent);
				if(branchArr.length > 0){
					father.children = branchArr;
				}
				return father.parent == 'parent';
			});
		}

		ctx.body = treeData();
	}
  
	async checkFunctiveExist(ctx, next) {
		const functive = await Functive.findById(ctx.params.id).select('+del');
		if (!functive || functive.del) {
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
			.select(`${selectFields} +del`)
			.populate(populateStr);
		if (!functive || functive.del) {
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
			type: { type: 'enum', required: true, values: ['menu', 'handle']  },
			state: { type: 'boolean', required: true },
			parent: { type: 'string', required: true },
			moduleId: { type: 'string', required: false },
		});

		const {type, moduleId,  ename} = ctx.request.body;
		if(type === 'module'){
			if(!moduleId){
				ctx.throw(409, '推送失败，需要传moduleId');
			}
			const functive = await Functive.findOne({ moduleId, del: false });
			if (functive) {
				ctx.throw(409, '推送失败，功能项已经存在此模块');
			}
		}

		const repeatedFunctive= await Functive.findOne({ ename, del: false });
		if (repeatedFunctive) {
			ctx.throw(409, '英文名已经重复');
		}

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
			type: { type: 'enum', required: false, values: ['menu', 'handle'] },
			state: { type: 'boolean', required: false },
			parent: { type: 'string', required: false },
			moduleId: { type: 'string', required: false },
			del: { type: 'boolean', required: false },
		});

		const { ename } = ctx.request.body;
		if(ename){
			const repeatedFunctive = await Functive.findOne({ ename, del: false });
			if (repeatedFunctive && ctx.params.id !== repeatedFunctive.id) {
				ctx.throw(409, '英文名已经重复');
			}
		}
		await ctx.state.functive.update(ctx.request.body);
		ctx.body = ctx.state.functive;
	}
	async delete(ctx) {
		await Functive.findByIdAndRemove(ctx.params.id);
		ctx.status = 204;
	}
  
}
module.exports = new FunctiveCtl();
