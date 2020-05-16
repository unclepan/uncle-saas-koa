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
	deleteBindUser
} = require('../controllers/role');

router.get('/', find);

router.post('/', new Auth(16).m, create);

router.get('/:id', findById);

router.patch('/:id', new Auth(16).m, checkRoleExist, parameter, update);

router.delete('/:id', new Auth(16).m, checkRoleExist, del);

router.get('/:id/bind/user', new Auth(16).m, findBindUser);

router.post('/:id/bind/user', new Auth(16).m, checkUserRelationRoleExist('gt'), createBindUser);

router.post('/:id/delete/bind/user', new Auth(16).m, checkUserRelationRoleExist('lt'), deleteBindUser);

module.exports = router;