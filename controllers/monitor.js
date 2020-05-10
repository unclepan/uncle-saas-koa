const MONITOR = require('../models/monitor');
const moment = require('moment');

class MonitorCtl {
	async create(ctx) {
		const {data} = ctx.request.body;
		let v = JSON.parse(data);
		try {
			for(let i = 0; i < v.length; i++){
				new MONITOR({
					monitor: {...v[i], tFom: moment(v[i].t).format('YYYY/MM/DD HH:mm:ss')},
				}).save();
			}
			ctx.body = { mas: '监控数据存储成功' };
		} catch (error) {
			ctx.throw(503, error);
		}	
	}
	async find(ctx) {
		ctx.body = await MONITOR.find();
	}
}

module.exports = new MonitorCtl();
