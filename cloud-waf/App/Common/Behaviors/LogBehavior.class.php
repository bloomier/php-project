<?php
namespace Common\Behaviors;





use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;

class LogBehavior{
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
        if(IS_AJAX||is_array($arg)){//如果是ajax请求
            if(is_array($row)){
                if($arg){
                   $log_code=$row['log_code'];
                   $success_code=$row['success_code'];
                   if(!$success_code){
                       $success_code=1;
                   }
                   $success=($success_code==$arg['code']?1:0);
                   if($log_code){//˵��ֵ��¼��code�µ���־����ݿ� �����Ժ��¼���ļ�
                       if($arg['code']==$log_code){
                           $log=array(name=>$row['name'],success=>$success,param=>$arg,uid=>current_user_id(),time=>date("Y-m-d H:i:s"),ip=>get_client_ip());
                           $md->data($log)->add();
                       }
                   }else{//���������Ҫ��¼
                       $log=array(name=>$row['name'],success=>$success,action=>__INFO__,param=>$arg,uid=>current_user_id(),time=>date("Y-m-d H:i:s"),ip=>get_client_ip());
                       $md->data($log)->add();
                   }


                }
            }
        }else{//��ͨ�Ĳ���
            if(is_array($row)){
                $log=array(name=>$row['name'],action=>__INFO__,uid=>current_user_id(),time=>date("Y-m-d H:i:s"),ip=>get_client_ip());
                $md->data($log)->add();
            }
        }
    }



}
?>