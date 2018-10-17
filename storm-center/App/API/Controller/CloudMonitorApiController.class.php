<?php
namespace API\Controller;
use Home\Controller\BaseController;
use Home\Globals\Constants;
use Org\Util\Date;
use Think\Controller\RestController;

/**
 * Class WebSurveyController
 * @package API\Controller
 * 网站普查的一些接口
 */
class CloudMonitorApiController extends RestController {
    public function _initialize(){
        //访问IP限制
        if(get_client_ip()!='192.168.28.233'){
            $this->ajaxReturn(array("code"=>0,"msg"=>"ip forbid"));
        }
        //有效期限制
        $Date = new Date();
        if($Date->dateDiff('2016-11-01','m')<=0){
            $this->ajaxReturn(array("code"=>0,"msg"=>"time forbid"));
        }

    }
    //一分钟内访问次数限制
    private function checkMinuteCount($keys){
        $time=date("Y-m-d H:i");
        $key="ah160318dbapp"."_count_".$keys.$time;

        if(!S($key)){
            S($key,1,array('type'=>'file','expire'=>60));
        }
        $maxCount=5;
//        if($maxCount==-1){
//            return true;
//        }
        //$maxCount=5;
        $count=S($key);
        if($count>$maxCount){
            return false;
        }
        S($key,($count+1),array('type'=>'file','expire'=>60));
        return true;

    }

