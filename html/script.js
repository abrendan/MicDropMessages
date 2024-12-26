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
    chatRoom.innerHTML = "Current Chatroom: " + room;
    // Show the chat div when successfully joined a room.
    document.getElementById("Chat").style.display = "block";
  });

  socket.on("recieve", function(message){
    console.log(message);
    if (messages.length < 9){
      messages.push(message);
      dingSound.currentTime = 0;
      dingSound.play();
    } else {
      messages.shift();
      messages.push(message);
    }
    for (var i = 0; i < messages.length; i++){
      document.getElementById("Message"+i).innerHTML = messages[i];
      document.getElementById("Message"+i).style.color = getComputedStyle(document.body).color;
    }
  });

  // Ensure that the error popup is not displayed when the page is loaded
  document.getElementById('errorPopup').style.display = 'none';
}

function Connect(){
  var username = usernameInput.value.trim();
  var room = chatIDInput.value.trim();
  if(username && room){
    socket.emit("join", room, username);
    chatRoom.innerHTML = "Chatroom: " + room;
    document.getElementById('AccessPort').style.display = 'none';
  } else {
    showErrorPopup("Please enter a username and a chatroom.");
  }
}

function showErrorPopup(message) {
  document.getElementById('errorText').textContent = message;
  document.getElementById('errorPopup').style.display = 'flex';
}

function closeErrorPopup() {
  document.getElementById('errorPopup').style.display = 'none';
}

function LeaveRoom(){
  if (chatRoom.innerHTML.includes("Chatroom")) {
    var roomName = chatRoom.innerHTML.split(": ")[1];
    var username = usernameInput.value;
    socket.emit('leave', roomName, username);
  }
  // Show access port to join another chat room.
  document.getElementById('AccessPort').style.display = 'block';

  // Hide the chat div as the user is leaving the room.
  document.getElementById('Chat').style.display = 'none';

  // Reset chatRoom text to indicate no room connection.
  chatRoom.innerHTML = "Chatroom: None";

  // If the user is in a room, emit a leave event.
  if (rooms[socket.id]) {
    socket.emit('leave', rooms[socket.id], usernames[socket.id]);
    rooms[socket.id] = null;
    usernames[socket.id] = null;
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

document.addEventListener('keydown', function(event) {
  // Check if Alt + Ctrl + R are pressed together
  if (event.altKey && event.ctrlKey && event.key === 'r') {
    // Prevent the default action to avoid conflicts
    event.preventDefault(); 
    // Open the desired webpage in a new window/tab
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  }
});