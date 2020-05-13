
const path = require('path');

class FileCtl {
	upload(ctx) {
		const file = ctx.request.files.file;
		const basename = path.basename(file.path);
		ctx.body = {
			basename
		};
	}
  
}
module.exports = new FileCtl();
