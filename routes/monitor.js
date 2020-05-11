const Router = require('koa-router');
const router = new Router({
	prefix: '/api/monitor'
});
const { find , create} = require('../controllers/monitor');

router.get('/', find);
router.post('/', create);

module.exports = router;