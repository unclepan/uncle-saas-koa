class FilterCtl {
	async parameter (ctx, next){
		const { del } = ctx.request.body;
		if (del) {
			delete ctx.request.body.del;
		}
		await next();
	}
	async softDelete (ctx, next) {
		ctx.request.body = {};
		ctx.request.body.del = true;
		await next();
	}
}
module.exports = new FilterCtl();