
/*********************************************
**        Audio recording and upload        **
*********************************************/

// recording of audio uses library written by matt diamond
// available at: https://github.com/mattdiamond/Recorderjs
// below function adapted from this library

function setUpAudio() {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
      window.URL = window.URL || window.webkitURL;
      audio_context = new AudioContext;
    } catch (e) {
      alert('No web audio support in this browser!');
    }
    
    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
      console.log('No live audio input: ' + e);
    });

}

function recordStart() {

  if(recording === false){
    recording = true;
    if(!sound.paused) sound.pause();
    startRecording();
  } else {
    recording = false;
    stopRecording();
  }

}

function recordStart1() {
  if(recording === false) {
    recording = true;
    startRecording();
  } else {
    recording = false;
    stopRecording();
  }
}

function startUserMedia(stream) {
  var input = audio_context.createMediaStreamSource(stream);   
  recorder = new Recorder(input);
}

function startRecording() {
  recorder && recorder.record();
}

function stopRecording() {
  recorder && recorder.stop();
  processBlob();
  recorder.clear();
}

function processBlob() { 
  recorder && recorder.exportWAV(function(blob) {
    send(blob);
  });
}


