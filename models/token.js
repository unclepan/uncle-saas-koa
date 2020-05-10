const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const tokenSchema = new Schema(
	{
		__v: {
			type: Number,
			select: false
		},
		token: {
			type: String,
			required: true
		},
	},
	{ timestamps: true }
);

module.exports = model('Token', tokenSchema);
