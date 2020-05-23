const Router = require('koa-router');
const router = new Router({ prefix:'/api/file'});
// const { Auth } = require('../middlewares/auth');
const { 
	upload,
	rename
} = require('../controllers/file');

router.post('/upload', upload);

router.post('/rename', rename);

module.exports = router;