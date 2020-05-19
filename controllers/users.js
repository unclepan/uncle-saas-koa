const nodeMailer = require('nodemailer');
const jsonwebtoken = require('jsonwebtoken');
const Redis = require('koa-redis');
const User = require('../models/users');
const Token = require('../models/token');
const UserRelationRole = require('../models/user-relation-role');
const { secret, smtp } = require('../config');
const Store = new Redis().client;

class UsersCtl {
	// 检查是否已经存在该用户名
	async whetherName(ctx) {
		const { name } = ctx.query;
		const repeatedUser = await User.findOne({ name });
		ctx.body = !!repeatedUser;
	}
	// 邮箱验证code
	async verify(ctx) {
		ctx.verifyParams({
			name: { type: 'string', required: true },
			email: { type: 'string', required: true }
		});
		const { name, email } = ctx.request.body;
		const saveExpire = await Store.hget(`nodemail:${name}`, 'expire');
		if (saveExpire && new Date().getTime() - saveExpire < 0) {
			ctx.body = {
				code: -1,
				msg: '验证请求过于频繁，1分钟内1次'
			};
			return false;
		}
		const transporter = nodeMailer.createTransport({
			secure: false,
			service: 'qq',
			auth: {
				user: smtp.user,
				pass: smtp.pass
			}
		});
		const ko = {
			code: smtp.code(),
			expire: smtp.expire(),
			email,
			user: name
		};
		const mailOptions = {
			from: `"认证邮件" <${smtp.user}>`,
			to: ko.email,
			subject: 'SAAS内容管理系统用户注册码',
			html: `您正在内容管理系统中注册，您的邀请码是${ko.code}`
		};
		await transporter.sendMail(mailOptions, (error) => {
			if (error) {
				return console.log(error);
			} else {
				Store.hmset(
					`nodemail:${ko.user}`,
					'code',
					ko.code,
					'expire',
					ko.expire,
					'email',
					ko.email
				);
			}
		});
		ctx.body = {
			code: 0,
			msg: '验证码已发送，可能会有延时，有效期1分钟'
		};
	}
	// 用户列表
	async find(ctx) {
		const { size = 10, current = 1, name = '', email = '' } = ctx.query;
		let page = Math.max(current * 1, 1) - 1;
		const perPage = Math.max(size * 1, 1);
		const conditions = {del: false, name: new RegExp(name), email: new RegExp(email)};
		const count = await User.countDocuments(conditions);

		let data = await User.find(conditions)
			.limit(perPage)
			.skip(page * perPage)
			.sort({'updatedAt': -1});

		if(!data.length && page > 0){
			page = 0;
			data = await User.find(conditions)
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
	// 根据某个用户id查找用户详情
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
		const user = await User.findById(ctx.params.id)
			.select(selectFields)
			.populate(populateStr); // select是mongoose语法
		if (!user) {
			ctx.throw(404, '用户不存在');
		}
		ctx.body = user;
	}
	// 创建用户
	async create(ctx) {
		ctx.verifyParams({
			name: { type: 'string', required: true },
			password: { type: 'string', required: true },
			birth: { type: 'dateTime', required: false },
			email: { type: 'email', required: true },
			code: { type: 'string', required: true }
		});
		const { name, password, email, code } = ctx.request.body;

		if (code) {
			const saveCode = await Store.hget(`nodemail:${name}`, 'code');
			const saveExpire = await Store.hget(`nodemail:${name}`, 'expire');
			if (code === saveCode) {
				if (new Date().getTime() - saveExpire > 0) {
					ctx.throw(400, '验证码已过期，请重新尝试');
				}
			} else {
				ctx.throw(400, '请填写正确的验证码');
			}
		} else {
			ctx.throw(400, '请填写验证码');
		}
		const repeatedUser = await User.findOne({ name });
		if (repeatedUser) {
			ctx.throw(409, '用户已经存在');
		}
		const user = await new User({ name, password, email }).save();
		ctx.body = user;
	}
	async checkOwner(ctx, next) {
		// 自己编写的授权，跟业务代码强相关，所以写在这里
		if (ctx.params.id !== ctx.state.user._id) {
			ctx.throw(403, '无权限');
		}
		await next();
	}
	// 更新用户
	async update(ctx) {
		ctx.verifyParams({
			name: { type: 'string', required: false },
			birth: { type: 'dateTime', required: false },
			gender: { type: 'enum', required: false, values: ['male', 'female'] },
			introduce: { type: 'string', required: false },
			del: { type: 'boolean', required: false },
		});
		const { name, password, email, scope } = ctx.request.body;
		if(name){
			const repeatedUser = await User.findOne({ name });
			if (repeatedUser && ctx.params.id !== repeatedUser.id) {
				ctx.throw(409, '用户名已经存在');
			}
		}
		if (password) {
			// 密码加密单独处理
			const user = await User.findById(ctx.params.id).select('+password');
			user.password = password;
			delete ctx.request.body.password;
			await user.save();
		} else {
			delete ctx.request.body.password;
		}
		if (email) {
			delete ctx.request.body.email;
		}
		if (scope) {
			delete ctx.request.body.scope;
		}
		const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
		if (!user) {
			ctx.throw(404, '用户不存在');
		}
		ctx.body = user;
	}

	async delete(ctx) {
		const user = await User.findByIdAndRemove(ctx.params.id);
		if (!user) {
			ctx.throw(404, '用户不存在');
		}
		ctx.status = 204;
	}

	async login(ctx) {
		ctx.verifyParams({
			name: { type: 'string', required: true },
			password: { type: 'string', required: true }
		});
		const user = await User.findOne({ name: ctx.request.body.name }).select(
			'+password +scope'
		);
		if (!user) {
			ctx.throw(401, '用户名不存在');
		}
		try {
			const pt = await user.comparePassword(
				ctx.request.body.password,
				user.password
			);
			if (pt) {
				const { _id, name, scope } = user;
				const token = jsonwebtoken.sign({ _id, name ,scope }, secret, {
					expiresIn: 1000 * 60 * 30
				});
				await new Token({ // 登陆成功后存入数据库
					token,
				}).save();
				ctx.body = { token };
			} else {
				ctx.throw(401, '密码错误');
			}
		} catch (err) {
			ctx.throw(401, err);
		}
	}
	async logout(ctx){
		const { authorization = '' } = ctx.request.header;
		const token = authorization.replace('Bearer ', '');
		await Token.findOneAndRemove({token});
		ctx.status = 204;
	}

	async checkUserExist(ctx, next) {
		// 检查用户存在与否，跟业务代码强相关，所以写在这里
		const user = await User.findById(ctx.params.id);
		if (!user) {
			ctx.throw(404, '用户不存在');
		}
		await next();
	}


	// 查询该用户关联了哪些角色
	async findBindRole(ctx) {
		const { size = 10 } = ctx.query;
		const page = Math.max(ctx.query.page * 1, 1) - 1;
		const perPage = Math.max(size * 1, 1);
		ctx.body = await UserRelationRole.find({
			user: ctx.params.id
		})
			.limit(perPage)
			.skip(page * perPage)
			.populate('user role');
	}

	checkUserRelationRoleExist(con) {
		return async (ctx, next) => {
			const { roles } = ctx.request.body;
			const userRelationRole = await UserRelationRole.find(
				{
					user: ctx.params.id,
					role: { $in:[...roles]}
				}
			);
			if (con === 'gt' && (userRelationRole.length > 0)) {
				ctx.throw(404, '当前用户与某些角色已经存在关联');
			}
			if (con === 'lt' && (!userRelationRole.length)) {
				ctx.throw(404, '当前用户与传入某些角色的不存在关联');
			}
			await next();
		};
	}

	// 创建角色与用户的关联
	async createBindRole(ctx) {
		ctx.verifyParams({
			roles: { type: 'array', required: true },
		});
		const { roles } = ctx.request.body;
		const docs = roles.map(item => {
			return {user: ctx.params.id, role: item };
		});
		const relations = await UserRelationRole.insertMany(docs);
		ctx.body = relations;
	}

	// 取消角色与用户的关联
	async deleteBindRole(ctx) {
		ctx.verifyParams({
			roles: { type: 'array', required: true },
		});
		const { roles } = ctx.request.body;
		await UserRelationRole.deleteMany(
			{
				user: ctx.params.id,
				role: {$in: [...roles]}
			}
		);
		ctx.status = 204;
	}

}
module.exports = new UsersCtl();
