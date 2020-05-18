const Router = require('koa-router');
const router = new Router({ prefix:'/api/functive'});
const { Auth } = require('../middlewares/auth');
const {
	parameter
} = require('../middlewares/filter');
const { 
	find, 
	findTree,
	findById, 
	create, 
	update,
	checkFunctiveExist,
	delete:del,
} = require('../controllers/functive');

router.get('/', find);

router.get('/tree', findTree);  // 匹配优先级比/:id 要高

router.post('/', new Auth(16).m, parameter, create);

router.get('/:id', findById);

router.patch('/:id', new Auth(16).m, checkFunctiveExist, parameter, update);

router.delete('/:id', new Auth(16).m, checkFunctiveExist, del);

router.delete('/delete/:id', new Auth(16).m, checkFunctiveExist, async(ctx, next) => {
	ctx.request.body.del = true;
	await next();
},update);

module.exports = router;