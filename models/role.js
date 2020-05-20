const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const roleSchema = new Schema(
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
		},
		state: { // 状态
			type: Boolean,
			required: true,
			default: false
		},
		functive: { // 已分配的功能项
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: 'Functive',
				}
			]
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

module.exports = model('Role', roleSchema);
