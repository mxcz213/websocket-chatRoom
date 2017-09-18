/**
	
*/
var ws = require('nodejs-websocket');
var PORT = 3000;
var clientCount = 1;
var server = ws.createServer(function(conn){
	console.log('New connection');
	conn.nickname = '用户' + clientCount;
	clientCount ++;
	var userData = {};
	userData.type = 'enter';
	userData.message = conn.nickname + '加入聊天';
	userData.id = clientCount;
	broadcaseMessage(JSON.stringify(userData));
	conn.on('text',function(str){
		console.log("Reveived:" + str);
		var userData = {};
		userData.type = 'message';
		userData.nickname = conn.nickname;
		userData.id = clientCount;
		userData.message = str;
		broadcaseMessage(JSON.stringify(userData));
	});

	conn.on('close',function(code,reason){
		console.log('connection closed');
		var userData = {};
		userData.type = 'leave';
		userData.id = clientCount;
		userData.message = conn.nickname + '退出聊天';
		broadcaseMessage(JSON.stringify(userData));
	});

	conn.on('error',function(err){
		console.log('handle error');
		console.log(err);
	});
}).listen(PORT);
console.log('chat server listen:' + PORT);

function broadcaseMessage(str){
	server.connections.forEach(function(connection){
		connection.sendText(str);
	})
}