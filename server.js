var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require("path");

const static_path = path.join(__dirname);

app.set('views', static_path);

app.use(express.static(static_path));

app.get('/', function (req, res) {
    res.sendfile(static_path + "index.html");
});

var users = {};

var initialAmount = {};

function flip() {
    let _score = 0;
    while(Math.floor(Math.random() * 2) == 0){
        _score++;
    }
    return Math.pow(2, _score);
};

var whoHasToFlip = {};
io.on('connection', function (socket) {
    socket.on('subscribe', (data) => {
        //subscribe/join a room
        socket.join(data.socketId);
        socket.join(data.room);
        var c = 0;
        for (var key in users) {
            if (key.split(',')[0] === data.room) {
                c++;
                break;
            }
        }
        if(c===0){
            whoHasToFlip[data.room] = data.username;
        }
        users[[data.room, data.username]] = {
            socketId: data.socketId,
            score: 0,
            decisionPhase: 0,
            amount: 0
        };

        io.emit('showUsers', {
            userList: users
        });
        io.emit('newUser', {
            user: data.username
        });
        
    });
    
    socket.on('message1', function (data) {
        for (var key in users) {
            if (socket.id === users[key].socketId) {
                var d = users[key].decisionPhase;
                var f = flip();
                if(d===1){
                    users[key].score = f;
                    users[key].amount = data.amount;
                    io.emit('showUsers', {
                        userList: users,
                    });
                    io.in(data.socketId).emit('disable');
                }
                io.emit('message', {
                    payed: data.amount,
                    users: users,
                    user: key.split(',')[1],
                    guessedWord: f,
                    room: key.split(',')[0],
                    socketId: data.socketId,
                });
                break;
            }
        }
    });

    socket.on('messageForDecisionPhase', function (data) {
        console.log("hello")
        for (var key in users) {
            if (socket.id === users[key].socketId) {
                users[key].decisionPhase = 1,
                io.emit('messageForDecisionPhase', {
                    user: key.split(',')[1]
                });
                break;
            }
        }
    });

});
server.listen(process.env.PORT || 3000);