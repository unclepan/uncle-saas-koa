const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const monitorSchema = new Schema(
	{
		__v: {
			type: Number,
			select: false
		},
		monitor: {
			type: Object,
			required: true
		},
		
	},
	{ timestamps: true }
);

module.exports = model('Monitor', monitorSchema);
