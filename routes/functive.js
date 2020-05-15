const Router = require('koa-router');
const router = new Router({ prefix:'/api/functive'});
const { Auth } = require('../middlewares/auth');
const {
	parameter
} = require('../middlewares/filter');
const { 
	find, 
	findById, 
	create, 
	update,
	checkFunctiveExist,
	delete:del,
} = require('../controllers/functive');

router.get('/', find);

router.post('/', new Auth(16).m, create);

router.get('/:id', checkFunctiveExist, findById);

router.patch('/:id', new Auth(16).m, checkFunctiveExist,parameter, update);

router.delete('/:id', new Auth(16).m, checkFunctiveExist, del);

module.exports = router;