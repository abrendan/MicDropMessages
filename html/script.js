var socket;
var usernameInput;
var chatIDInput;
var messageInput;
var chatRoom;
var dingSound;
var messages = [];
var delay = true;

function onload(){
  socket = io();
  usernameInput = document.getElementById("NameInput");
  chatIDInput = document.getElementById("IDInput");
  messageInput = document.getElementById("ComposedMessage");
  chatRoom = document.getElementById("RoomID");
  dingSound = document.getElementById("Ding");

  // Event listener to send message when Enter key is pressed
  messageInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") { // Check if Enter was pressed
      Send(); // Trigger send message
    }
  });

  socket.on("join", function(room){
    chatRoom.innerHTML = "Current Chatroom : " + room;
    // Show the chat div when successfully joined a room.
    document.getElementById("Chat").style.display = "block";
  })

  socket.on("recieve", function(message){
    console.log(message);
    if (messages.length < 9){
      messages.push(message);
      dingSound.currentTime = 0;
      dingSound.play();
    }
    else{
      messages.shift();
      messages.push(message);
    }
    for (var i = 0; i < messages.length; i++){
      document.getElementById("Message"+i).innerHTML = messages[i];
      document.getElementById("Message"+i).style.color = getComputedStyle(document.body).color;
    }
  })
}

function Connect(){
  // Get the username and room from the input fields
  var username = usernameInput.value.trim();
  var room = chatIDInput.value.trim();

  // Check if the username and room are not empty
  if(username && room){
    socket.emit("join", room, username);
    chatRoom.innerHTML = "Chatroom : " + room;
    // Hide the chat div initially when attempting to connect
    document.getElementById("Chat").style.display = "none";
  } else {
    // Maybe show an error message to the user that they need to fill in both fields
  }
}

function Send(){
  if (delay && messageInput.value.replace(/\s/g, "") != ""){
    delay = false;
    setTimeout(delayReset, 1000);
    socket.emit("send", messageInput.value);
    messageInput.value = "";
  }
}

function delayReset(){
  delay = true;
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

document.addEventListener('keydown', function(event) {
  // Check if Alt + Ctrl + R are pressed together
  if (event.altKey && event.ctrlKey && event.key === 'r') {
    // Prevent the default action to avoid conflicts
    event.preventDefault(); 
    // Open the desired webpage in a new window/tab
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  }
});