let socket = io.connect();
let target = document.getElementById('target');
let onlineList = document.getElementById('onlineList');
let usr = '';

document.getElementById('usrname-btn').addEventListener('click',function(){
    usr = document.getElementById('usrname').value;
    socket.emit('updateList',({socketID:socket.id, usr:usr}));
    let elems = document.querySelectorAll('.usrname');
    for (const elem of elems){
        elem.remove(elem);
    }
});
document.getElementById('sendAll').addEventListener('click',function(){
    let msg = document.getElementById('chat-input').value;
    socket.emit('sendAll',({msg: msg, usr: usr}));
    document.getElementById('chat-input').value = '';
});
document.getElementById('sendToMe').addEventListener('click',function(){
    let msg = document.getElementById('chat-input').value;
    socket.emit('sendToMe',({msg: msg, usr: usr}));
    document.getElementById('chat-input').value = '';
});

socket.on('displayMsg',(data) =>{
    target.innerHTML += `<hr><br><h5>From: ${data.usr}</h5><br><p class="message">${data.msg}</p>`;
});
socket.on('updateList',(users)=>{
    onlineList.innerHTML ='';
    for (const user of users)
    {
        onlineList.innerHTML += `<ul><span class="dot"></span>${user.usr}</ul>`;
    }
});