const Router = require('koa-router');
const router = new Router({ prefix:'/api/option'});
const { Auth } = require('../middlewares/auth');
const { 
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

router.post('/', new Auth(16).m, createOption);

router.get('/:id', checkOptionExist, findOptionById);

router.patch('/:id', new Auth(16).m, checkOptionExist, updateOption);

router.delete('/:id', new Auth(16).m, checkOptionExist, deleteOption);

router.get('/value/:id', findOptionValue);

router.post('/value/:id', new Auth(16).m, createOptionValue);

router.get('/value/id/:vid', checkOptionValueExist, findOptionValueById);

router.patch('/value/id/:vid', new Auth(16).m, checkOptionValueExist, updateOptionValue);

router.delete('/value/id/:vid', new Auth(16).m, checkOptionValueExist, deleteOptionValue);

module.exports = router;