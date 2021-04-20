const socket = io.connect();
const target = document.getElementById('target');
const onlineList = document.getElementById('onlineList');
const input = document.getElementById('chat-input');
let usr = '';
tinymce.init({
    selector: "#chat-input",
    skin: 'bootstrap',
    plugins: "autoresize link lists emoticons",
    toolbar:
        "bold italic underline strikethrough | forecolor | numlist bullist | link blockquote emoticons",
    menubar: false,
    statusbar: false,
    width: "100%",
    toolbar_location: "bottom",
    autoresize_bottom_margin: 0,
    contextmenu: false,
    setup: (ed) => {
        editor = ed;
    },
});




document.getElementById('usrname-btn').addEventListener('click',function(){
    usr = document.getElementById('usrname').value;
    socket.emit('newUser',(usr));
    let elems = document.querySelectorAll('.usrname');
    for (const elem of elems){
        elem.remove(elem);
    }
});

document.getElementById('sendAll').addEventListener('click',function(){
    let msg = tinymce.get('chat-input').getContent();
    console.log(msg);
    socket.emit('sendAll',(msg));
    document.getElementById('chat-input').value = '';
});

document.getElementById('sendToMe').addEventListener('click',function(){
    let msg = tinymce.get('chat-input').getContent();
    socket.emit('sendToMe',(msg));
    document.getElementById('chat-input').value = '';
});

socket.on('displayMsg',(data) =>{
    target.innerHTML += `<hr><br><h5>From: ${data.user}</h5><br>${data.message}`;
});
socket.on('userConnected', name => {
    target.innerHTML += `<hr><br><h5>User: ${name} Connected!</h5><br><p class="message">Say hi!</p>`;
});
socket.on('userLeft', name => {
    target.innerHTML += `<hr><br><h5>User: ${name} Disconnected!</h5><br><p class="message">Bye!</p>`;
});
socket.on('updateList',(users)=>{
    onlineList.innerHTML ='';
    Object.entries(users).forEach(([key, value]) => {
        onlineList.innerHTML += `<ul><span class="dot"></span>${value}</ul>`;
    });
});