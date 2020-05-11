const jwt = require('jsonwebtoken');
const Token = require('../models/token');
const { secret } = require('../config');

class Auth {
	constructor(level = 1) {
		this.level = level;
		// Auth.USER = 8; // 普通用户
		// Auth.ADMIN = 16; // 管理员
		// Auth.SUPER_ADMIN = 32; // 超级管理员
	}
	get m() {
		return  async(ctx, next) => { // 自己编写的认证
			const { authorization = '' } = ctx.request.header;
			const token = authorization.replace('Bearer ', '');
			const tm = await Token.findOne({token});
			if (tm) {
				try {
					const user = jwt.verify(token, secret);
					if (!user.scope || (user.scope < this.level)) {
						ctx.throw(403, '权限不足');
					}
					ctx.state.user = user; // 通常放一些用户信息
				} catch (err) {
					// 401 未认证（err.name 等于 'TokenExpiredError' 是token已过期）
					if (err.name === 'TokenExpiredError') {
						await Token.findByIdAndRemove(tm._id);
					}
					ctx.throw(401, err);
				}
			} else {
				ctx.throw(401, '当前用户登陆不合法');
			}
			await next();
		};
	}
	static verifyToken(token) {
		try {
			jwt.verify(token, secret);
			return true;
		} catch(e) {
			return false;
		}
	}
}

module.exports = {
	Auth
};