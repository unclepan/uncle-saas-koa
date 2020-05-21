const Router = require('koa-router');
const router = new Router({ prefix:'/api/module'});
const { Auth } = require('../middlewares/auth');
const {
	parameter,
	softDelete
} = require('../middlewares/filter');

const { 
	find, 
	findById, 
	create, 
	update,
	checkBusinessModuleExist,
	delete: del,
} = require('../controllers/business-module');

// 过滤掉type，此字段不允许更改
const filterType = async(ctx, next) =>{ 
	const { type } = ctx.request.body;
	if (type) {
		delete ctx.request.body.type;
	}
	await next();
};

router.get('/', find);

router.post('/', new Auth(16).m, parameter, filterType, create);

router.get('/:id', findById);

router.patch('/:id', new Auth(16).m, checkBusinessModuleExist, parameter, filterType, update);

//硬删除
router.delete('/:id', new Auth(16).m, checkBusinessModuleExist, del);

//软删除
router.delete('/delete/:id', new Auth(16).m, checkBusinessModuleExist, softDelete, update);

module.exports = router;