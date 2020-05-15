const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const { Schema, model } = mongoose;

const userSchema = new Schema(
	{
		__v: {
			type: Number,
			select: false
		},
		name: {
			type: String,
			required: true,
			unique: true,
			max: 120,
			min: 1
		},
		email: {
			type: String,
			required: true,
			validate: {
				validator(v) {
					return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(v);
				},
				message: '邮箱格式不正确!'
			}
		},
		password: {
			type: String,
			required: true,
			select: false // mongoose的一个语法，获取的时候不显示
		},
		avatar: { // 头像
			type: String,
			default:'/avatar/default.png'
		},
		birth: { // 生日
			type: Date,
		},
		gender: { // 性别
			type: String,
			enum: ['male', 'female'], // 枚举
			default: 'male',
			required: true
		},
		introduce: { // 简介
			type: String,
			default: '暂无简介',
		},
		scope: { // 用户权限范围
			type: Number,
			select: false,
			default: 8
			//8: 普通用户
			//16: 管理员
			//32: 超级管理员
		}
	},
	{ timestamps: true }
);

userSchema.pre('save', function(next) {
	// 保存之前中间件
	const user = this;
	// 加盐加密，是否更改，mongoose上的方法
	if (!user.isModified('password')) return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);
			user.password = hash;
			next();
		});
	});
});

userSchema.methods = {
	comparePassword: (_password, password) => {
		return new Promise((resolve, reject) => {
			bcrypt.compare(_password, password, (err, isMatch) => {
				if (!err) resolve(isMatch);
				else reject(err);
			});
		});
	}
};

module.exports = model('User', userSchema);
