# 开发备忘

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
```