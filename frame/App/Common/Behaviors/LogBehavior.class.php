<?php
namespace Common\Behaviors;





use Common\Model\AutoIncrementModel;
use Common\Vendor\Constants;
use Think\Model\MongoModel;

class LogBehavior{
    function run($arg){
        if(!S("opt_log_rule")){
            change_db_main();
            $md=new MongoModel("rule_opt_log");
            $rows=$md->select();
            S("opt_log_rule",$rows,3600);
        }
        $conf=S("opt_log_rule");
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
        change_db(current_region_id());
        $md=new AutoIncrementModel(Constants::$DB_LOG_OPT);
        $uid=current_user_id();
        if(is_global_user()){
            $uid=0;
        }
        if(IS_AJAX||is_array($arg)){
            if(is_array($row)){
                if($arg){
                   $log_code=$row['log_code'];
                   $success_code=$row['success_code'];
                   if(!$success_code){
                       $success_code=1;
                   }
                   if($log_code){
                       if($arg['code']==$log_code){
                           $success=($success_code==$arg['code']?1:0);
                           $log=array(name=>$row['name'],success=>$success,param=>$arg,uid=>$uid,time=>date("Y-m-d H:i:s"),ip=>get_client_ip());
                           $md->data($log)->add();
                       }
                   }else{
                       $success=($success_code==$arg['code']?1:0);
                       $log=array(name=>$row['name'],success=>$success,action=>__INFO__,param=>$arg,uid=>$uid,time=>date("Y-m-d H:i:s"),ip=>get_client_ip());
                       $md->data($log)->add();
                   }


                }
            }
        }else{
            if(is_array($row)){
                $log=array(name=>$row['name'],action=>__INFO__,uid=>$uid,time=>date("Y-m-d H:i:s"),ip=>get_client_ip());
                $md->data($log)->add();
            }
        }
    }



}
?>