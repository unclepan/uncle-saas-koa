const glob = require('glob'); // 获取匹配规则的所有文件
const { resolve } = require('path');

module.exports = (app) => {
	try{
		glob.sync(resolve(__dirname, './**/!(index).js')).forEach(file => {
			const router = require(file);
			app.use(router.routes());
			app.use(router.allowedMethods());
		});
	} catch (err){
		console.log(err);
	}
    
};