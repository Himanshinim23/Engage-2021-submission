const socket =io('/');
const videoGrid = document.getElementById('video-grid');


const user = prompt("Enter your name");
let myVideoStream;
const myVideo = document.createElement('video');
myVideo.muted = true;
var peer = new Peer (undefined); 

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  
  
  myVideoStream = stream;
  addVideoStream(myVideo, stream);
    peer.on('call', call => {
      
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })
  socket.on('user-connected',(userId) => {
    connectToNewUser(userId,stream);
    

 })


let text = $('input');
// when press enter send message
$('html').keydown((e) => {
  if (e.which == 13 && text.val().length !== 0) {
    console.log(text.val())
    socket.emit('message', text.val());
    text.val('')
  }
});
socket.on('createMessage', (message,userName) => {
  console.log('server',message)
    if(userName!=user)
    {
    $('ul').append(`<li class="message"><i class="far fa-user-circle"></i><b>`+` ${userName}`+`</b><br/>${message}</li>`);
    }
    else{
      
    $('ul').append(`<li class="message"><i class="far fa-user-circle"></i><b>`+` You`+`</b><br/>${message}</li>`);
    
    }
    scrollToBottom() 
    // to automatically scroll chat to latest msg
  })
  
})

  peer.on('open', id => {
    
    socket.emit('join-room', ROOM_ID, id,user)
  })

const connectToNewUser = (userId, stream)=> {
    console.log('newuser')
  
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    call.on('close', () => { 
      video.remove()
    })
    peers[userId] = call
    
  }


const addVideoStream = (video, stream) => { 
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  })
  videoGrid.append(video);
}


const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}

// handling mute/unmute and play/stop buttons


const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

// for leave meeting

function close_window() {
  if (confirm("Are you sure to leave this meeting ?")) {
    window.close();
    
  }
}




// for screen sharing


const shareScreen = async () => {




  const socket = io('/')
  const videoGrid = document.getElementById('video-grid')
  const myPeer = new Peer(undefined)
const myVideo2 = document.createElement('video')
myVideo2.muted = true;
const peers = {}
navigator.mediaDevices.getDisplayMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo2, stream)
  myPeer.on('call', call => {
    call.answer(stream)
    const video2 = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video2, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })


})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {

  const call = myPeer.call(userId, stream)
  const video2 = document.createElement('video')
  call.on('stream', userVideoStream => {

  })
  call.on('close', () => {
    video2.remove()
  })

  peers[userId] = call
}

function addVideoStream(video2, stream) {
  video2.srcObject = stream
  video2.addEventListener('loadedmetadata', () => {
    video2.play()
  })
  videoGrid.append(video2)
}
};


// copy meet link button

function invite(){
  var dummy = document.createElement('input'),
    text = window.location.href;

document.body.appendChild(dummy);
dummy.value = text;
dummy.select();
document.execCommand('copy');
document.body.removeChild(dummy);
alert("URL copied");
}

async function startCapture(displayMediaOptions) {
  let captureStream = null;

  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
  } catch(err) {
    console.error("Error: " + err);
  }
  return captureStream;
}


  
