
import h from './helper.js';

window.addEventListener('load', () => {

    const chatRoom = document.getElementsByClassName("guess")[0];
    let socket = io();
    const room = h.getQString(location.href, 'room');
    const username = sessionStorage.getItem('username');
    console.log(room, username);
    if (!room) {
        document.querySelector('#room-create').attributes.removeNamedItem('hidden');
        document.querySelector('#room-create').style.display = 'flex';
        document.querySelector('#username-set').style.display = 'none';
        let commElem = document.getElementsByClassName("entered");
        for (let i = 0; i < commElem.length; i++) {
          commElem[i].style.display = 'none';
        }
    }

    else {
        document.querySelector("#username-set").style.display = "none";
        document.querySelector("#room-create").style.display = 'none';
        let commElem = document.getElementsByClassName('entered');

        for (let i = 0; i < commElem.length; i++) {
            commElem[i].attributes.removeNamedItem('hidden');
            commElem[i].style.display = 'flex';
        }

        var socketId = '';

        socket.on('connect', () => {
            //set socketId
            socketId = socket.id;

            socket.emit('subscribe', {
                room: room,
                socketId: socketId,
                username: username

            });

        });

        socket.on('showUsers', (data) => {
            console.log(data);
            var users = data.userList;
            h.users(users);
        })
        socket.on('newUser', (data) => {
            document.querySelector('.message').innerHTML += "<div class='boxer'>" + data.user + " has joined.</div>";
            chatRoom.scrollTop = chatRoom.scrollHeight;
        })
    }

    var decision = document.querySelector('.submit1')

    decision.addEventListener('click', function (e) {
        decision.innerHTML = "Decision Phase Active",
        decision.disabled = true,
        socket.emit('messageForDecisionPhase', {
            socketId: socketId,
        });

    });

    socket.on('messageForDecisionPhase', function (data) {
        document.querySelector('.message').innerHTML += "<div class='boxer'>" + data.user + " has entered the decision phase." + "</div>";
        chatRoom.scrollTop = chatRoom.scrollHeight;
    });
    
    var flip = document.querySelector('.submit')

    flip.addEventListener('click', function (e) {
        socket.emit('message1', {
            socketId: socketId,
            amount: document.querySelector('.input').value
        });
    });

    socket.on('message', function (data) {
        document.querySelector('.message').innerHTML += "<div class='boxer'>" + data.user + " payed : " + data.payed +" and won : " + data.guessedWord + "</div>";
        chatRoom.scrollTop = chatRoom.scrollHeight;
    });

    socket.on('disable', function (data) {
        document.querySelector('.submit').disabled=true;
    });
    
    socket.on('tell', function (data) {
        document.querySelector('.message').innerHTML += "<div class='boxer'>" + data.mess + "</div>";
        chatRoom.scrollTop = chatRoom.scrollHeight;
    });

});
