module.exports = {
	toTreeAndMap(data) {
		// 删除所有subMenus, 以防止多次调用
		data.forEach(function (item) {
			delete item.subMenus;
		});

		// 将数据存储为 以id为KEY的map索引数据列 
		const map = {};
		data.forEach(function (item) {
			map[item._id] = item;
			item.id = item._id;
			item.menuName = `far.${item.ename}`;
			item.invokeUrl = item.link;
			item.iconStr = item.icon;
		});
    
		const en = {};
		const zh = {}; 
		const val = [];	
		data.forEach(function (item) {
			en[item.ename] = item.ename;
			zh[item.ename] = item.name;	
			if(item.type === 'menu'){
				// 以当前遍历项的parent，去map对象中找到索引的id
				const parent = map[item.parent];
				// 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
				if (parent) {
					(parent.subMenus || ( parent.subMenus = [] )).push(item); 
				} else if( item.parent === 'parent') {
					//如果没有在map中找到对应的索引id，并且它为最顶层，那么直接把当前的item添加到val结果集中，作为顶级
					val.push(item);
				}
			}
		});
		return {
			treeData: val, // 树结构json数据 可以渲染html
			map, // 索引数据 方便通过ID查找所有子节点ID
			en,
			zh
		};
	}
};