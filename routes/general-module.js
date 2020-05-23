const Router = require('koa-router');
const router = new Router({ prefix:'/api/module/general'});
const { Auth } = require('../middlewares/auth');

const { parameter, softDelete} = require('../middlewares/filter');
const { checkSystemModuleExist } = require('../controllers/system-module');
const { 
	createModelInstance,
	create,
	find,
	checkExist,
	findById,
	update,
	delete: del,
	module: mo
} = require('../controllers/general-module');

router.get('/:id', checkSystemModuleExist, createModelInstance, find);

router.get('/:id/module', checkSystemModuleExist, mo);

router.post('/:id', new Auth(16).m, checkSystemModuleExist, createModelInstance, parameter, create);

router.get('/:id/:vid', checkSystemModuleExist, createModelInstance, findById);

router.patch('/:id/:vid', new Auth(16).m, checkSystemModuleExist, createModelInstance, checkExist, parameter, update);

router.delete('/:id/:vid', new Auth(16).m, checkSystemModuleExist, createModelInstance, checkExist, del);

//软删除
router.delete('/delete/:id/:vid', new Auth(16).m, checkSystemModuleExist, createModelInstance, checkExist, softDelete, update);


module.exports = router;