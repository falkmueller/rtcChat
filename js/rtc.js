var rtc = rtc || {};

$(document).ready(function(){
    console.log("rtc version 6");
});


rtc.cfg = {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]},
rtc.con = { 'optional': [{'DtlsSrtpKeyAgreement': true}] };
rtc.localstream = null;
rtc.offerOptions = {
  offerToReceiveAudio: 0,
  offerToReceiveVideo: 0
};

rtc.pc_local = new RTCPeerConnection(rtc.cfg, rtc.con);
rtc.pc_remote = new RTCPeerConnection(rtc.cfg, rtc.con);
rtc.dc = null;

rtc.close = function(){
    rtc.pc_local.close();
    rtc.pc_remote.close();
}

function oniceconnectionstatechange (state) {
  console.info('signaling state change:', state);
  var statetype = state.currentTarget.iceConnectionState;
          if (statetype === "failed" ||
            statetype === "disconnected" ||
            statetype === "closed") {
                client.CloseConnection();
                client.alert("connection were closed", "danger");
                console.log("verbindung weg");
          }
}

rtc.pc_local.oniceconnectionstatechange = oniceconnectionstatechange;
rtc.pc_remote.oniceconnectionstatechange = oniceconnectionstatechange;

rtc.pc_remote.ondatachannel = function (e) {
    console.log("create datachanel 1");
    var datachannel = e.channel || e;
    rtc.dc = e.channel || e;
    rtc.dc.onmessage = function (e) {
        client.displayMessage(JSON.parse(e.data).message);
        console.log("remote message:", e.data);
    }
    
    rtc.dc.onopen = function (e) {
         console.log("verbindung ist da");
         client.ShowChat();
     }
}

attachMediaStream = function (element, stream) {
    console.log("ATTACH STREAM")
    element.srcObject = stream;
    element.autoplay = true;
  }
  
rtc.sendMessage = function(msg){
    
     rtc.dc.send(JSON.stringify({message: msg}));
}

/**
 * Add local stream to video element
 * @param {type} videoElementId
 * @param {type} callback
 * @returns
 */
rtc.bindLocalStream = function(videoElementId,callback){
    
    if(rtc.offerOptions.offerToReceiveAudio == 0 && rtc.offerOptions.offerToReceiveVideo == 0){
        if(callback){callback();}
        return;
    }
    
    navigator.mediaDevices.getUserMedia({
        audio: rtc.offerOptions.offerToReceiveAudio,
        video: rtc.offerOptions.offerToReceiveVideo
    })
      .then(function(stream){
          console.log("add media");
            var vid1 = document.getElementById(videoElementId);
            attachMediaStream(vid1, stream);
            rtc.localstream  = stream;
            if(callback){callback();}
      })
      .catch(function(e) {
        console.log('getUserMedia() error: ' + e);
    });
}

/**
 * create offer
 * @param {type} callback
 * @returns {undefined}
 */
rtc.createOffer = function(callback){
    
     rtc.pc_local.onicecandidate = function (e) {
        console.log('ICE candidate (pc1)', e)
        if (e.candidate == null) {
          console.log("LOCAL OFFER: ",JSON.stringify(rtc.pc_local.localDescription));
          callback(JSON.stringify(rtc.pc_local.localDescription));
        }
      }
      
      if(rtc.localstream){
        rtc.pc_local.addStream(rtc.localstream);
        }
        
     rtc.dc = rtc.pc_local.createDataChannel('test', {reliable: true});

        rtc.dc.onmessage = function (e) {
                client.displayMessage(JSON.parse(e.data).message);
                console.log("local mssage", e.data);
        }
      
      rtc.pc_local.onaddstream = function (e) {
            console.log('Got remote stream', e.stream)
            var el = document.getElementById('remoteVideo')
            attachMediaStream(el, e.stream);
            
      };
      
      rtc.dc.onopen = function (e) {
          console.log("verbindeung ist da");
          client.ShowChat();
      }
    
    rtc.pc_local.createOffer(
        rtc.offerOptions
      ).then(
        function(desc){
             rtc.pc_local.setLocalDescription(desc).then(
                function(){
                },
                function(error){
                    console.log("ERROR: ", error);
                }
            );
        },
        function(error){
            console.log("ERROR: ", error);
        }
      );
}

rtc.getRemoteAnswer = function(remoteOffer, callback){

    rtc.pc_remote.onaddstream = function (e) {
            console.log('Got remote stream', e.stream)
            var el = document.getElementById('remoteVideo')
            attachMediaStream(el, e.stream);
      };
    
   rtc.pc_remote.onicecandidate = function (e) {
        console.log('ICE candidate (pc2)', e)
        if (e.candidate == null) {
          console.log("LOCAL ANSWER", JSON.stringify(rtc.pc_remote.localDescription))
          callback(JSON.stringify(rtc.pc_remote.localDescription));
        }
    }
    
    if(rtc.localstream){
        rtc.pc_remote.addStream(rtc.localstream);
    }
    
    var offerDesc = new RTCSessionDescription(JSON.parse(remoteOffer))
    rtc.pc_remote.setRemoteDescription(offerDesc);
    
    rtc.pc_remote.createAnswer().then(
        function(desc){
            rtc.pc_remote.setLocalDescription(desc).then(
                function(){
                    
                },
                function(error){
                    console.log("ERROR: ", error);
                }
            );
        },
        function(error){
            console.log("ERROR: ", error);
        }
      );
}

rtc.setRemoteAnswer = function (answer) {
  var answerDesc = new RTCSessionDescription(JSON.parse(answer));
  console.log('Received remote answer: ', answerDesc)
   rtc.pc_local.setRemoteDescription(answerDesc)
  //wait vpr connection
}