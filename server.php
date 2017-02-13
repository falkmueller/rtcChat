<?php

class server {
    
    public static function call($functionname){
        $server = new self();
        
        if(!method_exists ( $server , $functionname) ){
            return null;
        }
        
        return call_user_method($functionname, $server);
    }
    
    public function getByNumber(){
        $number = intval($_POST["number"]);
    
        if(!file_exists (__dir__.'/cache/'.$number.'.json')){
            return array();
        }
        
        return json_decode(file_get_contents(__dir__.'/cache/'.$number.'.json'), true);
        
    }
    
    public function setOffer(){
        $number = 0;
        
        $this->deleteOldOffer();
        
        while (!$number || file_exists (__dir__.'/cache/'.$number.'.json')){
            $number = rand(1,100000);
        }
        
        $offer = array(
            "number" => $number,
            "offer" => $_POST["offer"],
            "audio" => !empty($_POST["audio"]) ? true : false,
            "video" => !empty($_POST["video"]) ? true : false,
            "chat" => !empty($_POST["chat"]) ? true : false,
            "create" => time(),
            "answer" => ""
        );
        
        if(!@file_put_contents(__dir__.'/cache/'.$number.'.json', json_encode($offer))){
            return array("success" => false, "message" => "can not set file");
        }
        
        return  array("success" => true, "number" => $number);
    }
    
    private function deleteOldOffer(){
        $files_array = scandir(__dir__.'/cache');
        $last_time = time() - (60* 60 * 2);
        
        foreach($files_array as $file)
        {
            if(($file == ".") || ($file == "..") || ($file == ".gitignore") || ($file == ".htaccess")){
                continue;
            }
            
            $filetime = filemtime(__dir__.'/cache/'.$file);
            
            if($filetime < $last_time){
                @unlink(__dir__.'/cache/'.$file);
            }
            
        }
    }


    public function setRemoteAnswer(){
        $number = intval($_POST["number"]);
        $answer = $_POST["answer"];
        
        if(!file_exists (__dir__.'/cache/'.$number.'.json')){
            return array();
        }
        
        $offer = json_decode(file_get_contents(__dir__.'/cache/'.$number.'.json'), true);
        $offer["answer"] = $answer;
        
        if(!@file_put_contents(__dir__.'/cache/'.$number.'.json', json_encode($offer))){
            return array("success" => false, "message" => "can not set file");
        }
        
        return  array("success" => true, "number" => $number);
    }
    
    public function getRemoteAnswer(){
        $number = intval($_POST["number"]);
        
        $counter = 5;
        $sleep_time = 2; //sec
        
        while ($counter >= 0){
            $counter--;
            
            if(!file_exists (__dir__.'/cache/'.$number.'.json')){
                return array("success" => false, "message" => "number not exists");
            }

            $offer = json_decode(file_get_contents(__dir__.'/cache/'.$number.'.json'), true);
            if(!empty($offer["answer"])){
                @unlink(__dir__.'/cache/'.$number.'.json');
                return array("success" => true, "answer" => $offer["answer"]);
            }
            
            sleep($sleep_time);
        }
        
        return array("success" => true, "message" => "wait of answer"); 
        
    }
}

header('Content-Type: application/json');
$res = server::call($_POST["func"]);
echo json_encode($res ? $res : array());

