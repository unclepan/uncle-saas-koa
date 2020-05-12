const Router = require('koa-router');
const router = new Router({ prefix:'/api/role'});
const { Auth } = require('../middlewares/auth');
const { 
	find, 
	findById, 
	create, 
	update,
	checkRoleExist,
	delete: del,
} = require('../controllers/role');

router.get('/', find);

router.post('/', new Auth(16).m, create);

router.get('/:id', checkRoleExist, findById);

router.patch('/:id', new Auth(16).m, checkRoleExist, update);

router.delete('/:id', new Auth(16).m, checkRoleExist, del);

module.exports = router;