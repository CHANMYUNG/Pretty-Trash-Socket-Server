const app = require('express')();

const server = require('http').createServer(app);

const io = require('socket.io')(server);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index-room.html');
})

io.on('connection', function (socket) {
    socket.on("chat", function (chat) {
        console.log(chat);
        console.log('chat')
        socket.broadcast.emit('chat', {
            "message": chat.msg
        });
    })
})

server.listen(3000, function () {
    console.log('IO SERVER LISTENING ON 3000 PORT')
})