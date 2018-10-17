<?php
namespace Common\Behaviors;





use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;
use Think\Hook;

class CacheStartBehavior{
    function run($arg){
        $action=MODULE_NAME.'/'.CONTROLLER_NAME.'/'.ACTION_NAME;
        $cacheKey="region_".current_region_id()."_".$action.json_encode(I());
        if(S($cacheKey)){
            if(IS_AJAX){
                header('Content-Type:application/json; charset=utf-8');
                Hook::listen("ajax_return",$arg);
                exit(json_encode(S($cacheKey),true));
            }else{

            }
        }


    }



}
?>