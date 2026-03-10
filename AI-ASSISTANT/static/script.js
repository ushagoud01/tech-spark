async function sendMessage(){

let msg = document.getElementById("message").value;

if(msg.trim()=="") return;

let chat = document.getElementById("chatbox");

chat.innerHTML += `<div class="user">You: ${msg}</div>`;

document.getElementById("message").value="";

let res = await fetch("/chat",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({message:msg})
});

let data = await res.json();

chat.innerHTML += `<div class="ai">AI: ${data.response}</div>`;

chat.scrollTop = chat.scrollHeight;

loadHistory();

}



function startVoice(){

const recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition)();

recognition.lang="en-US";

recognition.onresult=function(event){

let text = event.results[0][0].transcript;

document.getElementById("message").value=text;

}

recognition.start();

}



document.getElementById("message").addEventListener("keypress",function(event){

if(event.key==="Enter"){

event.preventDefault();

sendMessage();

}

});



async function loadHistory(){

let res = await fetch("/history");

let data = await res.json();

let history = document.getElementById("history");

history.innerHTML="";

data.forEach(chat=>{

let div=document.createElement("div");

div.innerHTML=chat[0];

div.onclick=function(){

let confirmDelete = confirm("Do you want to delete this chat?");

if(confirmDelete){

fetch("/delete/"+chat[0],{
method:"DELETE"
});

loadHistory();

}else{

let chatbox=document.getElementById("chatbox");

chatbox.innerHTML="";

chatbox.innerHTML += `<div class="user">You: ${chat[0]}</div>`;
chatbox.innerHTML += `<div class="ai">AI: ${chat[1]}</div>`;

}

}

history.appendChild(div);

});

}



window.onload = loadHistory;
function newChat(){

let chatbox = document.getElementById("chatbox");

chatbox.innerHTML = "";

}