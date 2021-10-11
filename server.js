const path = require('path');
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const http = require('http');
const socketIO = require('socket.io');

// Variables
let users = [];
let user = {};

//Load Config
dotenv.config({path: './config/.env'});

//-----------------------------------------------------------------------------
// Config the app, include middlewares
//-----------------------------------------------------------------------------
const {generateMessage, generateLocationMessage} = require('./utils/message');
const { type } = require('os');
let app = express();
let server = http.createServer(app);
const PORT = process.env.PORT;
let io = socketIO(server);

//App Middlewares
app.use(express.urlencoded({extended:false}));
//app.use(morgan('dev'));
app.set('view engine', 'ejs' );


/** Initializing Static Folder */
app.use(express.static(path.join(__dirname, 'public')));

// socket.on --> this is used for listening an event
// socket.emit --> this is used to create or emit an event
// socket is used for 1:1 messaging
// io is used for broadcasting.

io.on('connection', (socket)=> {
    socket.on("new-user-joined", (username) => {
        user = {
            "socketId": socket.id,
            "username": username
        }
        users.push(user);
        // users[socket.id] = username;
        // console.log(users);
        // socket.broadcast.emit('user-connected', username);
        // io.emit('user-list', users);
        // console.log(users.username);
        //console.log(users);
        socket.broadcast.emit('user-connected', user.username);
        io.emit('user-list', users);
    });

    // socket.on("disconnect", () => {
    //     socket.broadcast.emit('user-disconnected', uname = user.username);
    //     let user1 = user.username;
    //     //let obj = users.find(o => o.username === user1);
    //     // users = users.filter(person => person.username != user1);
    //     console.log(users.username); 
    //     io.emit('user-list', users);
    // });

    socket.on('message', (data) => {
        console.log(`Message Received: ${JSON.stringify(data)}`);
        socket.broadcast.emit("message", {user: data.user, msg: data.msg});
    });
});
 


app.use('/', require('./routes/routes'));

//Listening to the server
server.listen(PORT, () => { 
    console.log(`Server running on http://localhost:${PORT}`);
}); 


