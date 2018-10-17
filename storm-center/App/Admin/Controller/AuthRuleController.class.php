<?php
namespace Admin\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;


class AuthRuleController extends Controller {

    public function index(){
        $this->display('index');
    }

    public function listAllAuthRule(){
        $result['code']=0;
        $where=array("1=1");
        $param=I("param");
        if($param){
            $where[]="name like '%".$param."%'";
        }
        $roles=M("auth_rule")->where($where)->select();
        if($roles){
            $result['rows']=$roles;
        }
        $this->ajaxReturn($result);
    }



}