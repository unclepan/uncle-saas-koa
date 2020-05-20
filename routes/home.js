const router = require('koa-router')();
const fuc = require('../test/model');


router.get('/', async (ctx) => {
	await ctx.render('index', {
		title: '你好！这是杨盼的内容管理系统。'
	});
});

router.get('/string', async (ctx) => {
	ctx.body = 'koa2 string';
});

router.get('/json', async (ctx) => {
	ctx.body = {
		title: 'koa2 json'
	};
});


router.get('/test', async (ctx) => {
	let testModela = fuc({
		name: {
			type: String,
			required: true
		},
		ename: {
			type: String,

		},
		link: {
			type: String,
		},
		icon: {
			type: String,
		}
	}, 'testModela');

	ctx.body  = await new testModela({
		name: '2222',
		xxxx:'vvvv'
	}).save();
	
});
module.exports = router;
