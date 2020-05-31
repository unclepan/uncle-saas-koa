const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const messageSchema = new Schema(
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
		msg: {
			type: String,
			required: true
		},
	},
	{ timestamps: true }
);

module.exports = model('Message', messageSchema);
