const Router = require('koa-router');
const router = new Router({ prefix: '/api/users' });
const { Auth } = require('../middlewares/auth');
const {
	parameter,
	softDelete
} = require('../middlewares/filter');

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
	findBindRole,
	checkUserRelationRoleExist,
	createBindRole,
	removeBindRole,
	checkUserExist,
	userInfo
} = require('../controllers/users');

const { 
	cropAvatar
} = require('../controllers/file');

router.get('/', find);

router.post('/', parameter, create);

router.patch('/:id', new Auth(8).m, checkOwner, checkUserExist, parameter, update);

// 强删除 只有超级管理员可以删除用户，自己也不行
router.delete('/:id', new Auth(32).m, checkUserExist , del);

// 软删除
router.delete('/delete/:id', new Auth(32).m, checkUserExist, softDelete, update);

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
	userInfo
);

router.get('/:id/bind/role', findBindRole);

router.post('/:id/bind/role', new Auth(16).m, checkUserRelationRoleExist('gt'), createBindRole);

router.post('/:id/remove/bind/role', new Auth(16).m, checkUserRelationRoleExist('lt'), removeBindRole);

// 头像更换接口
// 1.需要验证登陆
// 2.是否是本人
// 3.对头像文件进行处理（裁剪，转存）
// 4.更改数据库用户头像链接字段
router.post('/:id/update/avatar',new Auth(8).m, checkOwner, cropAvatar, update);

module.exports = router;
