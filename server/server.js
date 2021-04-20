const express = require('express');
const app = express();
const http = require('http');
const clientPath = `${__dirname}/../client`;
const PORT = 8080;
app.use(express.static(clientPath));
const server = http.createServer(app);
const io = require('socket.io')(server);
const onlineUsers = {}
let counter = 0;

server.listen(PORT,()=>{
    console.log("server running on "+PORT);
});
io.on('connection', (socket) =>{
    io.emit("updateList",(onlineUsers));
    counter++;
    console.log("someone connected");
    console.log(counter + " connections.");
    socket.on('newUser',name =>{
        onlineUsers[socket.id] = name;
        socket.broadcast.emit('userConnected', name);
        io.emit("updateList",(onlineUsers));
    });
    socket.on('disconnect',() =>{
        counter--;
        //let i = 0;
        //for(const user of onlineUsers){
        //    console.log(user.socketID);
        //    if(user.socketID === socket.id){
        //        onlineUsers.splice(i,1);
        //    }
        //    i++;
        //}
        io.emit('userLeft',onlineUsers[socket.id]);
        delete onlineUsers[socket.id];
        console.log(onlineUsers);
        console.log(counter + " connections.");
        io.emit("updateList",(onlineUsers));
    });
    socket.on('sendAll',(message) =>{
        io.emit("displayMsg",({message: message, user: onlineUsers[socket.id]}));
    });
    socket.on('sendToMe',(message) =>{
        socket.emit("displayMsg",({message: message, user: onlineUsers[socket.id]}));
    });
});