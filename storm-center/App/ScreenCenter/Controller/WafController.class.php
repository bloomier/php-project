<?php
namespace ScreenCenter\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;


class WafController extends BaseController {



    public function index(){
        $this->display("./waf");
    }
    // 站点流量排行
    public function flowRank(){
        //point 代表60钟内 可任意定制
        $param['point'] = 10;
        if(I("point")){
            $param['point'] = I("point");
        }

        $json=http_post(C("CLOUD_WAF_PATH")."/api/cloudwaf/domainflowout/list",$param,'json');
        $lasest=array();
        $all=array();
        foreach($json['data']['all'] as $k=>$v){
            $all[]=array(name=>$k,value=>$v);
        }
        foreach($json['data']['lasest'] as $k=>$v){
            $lasest[]=array(name=>$k,value=>$v);
        }

        $this->ajaxReturn(array("all"=>$all,"lasest"=>$lasest));

    }

    //站点访问量排行
    public function visitCountRank(){
        $json=http_post(C("CLOUD_WAF_PATH")."/api/cloudwaf/domainvisit/list",array("point"=>10),'json');
        $lasest=array();
         $all=array();
        foreach($json['data']['all'] as $k=>$v){
             $all[]=array(name=>$k,value=>$v);
         }
         foreach($json['data']['lasest'] as $k=>$v){
            $lasest[]=array(name=>$k,value=>$v);
         }
        $this->ajaxReturn(array("all"=>$all,"lasest"=>$lasest));
    }
    //站点攻击量排行
    public function attackCountRank(){
        $json=http_post(C("CLOUD_WAF_PATH")."/api/cloudwaf/domainattack/list",array("point"=>10),'json');
        $lasest=array();
        $all=array();
        foreach($json['data']['all'] as $k=>$v){
            $all[]=array(name=>$k,value=>$v);
        }
        foreach($json['data']['lasest'] as $k=>$v){
            $lasest[]=array(name=>$k,value=>$v);
        }
        $this->ajaxReturn(array("all"=>$all,"lasest"=>$lasest));
    }

    //
    public function ipCountRank(){
        $param['point'] = 10;
        if(I("point")){
            $param['point'] = I("point");
        }
        $json=http_post(C("CLOUD_WAF_PATH")."/api/cloudwaf/visitip/realtimeTopN",$param,'json');
        $visitIP = array();
        $attackIP = array();
        foreach($json['items'] as $k=>$v){
            $visitIP[]=array(name=>$v['ip'],value=>$v['count'],location=>$v['location']);
        }

        $json=http_post(C("CLOUD_WAF_PATH")."/api/cloudwaf/attackip/realtimeTopN",$param,'json');
        foreach($json['items'] as $k=>$v){
            $attackIP[]=array(name=>$v['ip'],value=>$v['count'],location=>$v['location']);
        }
        $this->ajaxReturn(array("visitIP"=>$visitIP,"attackIP"=>$attackIP));
    }

    //waf集群访问趋势访问次数-攻击次数
    public function visitAttackCounterList(){
        $json=http_post(C("CLOUD_WAF_PATH")."/api/cloudwaf/visit_attack/countlist",null,'json');


        $this->ajaxReturn($json['data']);
    }
    //waf集群流量趋势->正常访问量 和非正常访问量
    public function flowNormalCounterList(){
        $json=http_post(C("CLOUD_WAF_PATH")."/api/cloudwaf/flow/countlist",null,'json');
       //dump($json['data']);
        $this->ajaxReturn($json['data']);
    }
    //引擎IP
    public function mainState()
    {
        $param['ips'] = I("ipList");
        $json = http_post(C("ZBBIX_PATH") . "/host-info/host/info", $param, 'json');
        $this->ajaxReturn($json);
    }
    //站点总个数
    public function domainCount(){
        $this->redirect("API/CloudWaf/defenseCount");

    }

    //当天攻击次数
    public function attackTimes(){
        $json=http_post(C("CLOUD_WAF_PATH")."/api/cloudwaf/defense/count",null,'json');
        $this->ajaxReturn($json['data']);



    }

    //总站个数
    /*public function totalCount(){
        $json=http_post(C("CLOUD_WAF_PATH")."/api/cloudwaf/hosts/count",null,'json');
        $this->ajaxReturn($json);


    }*/





}