    //网站服务质量
    public function sitaAvail(){
//        $domain=I("domain");
        if(!$this->checkMinuteCount("sitaAvail")){
            $this->ajaxReturn(array("code"=>0,"msg"=>"visitNum over"));
        }
        $json=http_post(C("WARN_FILTER_PATH")."/api/webAccessInfo",array("domain"=>"http://g20.org/"),'json');
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
        $result['dataList'] = array();
        foreach($access as $area => $reponseTime){
            $areaRepose['area'] = $area;
            $areaRepose['value'] = $reponseTime;
            array_push($result['dataList'],$areaRepose);
        }
        $this->ajaxReturn($result);

    }
    //访问源区域排行
    public function visitAreaTopN(){
        if(!$this->checkMinuteCount("visitAreaTopN")){
            $this->ajaxReturn(array("code"=>0,"msg"=>"visitNum over"));
        }
        $json=http_post(C("CLOUD_WAF_API_PATH")."/api/topN/visit/area",array("keys"=>"deviceId_160030,deviceId_160033,deviceId_160036,deviceId_160039", "point"=>I('point')),'json');
        $data=array();
        foreach($json['data'] as $k=>$v){
            $data[]=array("name"=>$k,"value"=>$v);
        }
        $result['dataList'] = $data;
        $result['total'] = $json['total'];
        $this->ajaxReturn($result);
    }
//    访问源IP排行
    public function visitIpTopN(){
        if(!$this->checkMinuteCount("visitIpTopN")){
            $this->ajaxReturn(array("code"=>0,"msg"=>"visitNum over"));
        }
        $json=http_post(C("CLOUD_WAF_API_PATH")."/api/topN/visit/ip",array("keys"=>"deviceId_160030,deviceId_160033,deviceId_160036,deviceId_160039","point"=>I('point')),'json');
//        $json['dataList']=$json['items'];
//        $json['size']=$json['total'];
        $result['dataList'] = $json['items'];
        $this->ajaxReturn($result);
    }
    //地图下方滚动数据
    public function visitAndattackReal(){
        if(!$this->checkMinuteCount("visitAndattackReal")){
            $this->ajaxReturn(array("code"=>0,"msg"=>"visitNum over"));
        }
        $json=http_post(C("CLOUD_WAF_API_PATH")."/api/lasest/worldMapData/list",array("keys"=>"deviceId_160030,deviceId_160033,deviceId_160036,deviceId_160039"),'json');
        $data=http_post(C("CLOUD_WAF_API_PATH")."/api/lasest/item/list",array("keys"=>"deviceId_160030,deviceId_160033,deviceId_160036,deviceId_160039","point"=>30),'json');
        $json['data']['items']=$data['data']['attack'];
        $result['visit'] = array();
        $result['attack'] = array();
        foreach($json['data']['visit'] as $area => $value){
            $visitValue['area'] = $area;
            $visitValue['value'] = $value;
            array_push($result['visit'],$visitValue);
        }
        foreach($json['data']['attack'] as $area => $value){
            $visitValue['area'] = $area;
            $visitValue['value'] = $value;
            array_push($result['attack'],$visitValue);
        }
//        $result['visit'] = $json['data']['visit'];
//        $result['attack'] = $json['data']['attack'];
        $result['items'] = $json['data']['items'];
        $this->ajaxReturn($result);

    }
    //网站攻击趋势
    public function visitAndAttackCount(){
        if(!$this->checkMinuteCount("visitAndAttackCount")){
            $this->ajaxReturn(array("code"=>0,"msg"=>"visitNum over"));
        }
        $json=http_post(C("CLOUD_WAF_API_PATH")."/api/lasest/visit_attack/countlist",array('keys'=>"deviceId_160030,deviceId_160033,deviceId_160036,deviceId_160039","point"=>1440),'json');
        $result['dataList']['visit'] = array();
        $result['dataList']['attack'] = array();
        foreach($json['data']['visit'] as $visitTime => $visitCount){
            $visit['time'] = $visitTime;
            $visit['visitCount'] = $visitCount;
            array_push($result['dataList']['visit'],$visit);
        }
        foreach($json['data']['attack'] as $attackTime => $attackCount){
            $attack['time'] = $attackTime;
            $attack['attackCount'] = $attackCount;
            array_push($result['dataList']['attack'],$attack);
        }
        $this->ajaxReturn($result);
    }
    //流量分析
    public function flows(){
        if(!$this->checkMinuteCount("flows")){
            $this->ajaxReturn(array("code"=>0,"msg"=>"visitNum over"));
        }
        $json=http_post(C("SOC_API_PATH")."/host/network/g20/mins",array("deviceId"=>"160030-160033"),'json');
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
    //攻击网站URL排行
    public function attackUrlTopN(){
        if(!$this->checkMinuteCount("attackUrlTopN")){
            $this->ajaxReturn(array("code"=>0,"msg"=>"visitNum over"));
        }
        $json=http_post(C("CLOUD_WAF_API_PATH")."/api/topN/attack/url",array("keys"=>"deviceId_160030,deviceId_160033,deviceId_160036,deviceId_160039", "point"=>I('point')),'json');
        $data=array();
        foreach($json['data'] as $k=>$v){
            $data[]=array("name"=>$k,"value"=>$v);
        }
        $json['dataList']=$data;
        $result['dataList'] = array();
        foreach($json['data'] as $url => $attackCount){
            $urlAttack['url'] = $url;
            $urlAttack['attackCount'] = $attackCount;
            array_push($result['dataList'],$urlAttack);
        }
        $this->ajaxReturn($result);
    }
    //攻击源IP排行
    public function attackIpTopN(){
        if(!$this->checkMinuteCount("attackIpTopN")){
            $this->ajaxReturn(array("code"=>0,"msg"=>"visitNum over"));
        }
        $json=http_post(C("CLOUD_WAF_API_PATH")."/api/topN/attack/ip",array("keys"=>"deviceId_160030,deviceId_160033,deviceId_160036,deviceId_160039","point"=>I('point')),'json');
        $json['dataList']=$json['items'];
        $json['size']=$json['total'];
        $result['items'] = $json['items'];
        $this->ajaxReturn($result);
    }
    //访问和攻击量
    public function todayVisitsAndAttacks(){
        if(!$this->checkMinuteCount("todayVisitsAndAttacks")){
            $this->ajaxReturn(array("code"=>0,"msg"=>"visitNum over"));
        }
        $json=http_post(C('CLOUD_WAF_API_PATH')."/api/lasest/total/counter",array("keys"=>"deviceId_160030,deviceId_160033,deviceId_160036,deviceId_160039"),'json');
        $result['visit'] = $json['data']['visit'];
        $result['attack'] = $json['data']['attack'];
        $this->ajaxReturn($result);

    }
    //一分钟之内的流量
    public function flowsInOneMin(){
        if(!$this->checkMinuteCount("flowsInOneMin")){
            $this->ajaxReturn(array("code"=>0,"msg"=>"visitNum over"));
        }
        $json=http_post(C("SOC_API_PATH")."/host/network/g20/secs",array("deviceId"=>"160030-160033"),'json');
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
}