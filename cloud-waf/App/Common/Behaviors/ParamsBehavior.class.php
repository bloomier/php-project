<?php
namespace Common\Behaviors;





use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;

class ParamsBehavior{
    function run($arg){

        if(!session("?opt_log_rule")){
            $md=new StringModel(Constants::$DB_RULE_LOG_OPT);
            $rows=$md->select();
            session("opt_log_rule",$rows);

        }
        $conf=session("opt_log_rule");

        $action=MODULE_NAME.'/'.CONTROLLER_NAME.'/'.ACTION_NAME;
        if(current_user_id()==0){
            return;
        }
        if(!$conf){
            return;
        }
        $row=$conf[$action];
        if(!$row){
            return;
        }
        $md=new AutoIncrementModel(Constants::$DB_LOG_OPT);
        if($arg){//如果是ajax请求
            if(is_array($row)){
                $log=array(name=>$row['name'], type=>2, uid=>current_user_id(), time=>date("Y-m-d H:i:s"), ip=>get_client_ip(), param=>json_encode($arg));
                $md->data($log)->add();
            }
        }
    }



}
?>