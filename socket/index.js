const Message = require('../models/message');

module.exports = function(io){
	let users = [];
	let discUsers = [];
	io.on('connection', async socket => {
		socket.on('one', async() => {
			let res = await Message.find({}).populate('user');
			io.emit('getMsg', res);
		});	
		
		//新人进来在线人数
		socket.on('users', data => {
			users = users.filter((item) => {
				return data._id !== item._id;
			});
			users.push(data);
			io.emit('users', users); //将消息发送给所有人。
		});

		// 某个客户端断开之后，查看还有哪些人在线
		socket.on('discUsers', data => {
			discUsers.push(data);
			if(discUsers.length + 1 === users.length) {
				users = discUsers;
				io.emit('users', users); //将消息发送给所有人。
			}
		});
    
		//disconnnect断开,自带函数方法
		socket.on('disconnect', data => {
			discUsers = [];
			io.emit('disconnecting', data); //将消息发送给所有人。
		});

		socket.on('send', data => {
			try {
				let oneUser = new Message({ user: data['user'], msg: data['getMsg'] });
				oneUser.save().then(async () => {
					let res = await Message.find({}).populate('user');
					io.emit('getMsg', res); //通知所有客户端
				});
			} catch (error) {
				console.log('失败',error);
			}
		});
	});
};

// io.sockets.on(‘connection’, function(socket) {})：socket连接成功之后触发，用于初始化
// socket.on(‘message’, function(message, callback) {})：客户端通过socket.send来传送消息时触发此事件，message为传输的消息，callback是收到消息后要执行的回调
// socket.on(‘anything’, function(data) {})：收到任何事件时触发
// socket.on(‘disconnect’, function() {})：socket失去连接时触发（包括关闭浏览器，主动断开，掉线等任何断开连接的情况）

// connect：连接成功
// connecting：正在连接
// disconnect：断开连接
// connect_failed：连接失败
// error：错误发生，并且无法被其他事件类型所处理
// message：同服务器端message事件
// anything：同服务器端anything事件
// reconnect_failed：重连失败
// reconnect：成功重连
// reconnecting：正在重连
