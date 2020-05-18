const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const functiveSchema = new Schema(
	{
		__v: {
			type: Number,
			select: false
		},
		name: {
			type: String,
			required: true
		},
		ename: {
			type: String,
			required: true
		},
		link: {
			type: String,
		},
		icon: {
			type: String,
		},
		description: {
			type: String,
		},
		sort:{
			type: Number,
			default: 0
		},
		type: { // 功能类型
			type: String,
			enum: ['menu', 'handle'],
			default: 'menu',
			required: true
		},
		state: { // 状态
			type: Boolean,
			required: true,
			default: false
		},
		parent: { // 父级
			type: String,
			required: true,
			default: 'parent',
		},
		del: { // 软删除
			type: Boolean,
			required: true,
			default: false,
			select: false
		},
	},
	{ timestamps: true }
);

module.exports = model('Functive', functiveSchema);
