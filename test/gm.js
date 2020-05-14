// eslint-disable-next-line no-unused-vars
const fs = require('fs');
const gm = require('gm').subClass({imageMagick: true});


gm('./uploads/transfer/upload_1096cecd14efa1fb206f7028e15d0139.jpg')
	.resize(240, 240, '!')
	.noProfile()
	.write('./uploads/avatar/123.jpg', function (err) {
		if (!err) console.log('成功');
	});