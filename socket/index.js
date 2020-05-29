const Message = require('../models/message');

module.exports = function(io){
	let sum = 0;
	console.log(12345);
	io.on('connection', socket => {
		console.log('初始化成功！');
		Message.find({}, function (err, res) {
			io.emit('getMsg', res);
		});
		//新人进来在线人数+1
		socket.on('users',data => {
			console.log(data);
			sum = sum + 1;
			io.emit('users',sum); //将消息发送给所有人。
		});
    
		//disconnnect断开,自带函数方法
		socket.on('disconnect',data=>{
			console.log(data);
			console.log('用户断开了');
			sum = sum - 1;
			io.emit('users',sum); //将消息发送给所有人。
		});
		socket.on('send', data => {
			// console.log('客户端发送的内容：',data, data['name'], data['getMsg']);
			try {
				let oneUser = new Message({ name: data['name'], msg: data['getMsg'] });
				oneUser.save().then(() => {
					Message.find({}, function (err, res) {
						console.log('获取到数据', res);
						socket.emit('getMsg', res); //通知触发该方法的客户端
						io.emit('getMsg', res); //通知所有客户端
					});
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
