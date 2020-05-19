const Router = require('koa-router');
const router = new Router({ prefix:'/api/role'});
const { Auth } = require('../middlewares/auth');
const {
	parameter
} = require('../middlewares/filter');

const { 
	find, 
	findById, 
	create, 
	update,
	checkRoleExist,
	delete: del,
	findBindUser,
	checkUserRelationRoleExist,
	createBindUser,
	removeBindUser
} = require('../controllers/role');

router.get('/', find);

router.post('/', new Auth(16).m, parameter, create);

router.get('/:id', findById);

router.patch('/:id', new Auth(16).m, checkRoleExist, parameter, update);

//硬删除
router.delete('/:id', new Auth(16).m, checkRoleExist, del);

//软删除
router.delete('/delete/:id', new Auth(16).m, checkRoleExist, async(ctx, next) => {
	ctx.request.body.del = true;
	await next();
}, update);

router.get('/:id/bind/user', new Auth(16).m, findBindUser);

router.post('/:id/bind/user', new Auth(16).m, checkUserRelationRoleExist('gt'), createBindUser);

router.post('/:id/remove/bind/user', new Auth(16).m, checkUserRelationRoleExist('lt'), removeBindUser);

module.exports = router;