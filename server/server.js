const express = require('express');
const http = require('http');
const app = express();
const clientPath = `${__dirname}/../client`;
const PORT = 8080;
app.use(express.static(clientPath));
const server = http.createServer(app);
const io = require('socket.io')(server);

server.listen(PORT,()=>{
    console.log("server running on "+PORT);
});

const onlineUsers = []


let counter = 0;
io.on('connection', (socket) =>{
    counter++;
    console.log("someone connected");
    console.log(counter + " connections.");
    socket.on('updateList',(data) =>{
        onlineUsers.push(data);
        io.emit("updateList",(onlineUsers))
    });
    socket.on('disconnect',() =>{
        counter--;
        let i = 0;
        for(const user of onlineUsers){
            console.log(user.socketID);
            if(user.socketID === socket.id){
                onlineUsers.splice(i,1);
            }
            i++;
        }
        console.log(onlineUsers);
        console.log(counter + " connections.");
        io.emit("updateList",(onlineUsers));
    });
    socket.on('sendAll',(data) =>{
        io.emit("displayMsg",(data));
    });
    socket.on('sendToMe',(data) =>{
        socket.emit("displayMsg",(data));
    });
});