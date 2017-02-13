//camera wahl https://webrtc.github.io/samples/src/content/devices/input-output/

var client = client || {};

client.events = [
    ["submit", "#form_recript", "setRecript"],
    ["submit", "#form_offer", "createOffer"],
    ["submit", '#form_message', "sendmessage"],
    ["click", "#bt_end", "endConnection"]
];

client.settings = {
    audio: true,
    video: true,
    chat: true
};

client.init = function(){
    console.log("start");
    
    /* bind events */
    $(client.events).each(function(i, e){
        $("body").on(e[0], e[1],function(ev){ return client[e[2]](ev); });
    });

    if(client.number && client.number.length > 0){
        console.log("check number", client.number);
        
        client.checkNumberRespone();
    } else {
        client.ShowStartScreen();
    }    
};

client.endConnection = function(){
    rtc.close();
    client.CloseConnection();
};

client.CloseConnection = function(){
    client.showWait();
    client.displayMessage("connection were closed", "info");
    setTimeout(function(){window.location = client.startUrl;},2000); 
}

client.sendmessage = function(){
    console.log("send message");
    rtc.sendMessage($("#message").val());
   
    client.displayMessage($("#message").val(), "self");
   $("#message").val("")
    return false;
}

client.displayMessage = function(msg, cssClass){
    cssClass = cssClass || "other";
    
    var message = $("<div></div>");
    message.addClass(cssClass);
    message.html(msg);
    
   $("#chat_container").append(message);
}

/**
 * set number and check if offer exists
 * @returns {Boolean} false
 */
client.setRecript = function(){
    console.log("load offer");
   client.number = $("#number").val();
    client.checkNumberRespone();
    return false;
}

/**
 * create offer and send it to server
 * @returns {Boolean} false
 */
client.createOffer = function(){
    console.log("create offers");
    
    client.settings.audio = $("#enable_audio").is(":checked");
    client.settings.video = $("#enable_video").is(":checked");
    client.settings.chat = $("#enable_chat").is(":checked");
    
    if(!client.settings.audio && !client.settings.video && !client.settings.chat){
        client.alert("please select video, audio or text chat", "danger");
        return false;
    }
    
    rtc.offerOptions.offerToReceiveAudio = client.settings.audio ? 1 : 0;
    rtc.offerOptions.offerToReceiveVideo = client.settings.video ? 1 : 0;
    
    client.showWait();
    
    rtc.bindLocalStream("localVideo", function(){
        rtc.createOffer(function(localoffer){
            var data = {
                offer: localoffer,
                func: 'setOffer',
                audio: client.settings.audio,
                video: client.settings.video,
                chat: client.settings.chat
            }
             client.ServerCall(data, function(res){
                if(!res.number){
                    console.log("error");
                    return;
                }
                console.log(res);
                client.number = res.number;
                client.alert("send follow number to client: " + res.number, "success");
                //TODO: nummer anzeigen für weitergabe an remote user
                client.WaitOfAnswer();
            });
        });
    });
    
    return false;
}

client.WaitOfAnswer = function(){
    
    client.ServerCall({func: 'getRemoteAnswer', number: client.number}, function(res){
        console.log(res);
        
        if (res && res.success && res.answer){
            rtc.setRemoteAnswer(res.answer);
            console.log("FINISH");
            return;
        }
        else if (res && res.success){
            console.log("loop");
            client.WaitOfAnswer();
        }
        
    });
    
}

/**
 * Display start screen
 * @returns null
 */
client.ShowStartScreen = function(){
    console.log("ShowStartScreen");
    $("[data-page]").hide();
    $("[data-page='start']").show();
}

client.showWait = function(){
    $("[data-page]").hide();
    $("[data-page='wait']").show();
}

client.ShowChat = function(){
    $("#headline_number").html(client.number);   
    
    $("#chat").addClass("col-sm-6");
    $("#video").addClass("col-sm-6");
    
    if(!client.settings.video){
        $("#video").hide();
        $("#chat").removeClass("col-sm-6");
    }
    
    if(!client.settings.chat){
        $("#chat").hide();
        $("#video").removeClass("col-sm-6");
    }
    
    $("[data-page]").hide();
    $("[data-page='chat']").show();
}

/**
 * Display messages (not chat-messages, only for errors and informations)
 * @param {string} message
 * @param {string} type
 * @returns null
 */
client.alert = function(message, type){
    var msg = $("<div class='alert' role='alert'></div>");
    msg.addClass("alert-" + (type ? type : "info"));
    
    msg.append("<span>" + message + "</span>");
    
    msg.append('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>')
    
    if($("[data-page='wait']").is(":visible")){
        $("#inner_alert").append(msg);
    } else {
        $("#out_alert").append(msg);
        setTimeout(function(){ msg.remove(); }, 3000);
    }
    
    
};

/**
 * check if offer exists to number
 * @param {object} res
 * @returns null
 */
client.checkNumberRespone = function(){
    client.ServerCall({func: 'getByNumber', number: client.number}, function(res){
        if (!res.offer){
            client.ShowStartScreen();
            client.alert("Number not longer aviable");
            return;
        }
        
        client.showWait();
        client.settings.audio = res.audio;
        client.settings.video = res.video;
        client.settings.chat = res.chat;
        
        rtc.offerOptions.offerToReceiveAudio = res.audio ? 1 : 0;
        rtc.offerOptions.offerToReceiveVideo = res.video ? 1 : 0;
         
         rtc.bindLocalStream("localVideo", function(){
             rtc.getRemoteAnswer(res.offer, function(remoteAnswer){
                console.log("send remote answer to server", remoteAnswer);
                client.ServerCall({func: 'setRemoteAnswer', number: client.number, answer: remoteAnswer}, function(res){
                    console.log(res);
                });
            });
         });
    });
}

client.ServerCall = function(data, callback){
    $.ajax({
        data: data || {},
        url: client.serverUrl,
        method: 'POST',
        error: function(){
            callback(null);
        },
        success: function(res){
            callback(res);
        }
    });
}

$(document).ready(client.init);
