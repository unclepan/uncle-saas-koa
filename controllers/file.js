const fs = require('fs');
const path = require('path');
const gm = require('gm').subClass({imageMagick: true});

class FileCtl {
	async upload(ctx) {
		const file = ctx.request.files.file;
		const basename = path.basename(file.path);
		ctx.body = {
			basename
		};
	}
	async cropAvatar(ctx,next){
		ctx.verifyParams({
			basename: { type: 'string', required: true },
			cropperData: { type: 'object', required: true },
			newPic: { type: 'bool', required: true }
		});
		const { basename, cropperData, newPic } = ctx.request.body;
		if(basename !== 'default.png'){
			let formLink = path.join( './uploads/avatar', basename);
			let toLink = path.join( './uploads/avatar', basename);
			if(newPic){
				formLink = path.join('./uploads/transfer', basename);
			}
			try {
				await FileCtl.crop(formLink, toLink, cropperData, newPic);
				ctx.request.body = {avatar: `/avatar/${basename}`};
				await next();
			} catch (error) {
				ctx.throw(501, error);
			}
		} else {
			ctx.throw(401, '默认头像不可修改');
		}	
	}

	static crop(formLink, toLink, cropperData, newPic) {
		const { width, height, x, y } = cropperData;
		return new Promise(function (resolve, reject) {
			gm(formLink)
				.identify(function (err) {
					if (!err) {
						this.crop(width, height, x, y);
						this.resize(240, 240, '!');
						this.write(toLink, function (err) {
							if (!err) {
								if(newPic){
									fs.unlink(formLink,(uerr) => {
										if(!uerr) resolve('裁剪并删除原图成功');
									});
								} else {
									resolve('裁剪成功');
								}	
							} else {
								reject(err);
							}
						});
					} else {
						reject(err);
					}
				});	
		});
	}

}
module.exports = new FileCtl();
