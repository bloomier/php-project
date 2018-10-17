<?php
namespace Common\Behaviors;





use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;

class CacheEndBehavior{
    function run($arg){
        if(!S("cache_rule")){
            change_db_main();
            $md=new StringModel(Constants::$DB_RULE_CACHE);
            $rows=$md->select();
            S("cache_rule",$rows,3600);

        }
        $conf=S("cache_rule");
        if(!$conf){
            return;
        }
        $action=MODULE_NAME.'/'.CONTROLLER_NAME.'/'.ACTION_NAME;
        if(!$conf[$action]){
            return;
        }
        change_db(current_region_id());
        $cacheKey="region_".current_region_id()."_".$action.json_encode(I());
        if(!S($cacheKey)){
            S($cacheKey,$arg,600);
        }

    }



}
?>