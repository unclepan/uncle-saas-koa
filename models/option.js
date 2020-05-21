const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const optionSchema = new Schema(
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
			required: true,
			validate: {
				validator(v) {
					return (/^[a-z]+$/i).test(v);
				},
				message: '非英文，请正确填写!'
			}
		},
		description: {
			type: String,
			required: true
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

const optionValueSchema = new Schema(
	{
		__v: {
			type: Number,
			select: false
		},
		optionId: { // 属于那一个选项
			type: Schema.Types.ObjectId,
			ref: 'Option',
			required: true,
			select: false
		},
		name: {
			type: String,
			required: true
		},
		ename: {
			type: String,
			required: true,
			validate: {
				validator(v) {
					return (/^[a-z]+$/i).test(v);
				},
				message: '非英文，请正确填写!'
			}
		},
		value:{
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
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

module.exports = {
	Option: model('Option', optionSchema), // 选项
	OptionValue: model('OptionValue', optionValueSchema), // 选项值
};
