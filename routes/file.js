const Router = require('koa-router');
const router = new Router({ prefix:'/api/file'});
// const { Auth } = require('../middlewares/auth');
const { 
	upload
} = require('../controllers/file');

router.post('/upload', upload);

module.exports = router;