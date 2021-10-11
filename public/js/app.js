let socket = io(); // trying to make a connection with backend (sending requet to backend)

// Create an alert box for user to enter the username
let username;
let user_arr = [];

let chats = document.querySelector(".chats");
let users_list = document.querySelector(".users-list");
let users_count = document.querySelector(".users-count");
let user_send = document.querySelector("#user-send");
let user_msg = document.querySelector("#user-msg");



do{
    username = prompt("Enter your name: ");
} while(!username);


// It will be called when user will join
socket.emit("new-user-joined", username);


// Notifying that user has joined
socket.on('user-connected', (socket_name) => {
    console.log(`On client side: ${socket_name}`);
    userJoinLeft(socket_name, 'joined');
});

// Function to create joined/left status div
function userJoinLeft(name, status) {
    let div = document.createElement("div");
    div.classList.add('user-join');
    let content = `<p><b>${name}</b> ${status} the chat.</p>`;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}

// Notifying that user has left
socket.on('user-disconnected', (user) => {
    userJoinLeft(user, 'left');
});

// For updating users list and count
socket.on('user-list', (users) => {
    users_list.innerHTML = "";
    users_arr = Object.values(users);
    //console.log(typeof(users_arr));
    for(i = 0; i < users_arr.length; i++) {
        let p = document.createElement('p');
        p.innerText = users_arr[i].username;
        users_list.appendChild(p);
        //console.log(users_arr[i].username);
    }
    users_count.innerHTML = users_arr.length;
});

// For sending messages
user_send.addEventListener('click', () => {
    let data = {
        user: username,
        msg: user_msg.value,
    };
    console.log(`user: ${data.user}, msg: ${data.msg}`);
    if(user_msg.value != ''){
        appendMessage(data, 'outgoing');
        console.log(`Data: ${JSON.stringify(data)}`);
        socket.emit('message', data);
        user_msg.value = '';
    }
});

function appendMessage(data, status) {
    let div = document.createElement('div');
    div.classList.add('message', status);
    let content = `
    <h5>${data.user}</h5>
    <p>${data.msg}</p>`;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
    console.log(`Content: ${content}`);
}

socket.on('message', (data) => {
    appendMessage(data, 'incoming');
});