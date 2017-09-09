const app = require('express')();

const server = require('http').createServer(app);

const io = require('socket.io')(server);

let connections = {};

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})

app.get('/room', function (req, res) {
    res.sendFile(__dirname + '/room.html');
})

io.on('connection', function (socket) {

    socket.on('enter', function (user) {
        console.log(user.name);

        io.emit('notice', {
            "message": user.name + ' ENTERED'
        });

        connections[socket.id] = user.name;
        console.log(connections);
    })

    socket.on("chat", function (chat) {

        // get sender's name 
        sender = connections[`${socket.id}`];

        // forEach :: all of connections socket id
        Object.keys(connections).forEach((socketId) => {

            // if sender is me :: Do nothing
            if (socket.id === socketId) return true; // in forEach Syntax, 'return true;' = 'continue;', 'return false;' = 'break;'

            // sender isn't me && the name same with other user
            if (connections[socketId] === sender) {
                // emit 'non-block-chat' event  to the users
                io.to(socketId).emit('non-block-chat', {
                    "message": sender + " : " + chat.msg,
                })
            }

            // sender isn't me && the name doesn't same with other users
            // emit 'block-chat' event  to the users
            else io.to(socketId).emit('block-chat', {
                "message": sender + " : " + chat.msg
            })
        })
    });

    socket.on('disconnect', function () {
        delete connections[socket.id];
        console.log(connections);
    });
})

server.listen(3000, function () {
    console.log('IO SERVER LISTENING ON 3000 PORT')
})