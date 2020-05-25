// 角色与功能关联表
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const functiveRelationRoleSchema = new Schema(
	{
		__v: {
			type: Number,
			select: false
		},
		functive: {
			type: Schema.Types.ObjectId,
			ref: 'Functive',
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

module.exports = model('functiveRelationRole', functiveRelationRoleSchema);
