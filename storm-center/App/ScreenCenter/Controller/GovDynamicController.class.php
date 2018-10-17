<?php
namespace ScreenCenter\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;


class GovDynamicController extends BaseController {

    public function index(){
        $user=session("user");
        if($user['city']&&$user['city']!="全省"){
            $this->assign("current_city",$user['city']);
            $this->assign("current_province",$user['province']);
        }else if($user['province']&&$user['province']!="全国"){
            $this->assign("current_province",$user['province']);
        }else{
            if(I("province")){
                $this->assign("current_province",I("province"));
            }
            if(I("city")){
                $this->assign("current_city",I("city"));
            }
        }
        $this->assign("imgserver",C("IMAGE_SERVER"));
        $this->display("./gov-dynamic");
    }

    private function checkPermission($province,$city){
        $user=session("user");
        $current_province=$user['province'];
        $current_city=$user['city'];
        if($current_province=="全国"){
            return true;
        }
       if($current_city&&$current_city!="全省"){//说明用户有城市属性
            if($city!=$current_city){
                return false;
            }
       }else if($current_province&&$current_province!='全国'){
            if($province!=$current_province){
                return false;
            }

       }
        if($current_province||$current_city){
            if($city=='china'||$city=="全国"){
                return false;
            }
        }

        return true;


    }
    /**
     * 获取目标地区的数据
     */
    public function getLocationData(){
        $location=I('location');
        $province=I("parent");
        if(!$province||$province=='china'){
            $province=$location;
        }
        if(!$this->checkPermission($province,$location)){
            $this->ajaxReturn(array("code"=>-1,"msg"=>"对不起，您没有".$location."的数据权限"));
        }
        $json=http_post(C('STATIC_PATH')."/api/locationData",array("location"=>$location),'json');
//        $json['province']=$location;
//        data.vuls.risk_rank[level]['type_rank']
        $this->ajaxReturn($json);
    }

    /**
     * new-获取区县数据
     */
    public function loadDistData(){
        $location=I('location');
        $type=I('type');
//        echo C('STATIC_PATH')."/api/loadDistData?location=".$location."&type=".$type;
        $json=http_post(C('STATIC_PATH')."/api/loadDistData",array("location"=>$location,"type"=>$type),'json');
        $this->ajaxReturn($json);
    }


    /**
     * 获取0day数据
     */
    public function zeroDayData(){
        $json=http_post(C('STATIC_PATH')."/api/zeroDayData",null,'json');
        $this->ajaxReturn($json);
    }

    /**
     * 获取0day的描述
     */
    public function zeroDayDesc(){
        $desc="";
        $type=I('type');
        if($type){
            $file= './Public/source/zeroday/desc/'.$type.'.txt';
            if(file_exists($file)){
                $desc=file_get_contents($file);
            }
        }
        $this->ajaxReturn(array("desc"=>$desc));
    }
    /**
     * 获取高危端口的描述
     */
    public function portDesc(){
        $desc="";
        $port=I('port');
        if($port){
            $file= './Public/source/ports/desc/'.$port.'.txt';
            if(file_exists($file)){
                $desc=file_get_contents($file);
            }
        }
        $this->ajaxReturn(array("desc"=>$desc));
    }
    /**
     * 获取漏洞名称和编号的映射关系 ，编号和等级的映射关系
     */
    public function vulsMapper(){
        $json=http_post(C('STATIC_PATH')."/api/vulsMapper",null,'json');
        $this->ajaxReturn($json);
    }
    /**
     * 获取漏洞的描述和建议
     */
    public function vulsDescAndAdvice(){
        $vulsId=I("vulsId");
        $desc="";
        $advice="";
        if($vulsId){
            $dir='./Public/source/vuls';
            if(file_exists($dir."/advice/".$vulsId.'.txt')){
                $advice=file_get_contents($dir."/advice/".$vulsId.'.txt');
            }
            if(file_exists($dir."/desc/".$vulsId.'.txt')){
                $desc=file_get_contents($dir."/desc/".$vulsId.'.txt');
            }

        }
        $this->ajaxReturn(array("desc"=>$desc,"advice"=>$advice));

    }
    /**
     * 获取响应类型的报告
     */
    public function report(){
        $type=I("type");
        if(!$type){
            $this->ajaxReturn(array("code"=>0,"msg"=>"type is empty"));
        }else{
            $json=http_post(C('STATIC_PATH')."/api/report",I(),'json');
            $this->ajaxReturn($json);
        }
    }

    /**
     * 获取首页截图
     */
    public function loadHomePage(){
        $domain=I('domain');
        $img="homepage/".$domain.".png";
        $json=http_post(C("IMAGE_SERVER")."/index.php/Image/imgExist?img=".$img,null,'json');
        $this->ajaxReturn(array("exist"=>$json['exist'],"img"=>$img));
    }

    public function refresh(){
         $this->ajaxReturn(array("code"=>1));
    }




}