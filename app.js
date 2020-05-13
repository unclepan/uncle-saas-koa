const path = require('path');
const _ = require('lodash');
const Koa = require('koa');
const cors = require('@koa/cors');
const koaBody = require('koa-body');
const error = require('koa-json-error');
const parameter = require('koa-parameter');
const mongoose = require('mongoose');
const views = require('koa-views');
const logger = require('koa-logger');
const routing = require('./routes');
const { connectionStr } = require('./config');

const app = new Koa();

// 数据库连接
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(connectionStr, { useNewUrlParser: true, useUnifiedTopology: true }, ()=>console.log('数据库连接成功'));
mongoose.connection.on('error', console.error);

// 跨域
app.use(cors());

//输出请求日志的功能
app.use(logger());

//静态文件服务
app.use(require('koa-static')(__dirname + '/public'));
app.use(require('koa-static')(__dirname + '/uploads'));

//进行视图模板渲染
app.use(views(__dirname + '/views', {
	extension: 'pug'
}));

// logger
app.use(async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 错误处理
app.use(error({
	postFormat: (e, obj) => process.env.NODE_ENV === 'production' ? _.omit(obj, 'stack') : obj
}));

//可以实现文件上传，同时也可以让koa能获取post请求的参数
app.use(koaBody({
	multipart: true, // 支持 multipart-formdate 的表单，意思就是支持文件上传(文件的Content-Type就叫multipart-formdate)
	formidable: { // koa-body集成了formidable包
		uploadDir: path.join(__dirname, '/uploads/transfer'),
		keepExtensions: true //保留拓展名
	},
	formLimit: '10mb',
	jsonLimit: '10mb',
	textLimit: '10mb',
	enableTypes: ['json', 'form', 'text']
}));

// 参数校验
app.use(parameter(app));

//路由
routing(app);

// error-handling
app.on('error', (err, ctx) => {
	console.error('server error', err, ctx);
});

module.exports = app;
