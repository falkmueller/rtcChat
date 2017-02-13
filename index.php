<?php

require_once './lib.php';

$number = "";

if(!empty($_GET["number"])){
    $number = $_GET["number"];
}
    ?><!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>RTC Chat</title>

    <!-- Bootstrap -->
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link rel="stylesheet" href="<?php echo getUrl('css/styles.css'); ?>" />
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
      
      <a href="https://github.com/falkmueller/rtcChat" target="_blank" class="github-corner" aria-label="View source on Github"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#70B7FD; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a>
    
      <div data-page="start" style="display: none;">
          
        <div class="col-md-4 col-sm-8 col-md-offset-4 col-sm-offset-2">          
            <h2>Invitation received?</h2>
            <form id="form_recript" method="POST">
                <div class="form-group">
                  <label for="number">enter number</label>
                  <input type="number" class="form-control" id="number" placeholder="number" name="number">
                </div>
                <button class="btn btn-primary btn-block" type="submit">starten</button>
            </form>

            <h2>Start new session</h2>
            <form method="POST" id="form_offer">
                <input type="hidden" name="start" value="1">
                <div class="checkbox">
                  <label>
                      <input type="checkbox" name="video" id="enable_video" checked="checked" value="1"> video
                   </label>
                </div>
                <div class="checkbox">
                  <label>
                      <input type="checkbox" name="audio" id="enable_audio" checked="checked" value="1"> audio
                  </label>
                </div>
                <div class="checkbox">
                  <label>
                      <input type="checkbox" name="chat" id="enable_chat"  checked="checked" value="1"> text-chat
                  </label>
                </div>
                <button class="btn btn-primary btn-block" type="submit">start</button>
            </form>
        </div>
      </div>
      
      <div data-page="wait" class="wait">
          <div class="col-md-4 col-sm-8 col-md-offset-4 col-sm-offset-2" id="inner_alert">  
              
          </div>
      </div>
      
      <div data-page="chat" style="display: none;">
          <div class="col-md-8 col-sm-8 col-md-offset-2 col-sm-offset-2">
              <h1>Chat: <span id="headline_number"></span></h1>
              
              <div class="row">
                  <div class="col-sm-6 col-xs-12" id="video">
                        <Video id="localVideo" muted="true"></video>
                        <Video id="remoteVideo" /></video>
                  </div>
                  <div class="col-sm-6 col-xs-12" id="chat">
                        <div id="chat_container">

                        </div>
                        <form id="form_message">
                            <div class="form-group">
                                <label for="message">message:</label>
                                <input type="text" autocomplete="off" class="form-control" id="message">
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">send</button>
                        </form>
                  </div>
              </div>

                <a class="btn btn-default btn-block" id="bt_end">end</a>
          </div>
      </div>
      
      <div id="out_alert"></div>
      
    
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
    <script type="text/javascript"> 
        var client = client || {}; 
        client.number =  '<?php echo $number ?>';
        client.startUrl = '<?php echo getUrl(''); ?>';
        client.serverUrl = '<?php echo getUrl('server.php'); ?>';
    </script>
    <script type="text/javascript" src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
    <script type="text/javascript" src="<?php echo getUrl('js/rtc.js'); ?>"></script>
    <script type="text/javascript" src="<?php echo getUrl('js/main.js'); ?>"></script>
  </body>
</html>

