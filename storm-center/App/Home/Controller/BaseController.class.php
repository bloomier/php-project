<?php
namespace Home\Controller;
use Think\Auth;
use Think\Controller;
class BaseController extends Controller {
	public function _initialize(){

        $ip=get_client_ip();

        if(is_file("ipAccess.php")){
            $ips=include("ipAccess.php");

            if (!in_array($ip,$ips)){
                #echo $ip;
                $this->ajaxReturn("ip is forbidden:".$ip);
            }
        }
        //apiKey绕过登录认证，只适用于大屏展现
        if($this->checkApiKey()){
            if($this->checkApiKeyPermission()){
                return true;
            }
        }


         $this->assign("pathInfo",MODULE_NAME.'/'.CONTROLLER_NAME.'/'.ACTION_NAME);

        if(session('?user')){

            $user=session("user");
            $this->assign("user",$user);
            $moudels=session("moudels");
            //dump($moudels);
            $this->assign("moudels",$moudels);

            //auth类的权限控制，该用户是否有某个action的权限
            if(!authcheck(MODULE_NAME.'/'.CONTROLLER_NAME.'/'.ACTION_NAME,$user)){

                $this->error("对不起,您没有权限访问此页面");
            }
        }else{
             $this->redirect("Home/Login/index");
        }
    }


    private  function checkApiKey(){

        if(MODULE_NAME!="ScreenCenter"){
            return false;
        }
        $ip=get_client_ip();
        if(S("apiKey".$ip)){
           // echo "get Apikey from cookie";
            return true;
        }
        // 对control的限制
        $xKey=I("xKey");
        $xToken=I("xToken");
        if(!$xKey||!$xToken){
            return false;
        }


       // dump($xKey.$xToken);
        $apiKey=$this->getApiKey($xKey);
        if(!$apiKey){
            return false;
        }
        $keyPass=$apiKey['key_pass'];
        $xToken=I("xToken");
        if(md5(dateKey().$keyPass)!=$xToken){
            return false;
        }

        S("apiKey".$ip,$apiKey,array('type'=>'file','expire'=>120));
      //  S($xKey,$apiKey,array('type'=>'file','expire'=>5));
        return true;
    }

    private function checkApiKeyPermission(){
        $ip=get_client_ip();
        $apiKey=S("apiKey".$ip);
        if(!$apiKey){
            return false;
        }

        $controller=MODULE_NAME.'/'.CONTROLLER_NAME.'/'.ACTION_NAME;
        if(I('key')){
            $controller = $controller.'/key/'.I('key');
        }

        $rules=$apiKey['rules'];
        $_rules=array();
        foreach($rules as $rule){
            $_rules[]=strtolower($rule);
        }

        if(in_array(strtolower($controller),$_rules)){
            return true;
        }
        return false;
    }
    private function getApiKey($xKey){
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
        return $apiKey;

    }





}