const router = require('koa-router')();

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

module.exports = router;
