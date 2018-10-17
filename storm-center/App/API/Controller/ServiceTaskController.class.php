<?php
namespace API\Controller;

use Think\Controller\RestController;
use Think\Controller;

class ServiceTaskController extends  Controller {


    public function getServiceData(){

        $json=http_post(C('STORM_CENTER_PATH')."/mssp/msspContract/getServiceData",null,'json');
        $users=array();
        $result=array();
        if($json['code']==1){
            $result['code']=1;
            $result['data']=$json['data'];
            $userIds=$json['other'];
            $map['id']  = array('in',$userIds);
            $_us=M("user")->where($map)->field(array("id","name","email","username"=>"phone"))->select();
            foreach($_us  as $u){
                $users[$u['id'].""]=$u;
            }
            $result["other"]=$users;
            $result['items']=$json['items'];
        }else{
            $result['code']=0;
            $result['msg']=$json['msg'];
        }
        $this->ajaxReturn($result);



    }





}