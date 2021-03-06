const Router = require('koa-router');
const router = new Router({ prefix:'/api/option'});
const { Auth } = require('../middlewares/auth');
const {
	parameter,
	softDelete
} = require('../middlewares/filter');
const { 
	find,
	findOption, 
	checkOptionExist,
	findOptionById, 
	createOption, 
	updateOption,
	deleteOption,
	findOptionValue,
	checkOptionValueExist,
	createOptionValue,
	findOptionValueById,
	updateOptionValue,
	deleteOptionValue
} = require('../controllers/option');

router.get('/', findOption);

router.post('/', new Auth(16).m, parameter, createOption);

router.get('/:id', findOptionById);

router.patch('/:id', new Auth(16).m, checkOptionExist, parameter, updateOption);

router.delete('/:id', new Auth(16).m, checkOptionExist, deleteOption);

//软删除
router.delete('/delete/:id', new Auth(16).m, checkOptionExist, softDelete, updateOption);


// 以下为选项值
router.get('/value/:id', findOptionValue);

router.post('/value/:id', new Auth(16).m, parameter, createOptionValue);

router.get('/value/:vid', checkOptionValueExist, findOptionValueById);

router.patch('/value/:id/:vid', new Auth(16).m, checkOptionValueExist, parameter, updateOptionValue);

router.delete('/value/:vid', new Auth(16).m, checkOptionValueExist, deleteOptionValue);

//软删除
router.delete('/value/delete/:vid', new Auth(16).m, checkOptionValueExist, softDelete, updateOptionValue);

// 公共选项
router.get('/select/:ename', find);

module.exports = router;