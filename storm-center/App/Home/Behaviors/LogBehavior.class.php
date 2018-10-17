<?php
namespace Home\Behaviors;



use Home\Globals\Log;

class LogBehavior{
    function run($arg){
        $rules=get_rules();

        // dump($rules);
        $action=MODULE_NAME.'/'.CONTROLLER_NAME.'/'.ACTION_NAME;
        $actionObj=$rules[$action];

        if(!$actionObj){
            return;
        }


        $user=session("user");
        $resMsg="";
        $resultCode=-1;//无返回值
        if($arg){
            $resultCode=$arg['code'];
            $resMsg=$arg['msg'];
        }
        $log=array(
            "action"=>$action,
            "actionName"=>$actionObj['title'],
            "optUser"=>($user?array(id=>$user['id'],name=>$user['name']):null),
            "client_ip"=>get_client_ip(),
            "params"=>I(),
            "results"=>array(code=>$resultCode,msg=>$resMsg)

        );


        Log::write($log);


    }



}
?>