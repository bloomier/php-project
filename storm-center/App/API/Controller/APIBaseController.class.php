<?php
namespace API\Controller;

use Think\Controller\RestController;

class APIBaseController extends RestController {

    protected $allowMethod    = array('get'); // REST允许的请求类型列表
    protected $allowType      = array('json'); // REST允许请求的资源类型列表

    public function _initialize(){
        if(!IS_GET){
            $this->ajaxReturn(array("code"=>0,"msg"=>"reqeust method must be get"));

        }
        $xKey=I("xKey");
        $xToken=I("xToken");
        if(!$xKey){
            $this->ajaxReturn(array("code"=>0,"msg"=>"xKey is empty"));
        }
        if(!$xToken){
            $this->ajaxReturn(array("code"=>0,"msg"=>"xToken is empty"));
        }


        $apiKey=$this->getApiKey($xKey);
        if(!$apiKey){
            $this->ajaxReturn(array("code"=>0,"msg"=>"xKey is not exits"));

        }
        $keyPass=$apiKey['key_pass'];

        // dump($apiKey);
        $uri="/".__INFO__;
        if(md5($uri.$keyPass.dateKey())!=$xToken){
            $this->ajaxReturn(array("code"=>0,"msg"=>"xToken is not match"));

        }

        if($xKey=='B38FB691-72E8-2E1E-CE75-C7FEBE6310A2'){

            return true;
        }
        $rules=$apiKey['rules'];
        $_rules=array();
        foreach($rules as $rule){
            $_rules[]=strtolower($rule);
        }
        //print_r($rules);
        $controller=MODULE_NAME.'/'.CONTROLLER_NAME.'/'.ACTION_NAME;

        if(!in_array(strtolower($controller),$_rules)){
            $this->ajaxReturn(array("code"=>0,"msg"=>"uri permission deny"));
        }
        if(!$this->checkHourCount($apiKey)){
            $this->ajaxReturn(array("code"=>0,"msg"=>$apiKey['hour_count']." visit count limited"));
        }
    }

    private function checkHourCount($apiKey){
        $key=$apiKey['key']."_count_".hourKey();
        if(!S($key)){
            S($key,1,array('type'=>'file','expire'=>3600));
        }
        $maxCount=intval($apiKey['hour_count']);
        if($maxCount==-1){
            return true;
        }
        //$maxCount=5;
        $count=S($key);
        if($count>$maxCount){
            return false;
        }
        S($key,($count+1),array('type'=>'file','expire'=>3600));
        return true;


    }
    private function getApiKey($xKey){
        $apiKey=S($xKey);
        if($apiKey){
            return $apiKey;
        }

        $apiKey=M("api_key")->where(array("key"=>$xKey))->find();
        if($apiKey){
            $map['id']=array("in",$apiKey['rules']);
            $rules=M("api_rule")->where($map)->field("name")->select();
            if(!$rules){
                $rules=array();
            }
            $ruleNames=array();
            foreach ($rules as $r) {
                $ruleNames[]=$r['name'];

            }
            $apiKey['rules']=$ruleNames;


        }
        if($apiKey){
            //1小时的有效缓存时间
            S($xKey,$apiKey,array('type'=>'file','expire'=>3600));
        }

        return $apiKey;


    }



}
