// const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({ prefix: '/api/users' });
const { Auth } = require('../middlewares/auth');
const {
	find,
	findById,
	fundByName,
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

router.get('/:id', findById);

router.get('/fund/name', fundByName);

router.patch('/:id', new Auth().m, checkOwner, update);

router.delete('/:id', new Auth().m, checkOwner, del);

router.post('/verify', verify);

router.post('/login', login);

router.post('/logout', logout);

router.get('/login/info',
	new Auth().m, 
	async(ctx, next) => {
		ctx.params.id = ctx.state.user._id;
		await next();
	}, 
	findById
);

module.exports = router;
