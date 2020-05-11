// const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({ prefix: '/api/users' });
const { Auth } = require('../middlewares/auth');
const {
	find,
	findById,
	whetherName,
	verify,
	create,
	update,
	delete: del,
	login,
	logout,
	checkOwner,
} = require('../controllers/users');

router.get('/', find);

router.post('/', create);

router.patch('/:id', new Auth().m, checkOwner, update);

router.delete('/:id', new Auth(32).m, del); // 只有超级管理员可以删除用户，自己也不行

router.get('/find/:id', findById);

router.get('/whether/name', whetherName);

router.post('/verify', verify);

router.post('/login', login);

router.post('/logout', logout);

router.get('/info',
	new Auth().m, 
	async(ctx, next) => {
		ctx.params.id = ctx.state.user._id;
		await next();
	}, 
	findById
);

module.exports = router;
