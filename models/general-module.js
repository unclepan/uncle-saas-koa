const mongoose = require('mongoose');
const { Schema, model } = mongoose;

class ModelInstance {
	constructor(){
		this.modelInstanceList = {};
	}
	init(m = {}, modelName ){	
		// 如果已存在就直接拿
		if (this.modelInstanceList[modelName]) {
			return this.modelInstanceList[modelName];
		} else {
			let obj = Object.assign({
				__v: {
					type: Number,
					select: false
				},
				del: { // 软删除
					type: Boolean,
					required: true,
					default: false,
					select: false
				},
			}, m);
			const moduleSchema = new Schema(obj, { timestamps: true });
			this.modelInstanceList[modelName] = model(modelName, moduleSchema);
			return this.modelInstanceList[modelName];
		}
	}
}

module.exports = new ModelInstance();