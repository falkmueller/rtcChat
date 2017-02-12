//camera wahl https://webrtc.github.io/samples/src/content/devices/input-output/

var client = client || {};

client.events = [
    ["submit", "#form_recript", "setRecript"],
    ["submit", "#form_offer", "createOffer"],
    ["submit", '#form_message', "sendmessage"],
    ["click", "#bt_end", "endConnection"]
];

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
    console.log("end");
    rtc.close();
    client.ShowStartScreen();
};

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
    
    var config = {
        audio: $("#enable_audio").is(":checked"),
        video: $("#enable_video").is(":checked"),
        chat: $("#enable_chat").is(":checked")
    };
    
    rtc.offerOptions.offerToReceiveAudio = config.audio ? 1 : 0;
    rtc.offerOptions.offerToReceiveVideo = config.video ? 1 : 0;
    
    if(!config.video){
        $("#video").hide();
    }
    
    if(!config.chat){
        $("#chat").hide();
    }
    
    client.showWait();
    
    rtc.bindLocalStream("localVideo", function(){
        rtc.createOffer(function(localoffer){
            config.offer = localoffer;
            config.func = 'setOffer';
            client.ServerCall(config, function(res){
                if(!res.number){
                    console.log("error");
                    return;
                }
                console.log(res);
                client.number = res.number;
                client.alert("Nummer für Client: " + res.number, "success");
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
    alert(message);
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
        rtc.offerOptions.offerToReceiveAudio = res.audio ? 1 : 0;
        rtc.offerOptions.offerToReceiveVideo = res.video ? 1 : 0;

        if(!res.video){
            $("#video").hide();
        }
        
        if(!res.chat){
            $("#chat").hide();
        }
        
         
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
