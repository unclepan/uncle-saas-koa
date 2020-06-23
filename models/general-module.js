const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const common = require('../common/db');

class ModelInstance {
	constructor(){
		this.modelInstanceList = {};
	}
	init(m = {}, modelName,ctx){	
		// 如果已存在就要先删除
		if (this.modelInstanceList[modelName]) {
			if(common.dbModelName.indexOf(modelName) >= 0){
				ctx.throw(409, '系统预置数据库model，禁止delete操作');
			}
			delete mongoose.models[modelName];
			delete mongoose.modelSchemas[modelName];
			delete this.modelInstanceList[modelName];
		}
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

module.exports = new ModelInstance();