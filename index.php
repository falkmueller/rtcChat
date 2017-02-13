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

