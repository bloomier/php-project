<?php
namespace Admin\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;

class AccessController extends BaseController {
    public function index(){
        $groups=$this->listAccess();
        $g1=array();//模块权限
        $g2=array();//操作权限
        foreach($groups as $g){
            if($g['type']==0){
                $g1[]=$g;
            }else if($g['type']==1){
                $g2[]=$g;
            }
        }
       // dump($groups);
      //  dump(data_merage($groups));
        $this->assign("groups",data_merage($g1));
        $this->assign("accessGroups",data_merage($g2));
        $this->display();
    }
    private function listAccess(){
        $groups=M("auth_group")->select();
       // dump(data_merage($groups));
        $rules=M("auth_rule")->select();
        $ruleMap=array();
        foreach($rules as $rule){
            $ruleMap[$rule['id']]=$rule;
        }
        $arr=array();
        foreach($groups as $g){
            $ruleIds=explode(",",$g['rules']);
            if($ruleIds&&count($ruleIds)>0){
                $_rs=array();
                foreach($ruleIds as $rid){
                    $_rs[]=$ruleMap[$rid];
                }
                $g["rules"]=$_rs;

            }
            $arr[]=$g;

        }

        return $arr;
       //   $this->ajaxReturn($groups);
    }
}