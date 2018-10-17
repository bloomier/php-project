<?php
namespace ScreenCenter\Controller;
use Home\Controller\BaseController;
use Home\Globals\Log;
use Think\Controller;
use Think\Model;


class CloudMonitorController extends BaseController {

    public function index(){

        $this->assign("key",I("key"));
        if(I('simple')){
            $this->display("./cloud-monitor-simple");
        }else{
            $this->display("./cloud-monitor");
        }

    }

    public function sitaAvail(){
        $domain=I("domain");
        $json=http_post(C("WARN_FILTER_PATH")."/api/webAccessInfo",array("domain"=>$domain),'json');
        $data=$json['data'];
        $access=array();
        foreach ($data as $key=>$value) {
            $http_code=$value['other']['http_code'];
            if($http_code>=200&&$http_code<400){
                $access[$key]=$value['other']['response_time'];
            }else{
                $access[$key]=-1;
            }
        }
        $this->ajaxReturn($access);

    }
    public function visitAreaTopN(){

        $json=http_post(C("CLOUD_WAF_PATH")."/api/topN/visit/area",array("keys"=>I('keys'), "point"=>I('point')),'json');
        $data=array();
        foreach($json['data'] as $k=>$v){
            $data[]=array("name"=>$k,"value"=>$v);
        }
        $json['dataList']=$data;
        $json['size']=$json['total'];
        $this->ajaxReturn($json);
    }
    public function attackIpTopN(){
        $json=http_post(C("CLOUD_WAF_PATH")."/api/topN/attack/ip",array("keys"=>I('keys'),"point"=>I('point')),'json');
        $json['dataList']=$json['items'];
        $json['size']=$json['total'];
        $this->ajaxReturn($json);
    }
    public function visitIpTopN(){
        $json=http_post(C("CLOUD_WAF_PATH")."/api/topN/visit/ip",array("keys"=>I('keys'),"point"=>I('point')),'json');
        $json['dataList']=$json['items'];
        $json['size']=$json['total'];

        $this->ajaxReturn($json);
    }

    /** 获取G20访问次数的预测值 */
    public function getVisitCount(){
        $json=http_post(C("SOCPLATFORM_PATH")."/visitCount",null,'json');
        $this->ajaxReturn($json);
    }


    public function getAttackTypeTopN(){
        //过滤掉两个deviceId   "deviceId_160036,deviceId_160039"
        $json=http_post(C("CLOUD_WAF_PATH")."/api/topN/attack/type",array("keys"=>I('keys'),"num"=>10),'json');
        $items=array();
        foreach($json['data'] as $k=>$v){
            $items[]=array("name"=>$k,"count"=>$v);
        }
        $json['data'] = '';
        $json['dataList']=$items;
        $json['size']=count($items);

        $this->ajaxReturn($json);
    }


    public function attackUrlTopN(){
        $json=http_post(C("CLOUD_WAF_PATH")."/api/topN/attack/url",array("keys"=>I('keys'), "point"=>I('point')),'json');
        $data=array();
        foreach($json['data'] as $k=>$v){
            $data[]=array("name"=>$k,"value"=>$v);
        }
        $json['dataList']=$data;

        $this->ajaxReturn($json);
    }
    /**
     * 最近30个点
     */
    public function visitAndAttackCount(){
        $json=http_post(C("CLOUD_WAF_PATH")."/api/lasest/visit_attack/countlist",array('keys'=>I('keys'),"point"=>I("point")),'json');
        $this->ajaxReturn(array("visit"=>$json['data']['visit'],"attack"=>$json['data']['attack']));
    }

    public function todayVisitsAndAttacks(){
        $json=http_post(C('CLOUD_WAF_PATH')."/api/lasest/total/counter",array("keys"=>I("keys")),'json');
        $this->ajaxReturn($json);

    }
    public function flows(){
        $json=http_post(C("SOC_PATH")."/host/network/g20/mins",array("deviceId"=>I('deviceId')),'json');
        $ins=array('bps_in1','bps_in2','bps_in');
        $outs=array('bps_out1','bps_out2','bps_out');
        $count=0;
        foreach($ins as $in){
            if(!$count&&$json[$in]){
                $count=count($json[$in]);
            }
        }
        $_in=array();
        $_out=array();
       for($i=0;$i<$count;$i++){
           $_inOne=0;
           foreach($ins as $in){
               if($json[$in]){
                   $_inOne=$_inOne+ round($json[$in][$i] * 8 / 1024 / 1024, 2);
               }
           }
           $_in[]=$_inOne;
       }
        for($i=0;$i<$count;$i++){
            $_outOne=0;
            foreach($outs as $out){
                if($json[$out]){
                    $_outOne=$_outOne+ round($json[$out][$i] * 8 / 1024 / 1024, 2);;
                }
            }
            $_out[]=$_outOne;
        }

        $this->ajaxReturn(array("in"=>$_in,"out"=>$_out));
    }

