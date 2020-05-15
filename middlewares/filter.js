class FilterCtl {
	async parameter (ctx, next){ // 软删除，在更新操作中，如果带了del字段，就删除
		const { del } = ctx.request.body;
		if (del) {
			delete ctx.request.body.del;
		}
		await next();
	}
}
module.exports = new FilterCtl();