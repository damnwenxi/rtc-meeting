/**
 * @author kefneg
 * @file create a webrtc object demo
 */

 let mediaConfig = {
     audio: true,
     video: true
 }

 let localStream = ''
 function invite () {
     navigator.mediaDevices.getUserMedia(mediaConfig).then(localStream => {
        let localVideo = document.getElementById('local-video')
        window.localStream = localStream
        localVideo.srcObject = localStream
     })
 }

 invite()