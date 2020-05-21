const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const businessModuleSchema = new Schema(
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
			unique: true,
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
		type: { // 功能类型
			type: String,
			default: 'module',
			required: true
		},
		module: {
			type: [
				{
					name: {
						type: String,
						required: true
					},
					open: {
						type: Boolean,
						required: true
					},
					list: {
						type: [
							{
								name: {
									type: String,
									required: true,
									trim: true
								},
								value: Object,
								label: {
									type: String,
									required: true,
									trim: true
								},
								type: {
									type: String,
									required: true,
									trim: true
								},
								rules: Object,
								describe: {
									type: String,
									trim: true
								},
								meta: Object,
								event: {
									emit: {
										type: String,
										trim: true
									},
									on: {
										type: String,
										trim: true
									}
								},
								set: {
									type: Boolean,
									required: false
								},
							}
						],
					}
				}
			],
		},
		state: { // 状态
			type: Boolean,
			required: true,
			default: false
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

module.exports = model('BusinessModule', businessModuleSchema);
