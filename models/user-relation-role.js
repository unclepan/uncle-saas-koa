// 角色与用户关联表
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userRelationRoleSchema = new Schema(
	{
		__v: {
			type: Number,
			select: false
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		role: {
			type: Schema.Types.ObjectId,
			ref: 'Role',
			required: true
		}
	},
	{ timestamps: true }
);

module.exports = model('userRelationRole', userRelationRoleSchema);
