<?php


namespace MSSP\Controller;
use Home\Controller\BaseController;
use Think\Controller;

/**
 * 我的站点
 * Class ContractController
 * @package MSSPSelf\Controller
 */
class MonitorController extends BaseController {

    public function index(){
        $user=session("user");
        $param=array();
        if($user['id']!=1&&$user['role_id']!=1){
            $param['user_id']= $user['id'];
        }
        $json=http_post(C("STORM_CENTER_PATH")."/mssp/MsspUserContractRelation/queryContractId",$param,'json');
        if($json['code']<0){
            $this->error("对不起,数据异常");
        }
        $contractIds=$json['other']['contract_ids'];

//        if($contractIds==''){
//            $this->error("对不起,您还没有对应的合同");
//        }
        $this->assign("contractIds",$contractIds);
        $json=http_post(C("STORM_CENTER_PATH")."/mssp/MsspUserScreenConfig/queryConfig",array("user_id"=>$user['id']),'json');
        if($json['other']['domain_list']){
            $this->assign("config_domains",$json['other']['domain_list']);
        }
        $this->display("index");
    }
}