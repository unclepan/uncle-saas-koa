const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// const functiveSchema = new Schema(
// 	{
// 		__v: {
// 			type: Number,
// 			select: false
// 		},
// 		name: {
// 			type: String,
// 			required: true
// 		},
// 	},
// 	{ timestamps: true }
// );

// module.exports = model('Functive', functiveSchema);

module.exports = function (m = {}, modelName ) {
	let obj = Object.assign({
		__v: {
			type: Number,
			select: false
		},
	},m);
	const schema = new Schema(
		obj,{ timestamps: true }
	);

	return model(modelName, schema);
};



