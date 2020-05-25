# 开发备忘

脚本：

```
初始化系统，带上系统管理
数据删除除日志等，一律软删除
生成的动态模块的同时在功能项中，要同时生成一条数据，在功能项管理的时候，如果更改的是动态模块生成的数据，删除或者编辑，同时要影响动态模块管理的数据。
模块生成数据库文档，不能与已有文档重名，新建module的时候需要加入验证

头像编辑：
拿到头像
有头像：初始化裁剪编辑器
无头像：不初始化裁剪编辑器，隐藏裁剪按钮。上传

权限：
菜单menu（getUserInfo）接口：从用户所拥有的角色里取（角色下关联了功能项）

新环境项目启动脚本：
在功能项管理中新增“首页”“权限管理”两条数据，如果后面有自定义模块，也是同理。


模块管理：增加推入到功能项功能。一切前端页面展示都以“功能项”，来展示，比如：如果新增了一个“动态模块”，那么不推送到功能项（即不在功能项创建一条数据）那也只是沉淀在数据库里，并无业务意义。

模块的字段不能重名


优化 createModelInstance 方法


前端表单还有一个事件通信要处理


文件类型不同 图标不同

模块列表搜索

模块推送到功能项 类型和 link不允许更改

动态模块的搜索还没做
```

## 角色
```
角色与用户关联通过的是 user-relation-role 中间表的操作，角色和用户是两张独立的表，没有关联。
角色与功能的关联通过 functive  外键关联。
```

## 图片处理
```
服务器要安装 imageMagick
```

## 定时任务
```
定时清空 uploads/transfer
定时查询用户头像链接，并清理 uploads/avatar没被引用的文件
功能项管理，父级项被软除删，子级也要删除
定时清理没有被动态模块引用的文件
```

## 开发对接顺序
```
登陆
注册
个人中心
角色
  角色遗留编辑select，中间件化
  遗留关联用户
  
```

## 前端
```
定时器时刻测试，直至上线删除，修改成分钟模式

角色：新增编辑下的SELECT options 也需要改造成中间件模式

模块字段编辑器的样式要调整

动态模块编辑器，要完善验证，和事件通讯的功能

模块管理 增加 编辑 ，删除的配置

选择类型的组件 还有一个opton属性
```

