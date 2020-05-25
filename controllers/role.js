const Role = require('../models/role');
const UserRelationRole = require('../models/user-relation-role');
const FunctiveRelationRole = require('../models/functive-relation-role');

class RoleCtl {
	async find(ctx) {
		const { size = 10, current = 1, name, state } = ctx.query;
		let page = Math.max(current * 1, 1) - 1;
		const perPage = Math.max(size * 1, 1);
		const conditions = {del: false, name: new RegExp(name)};
		if(state){
			conditions.state = state;
		}
		const count = await Role.countDocuments(conditions);

		let data = await Role.find(conditions)
			.limit(perPage)
			.skip(page * perPage)
			.sort({'updatedAt': -1});

		if(!data.length && page > 0){
			page = 0;
			data = await Role.find(conditions)
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
  
	async checkRoleExist(ctx, next) {
		const role = await Role.findById(ctx.params.id);
		if (!role || role.del) {
			ctx.throw(404, '当前角色不存在');
		}
		ctx.state.role = role;
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
		const role = await Role.findById(ctx.params.id)
			.select(selectFields)
			.populate(populateStr);
		if (!role || role.del) {
			ctx.throw(404, '当前角色不存在');
		}
		ctx.body = role;
	}
  
	async create(ctx) {
		ctx.verifyParams({
			name: { type: 'string', required: true },
			ename: { type: 'string', required: true },
			description: { type: 'string', required: false },
			state: { type: 'boolean', required: true },
		});
		const role = await new Role({
			...ctx.request.body,
		}).save();
		ctx.body = role;
	}
  
	async update(ctx) {
		ctx.verifyParams({
			name: { type: 'string', required: false },
			ename: { type: 'string', required: false },
			description: { type: 'string', required: false },
			state: { type: 'boolean', required: false },
			del: { type: 'boolean', required: false },
		});
		await ctx.state.role.update(ctx.request.body);
		ctx.body = ctx.state.role;
	}
  
	async delete(ctx) {
		await Role.findByIdAndRemove(ctx.params.id);
		ctx.status = 204;
	}

	// 查询该角色关联了哪些用户
	async findBindUser(ctx) {
		ctx.body = await UserRelationRole.find({role: ctx.params.id});
	}

	checkUserRelationRoleExist(con) {
		return async (ctx, next) => {
			const { users } = ctx.request.body;
			const userRelationRole = await UserRelationRole.find(
				{
					role: ctx.params.id,
					user: { $in:[...users]}
				}
			);
			if (con === 'gt' && (userRelationRole.length > 0)) {
				ctx.throw(404, '某些用户与当前角色已经存在关联');
			}
			if (con === 'lt' && (!userRelationRole.length)) {
				ctx.throw(404, '某些用户与当前角色不存在关联');
			}
			await next();
		};
	}

	// 创建角色与用户的关联
	async createBindUser(ctx) {
		ctx.verifyParams({
			users: { type: 'array', required: true },
		});
		const { users } = ctx.request.body;
		const docs = users.map(item => {
			return {role: ctx.params.id, user: item };
		});
		const relations = await UserRelationRole.insertMany(docs);
		ctx.body = relations;
	}

	// 取消角色与用户的关联
	async removeBindUser(ctx) {
		ctx.verifyParams({
			users: { type: 'array', required: true },
		});
		const { users } = ctx.request.body;
		await UserRelationRole.deleteMany(
			{
				role: ctx.params.id,
				user: {$in: [...users]}
			}
		);
		ctx.status = 204;
	}



	// 查询该角色关联了哪些功能
	async findBindFunctive(ctx) {
		ctx.body = await FunctiveRelationRole.find({role: ctx.params.id});
	}

	// 创建角色与功能的关联
	async createBindFunctive(ctx) {
		ctx.verifyParams({
			functives: { type: 'array', required: true },
		});
		const { functives } = ctx.request.body;
		const docs = functives.map(item => {
			return {role: ctx.params.id, functive: item };
		});
		const relations = await FunctiveRelationRole.insertMany(docs);
		ctx.body = relations;
	}

	// 取消角色与功能的关联
	async removeBindFunctive(ctx, next) {
		await FunctiveRelationRole.deleteMany({role: ctx.params.id});
		await next();
	}
  
}
module.exports = new RoleCtl();
