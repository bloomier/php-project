<?php


namespace MSSP\Controller;
use Home\Controller\BaseController;
use Think\Controller;


/**
 * 我的站点
 * Class ContractController
 * @package MSSPSelf\Controller
 */
class ReportBaseController extends Controller {
    public function _initialize(){
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
            if($this->checkReportKey()){
                return true;
            }
            $this->redirect("Home/Login/index");
        }
    }
    private function checkReportKey(){
        $xKey=I("xKey");
        $xToken=I("xToken");
        if(!$xKey||!$xToken){
            return false;
        }
        if(!I("reqData")){
            $this->error("您的链接有误,无法从链接中获取有效信息");
        }
        $apiKey=$this->getApiKey($xKey);
        if(!$apiKey){
            $this->error("您的链接有误,不存在的xKey");
        }
        $uri="/".__INFO__;
        $uri=str_replace(" ","+",$uri);
        $tokenCheck=md5($uri.dateKey().$apiKey['key_pass']);
        if($tokenCheck!=$xToken){
            $this->error("您的链接有误,错误的xToken或者xToken已过期");
        }
        //获取请求中的uid
        $user=array("id"=>99999,"role_id"=>2000,name=>"报告查看专项用户","username"=>"report");

        session("user",$user);
        session("moudels",array());
        $this->assign("user",$user);
        $this->assign("moudels",array());

        return true;
    }


    private function getApiKey($xKey){
        $apiKey=M("api_key")->where(array("key"=>$xKey))->find();
        return $apiKey;

    }
    public function getDataByRsa_decrypt($data){
        $data= str_replace("___","/",$data);

        $tmp=explode("||||",$data);
        $res="";
        foreach($tmp as $t){
            $res=$res.rsa_decrypt(str_replace(" ","+",$t));
        }
        return $res;
    }







    




}