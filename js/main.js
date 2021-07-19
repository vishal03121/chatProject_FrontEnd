const socket = io("https://wacloneapi.herokuapp.com/",{transports: ['websocket'], upgrade: false});
const { username, room, token } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});
if(!username || !room || !token) {
  location.replace("/index.html")
}

socket.emit('joinRoom', { username, room, token });

const capitalize = (word) => {
    return word[0].toUpperCase() + word.substring(1).toLowerCase();
  }

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });
  
  // Message from server
  socket.on('message', (message) => {
    outputMessage(message);
  
    // Scroll down
    // $('#messageList div:last-child').focus();
    window.scrollTo(0, $("#scrollMsg")[0].scrollHeight)
    $("#scrollMsg").scrollTop($("#scrollMsg")[0].scrollHeight);
  });
  
  // Message submit
document.getElementById("msg").addEventListener("focus", ()=> {
  window.scrollTo(0, $("#scrollMsg")[0].scrollHeight)
  $("#scrollMsg").scrollTop($("#scrollMsg")[0].scrollHeight);
});


document.getElementById("msg").addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("send").click();
  }
});
const getFileType = (filename) => {
  const ext = filename.split(".")[1];
  if(ext==="png" || ext==="jpg" || ext==="jpeg") return "image";
  else if(ext==="mp3") return "audio";
  else if(ext==="mp4") return "video";
}
function encodeImageFileAsURL() {
  var filesSelected = document.getElementById("inputFileToLoad").files;
  const filename = $('#inputFileToLoad').val();
  var size = parseFloat(filesSelected[0].size / 1024).toFixed(2);
  if (filesSelected.length > 0 && size<550) {
    var fileToLoad = filesSelected[0];

    var fileReader = new FileReader();

    fileReader.onload = function(fileLoadedEvent) {
      var srcData = fileLoadedEvent.target.result; // <--- data: base64
      const type = getFileType(filename);
      sendfiles(srcData, type);
    }
    fileReader.readAsDataURL(fileToLoad);
  }
  else{
    $("#error").toast('show');
    window.scrollTo(0,$("#scrollMsg")[0].scrollHeight)
    $("#scrollMsg").scrollTop($("#scrollMsg")[0].scrollHeight);
    document.getElementById("inputFileToLoad").value='';
    $("#dropdownMenuButton1").dropdown("hide");
  }
}
const sendfiles = (fileurl, type) => {
  if(!fileurl) return false;
  socket.emit('chatMessage', { type:type, content:fileurl, room, token });
  document.getElementById("inputFileToLoad").value='';
  $("#dropdownMenuButton1").dropdown("hide");
}
 const sendMsg = () => {
    // Get message text
    window.scrollTo(0,$("#scrollMsg")[0].scrollHeight)
    $("#scrollMsg").scrollTop($("#scrollMsg")[0].scrollHeight);
    let msg = document.getElementById("msg").value;
    msg = msg.trim();
    if (!msg) {
      return false;
    }

    // Emit message to server
    socket.emit('chatMessage', {type:"text", content:msg, room, token });
  
    // Clear input
    document.getElementById("msg").value = '';
    document.getElementById("msg").focus();
};
  
  // Output message to DOM
  function outputMessage(message) {
    let para, vh="";
    if(message.type==="text"){
      para = `<p class="text">${message.text}</p>`;
    }
    else if(message.type==="image"){
      para = `<img src="${message.text}" class="img-thumbnail" onclick="imageClick(this.src)">`;
    }
    else if(message.type==="audio"){
      para = `<audio controls>
            <source src="${message.text}" type="audio/mpeg">
          </audio>`;
      vh='style="max-width: 100vw;"';
    }
    else{
      para = `
      <video width="320" height="240" controls>
      <source src="${message.text}" type="video/mp4">
      </video>
      `;
      vh='style="max-width: 100vw;"';
    }
    const div = document.createElement('div');
    let mineClass ="", align = '', mineColor='';
    if(message.socketId === socket.id){
      message.username += " (You)";
      mineClass = " my-class-float-right";
      align = ' align="right"';
      mineColor = ' my-message';
    }
    let user = "fa-user";
    if(message.socketId=='bot'){
      div.className = "p-2 bd-highlight align-self-center"
      div.innerHTML = `
          <div class="card card-bot">
              <div class="card-body-bot">
                  <p class="text text-bot" ${align}><i class="fas fa-robot" style="color:white;"></i> ${message.text}<span> ~${message.time}</span></p>
              </div>
          </div>
      `;
    }
    else{
      div.className = "p-2 bd-highlight"
      div.innerHTML = `
          <div class="card${mineClass}" ${vh}>
              <div class="card-body${mineColor}" ${vh}>
                  <p class="meta" ${align}><i class="fas ${user}" style="color:black;"></i> ${message.username}<span> <i>~${message.time}</i></span></p>
                  ${para}
              </div>
          </div>
      `;
    }
    document.getElementById("messageList").append(div);
    window.scrollTo(0, $("#scrollMsg")[0].scrollHeight)
    $("#scrollMsg").scrollTop($("#scrollMsg")[0].scrollHeight);
  }
  
  // Add room name to DOM
  function outputRoomName(room) {
    $("#roomName").html(capitalize(room));
    document.title = capitalize(room);
  }
  
  // Add users to DOM
  function outputUsers(users) {
    let label = users.length + " Participant";
    if(users.length>1) label +='s';
    document.getElementById("offcanvasWithBackdropLabel").innerHTML = label;
    const userList = document.getElementById("userList");
    userList.innerHTML ='';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.className ="list-group-item offcanvas-bg";
      li.innerHTML = '<i class="fas fa-user"></i> ' + user.username;
      if(socket.id===user.id) li.innerHTML = '<i class="fas fa-user"></i> ' + user.username +" (You)";
      userList.appendChild(li);
    });
  }
  
  //Prompt the user before leave chat room
  document.getElementById('leave-btn').addEventListener('click', () => {
    socket.emit('left', room);
    window.location = '../index.html';
  });


const imageClick = (_src) => {
  $("#imgModal").modal("show");
  console.log(this.src);
  document.getElementById("img01").src = _src;
}