    /**
     * 一分钟之内的流量
     */
    public function flowsInOneMin(){
        $json=http_post(C("SOC_PATH")."/host/network/g20/secs",array("deviceId"=>I('deviceId')),'json');
        $ins=array('bps_in1','bps_in2','bps_in');
        $outs=array('bps_out1','bps_out2','bps_out');
        $count=0;
        foreach($ins as $in){
            if(!$count&&$json[$in]){
                $count=count($json[$in]);
            }
        }
        $_in=array();
        $_out=array();
        for($i=0;$i<$count;$i++){
            $_inOne=0;
            foreach($ins as $in){
                if($json[$in]){
                    $_inOne=$_inOne+ round($json[$in][$i] * 8 / 1024 / 1024, 2);
                }
            }
            $_in[]=$_inOne;
        }
        for($i=0;$i<$count;$i++){
            $_outOne=0;
            foreach($outs as $out){
                if($json[$out]){
                    $_outOne=$_outOne+ round($json[$out][$i] * 8 / 1024 / 1024, 2);;
                }
            }
            $_out[]=$_outOne;
        }
        $this->ajaxReturn(array("in"=>$_in,"out"=>$_out));
    }

    public function visitAndattackReal(){
        $attakKey = I("keys");
        if($attakKey == "deviceId_160030,deviceId_160033,deviceId_160036,deviceId_160039"){
            $attakKey = "deviceId_160036,deviceId_160039";
        }
        $json=http_post(C("CLOUD_WAF_PATH")."/api/lasest/worldMapData/list",array("keys"=>I("keys")),'json');
        $data=http_post(C("CLOUD_WAF_PATH")."/api/lasest/item/list",array("keys"=>$attakKey,"point"=>120,"n"=>50),'json');
        $json['data']['items']=$data['data']['attack'];
        $this->ajaxReturn($json['data']);

    }
    public function hostHealth(){
        $json=http_post(C("ZBBIX_PATH")."/host-info/host/info?ips=172.16.2.40",null,'json');
        $infos=$json['hostinfo']['172.16.2.40'];
        $data=array(
            "cpu"=>floatval(str_replace("","%",$infos['cpu'])),
            "memory"=>floatval(str_replace("","%",$infos['memery'])),
            "io"=>$infos['io']);
        $this->ajaxReturn($data);
    }

    public function domainVulsInfo(){
        $result=array();
        $vulsinfo=initVulsInfo(I('domain'));
        if($vulsinfo['vulscount']){
//            if($vulsinfo['security']){
//                $result = array_merge($result, $this->initVulsInfo("高", $vulsinfo['security']['vulsinfo']));
//            }
//            if($vulsinfo['high']){
//                $result = array_merge($result, $this->initVulsInfo("高",$vulsinfo['high']['vulsinfo']));
//            }
//
//            if($vulsinfo['mid']){
//                $result = array_merge($result, $this->initVulsInfo("中",$vulsinfo['mid']['vulsinfo']));
//            }

            if($vulsinfo['low']){
                $result = array_merge($result, $this->initVulsInfo("低",$vulsinfo['low']['vulsinfo']));
            }

            if($vulsinfo['info']){
                $result = array_merge($result, $this->initVulsInfo("信息",$vulsinfo['info']['vulsinfo']));
            }
        }
        usort($result, function($a, $b) {
            $al = $a['count'];
            $bl = $b['count'];
            if ($al == $bl)
                return 0;
            return ($al > $bl) ? -1 : 1;
        });
        $this->ajaxReturn(array("size"=>$vulsinfo['vulscount'], "dataList"=>$result));
    }

    private function initVulsInfo($level, $list){
        $result = array();
        for($i = 0; $i < count($list); $i++){
            $tmp = $list[$i];
            $tmpValue = array();
            $tmpValue['holeType'] = $level;
            $tmpValue['vname'] = $tmp['vname'];
            $tmpValue['count'] = count($tmp['vuls_detail']);
            $result[] = $tmpValue;
        }
        return $result;
    }

}