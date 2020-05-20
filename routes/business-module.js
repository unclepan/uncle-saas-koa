const Router = require('koa-router');
const router = new Router({ prefix:'/api/module'});
const { Auth } = require('../middlewares/auth');
const {
	parameter
} = require('../middlewares/filter');

const { 
	find, 
	findById, 
	create, 
	update,
	checkBusinessModuleExist,
	delete: del,
} = require('../controllers/business-module');

router.get('/', find);

router.post('/', new Auth(16).m, parameter, create);

router.get('/:id', findById);

router.patch('/:id', new Auth(16).m, checkBusinessModuleExist, parameter, update);

//硬删除
router.delete('/:id', new Auth(16).m, checkBusinessModuleExist, del);

//软删除
router.delete('/delete/:id', new Auth(16).m, checkBusinessModuleExist, async(ctx, next) => {
	ctx.request.body.del = true;
	await next();
}, update);

module.exports = router;