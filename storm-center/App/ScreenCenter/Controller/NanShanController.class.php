<?php
namespace ScreenCenter\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;


class NanShanController extends BaseController {

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
        $this->display("./nan-shan");
    }

    public function monitorData(){
        $file="./Public/js/nanshan/nanshan.txt";
        $txt=file_get_contents($file);
        $txt=json_decode($txt,true);

        $keys=array_keys($txt);
        $_k="";
        foreach($keys as $k){
            $_k.=$k.",";
        }
        $api="http://172.16.2.88:8089/warnapp//api/contract/accessinfos/list";
        $json=http_post($api,array("domains"=>$_k),'json');
        $base=$json['other']['base'];
        $data=array();
        foreach($base as $k=> $d){
            $data[]=array("domain"=>$k,"status"=>$d['value'],"desc"=>$d['value']==1?"服务正常":"服务异常",title=>$txt[$k]);
        }

        $this->ajaxReturn($data);
    }
    public function images(){
        $file="./Public/js/nanshan/vuls.txt";
        $txt=file_get_contents($file);
        $txt=json_decode($txt,true);
        $this->ajaxReturn($txt);
    }


}