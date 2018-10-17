<?php
namespace ScreenCenter\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;


class SOCWebInfoController extends Controller {



    public function index(){
        $this->display("./soc-web-info");
    }




    /**
     *  获取官网区域访问量；建议刷新频率 2分钟
     * num=10  top10
     * num=all  所有
     */
    public function visitAreaTopN(){

        $deviceId=checkDeviceId();
        $num=I("num");

        $json=http_post(C("SOC_PATH")."/device0/topN/area",array("deviceId"=>$deviceId,"num"=>$num),'json');
        $data=array();
        foreach($json['dataList'] as $k=>$v){
            $data[]=array("name"=>$k,"value"=>$v);
        }
        $json['dataList']=$data;
        $this->ajaxReturn($json);

    }
    //获取官网前10个访问ip； 建议刷新频率 2分钟
    public function visitIpTopN(){
        $deviceId=checkDeviceId();
        $json=http_post(C("SOC_PATH")."/device0/topN/ip",array('deviceId'=>$deviceId),'json');
        $arr=array();
        $dataList=$json['dataList'];
        $dataList2=$json['dataList2'];
        foreach($dataList as $key=>$v){

            $_d=array("count"=>$v,"ip"=>$key,'location'=>$dataList2[$key]);
            $arr[]=$_d;
        }
        $this->ajaxReturn(array("size"=>$json['size'],"dataList"=>$arr));


    }
    //dashborad 和可用性  建议刷新频率 2分钟
    public function dashBorad(){
        $domain=I('domain');
        $json=http_post(C("WARN_FILTER_PATH")."/api/webAccessInfo",array("domain"=>$domain),'json');
        $data=$json['data'];
        $okCount=0;
        $access=array();
        foreach ($data as $key=>$value) {
            if($value['status']==1){
                $okCount+=1;
            }
            $access[$key]=$value['other']['response_time'];
        }
        $allCount=count($data);
        if($okCount*100/$allCount>=80){
            $web_quality=1;

        }else if($okCount*100/$allCount>=50){
            $web_quality=2;

        }else {
            $web_quality=3;

        }

//        $json2=http_post(C("SOC_PATH")."/device/grade/threat",array('deviceId'=>$deviceId),'json');
//        $value=$json2['grade'];

        $today_danger_level=1;

        $dash_board=array("web_quality"=>$web_quality,"safe_level"=>1,"server_heath_level"=>3,"security_event_count"=>0,"today_danger_level"=>$today_danger_level);
        $this->ajaxReturn(array("dash_board"=>$dash_board,"access"=>$access));



    }
    //告警
    public function warning(){

    }
    //获取官网前10个攻击url； 建议刷新频率 2分钟
    public function attackUrlTopN(){
        $deviceId=checkDeviceId();
        $json=http_post(C("SOC_PATH")."/device0/topN/url",array('deviceId'=>$deviceId),'json');
        $data=array();
        foreach($json['dataList'] as $k=>$v){
            $data[]=array("name"=>$k,"value"=>$v);
        }
        $json['dataList']=$data;
        $this->ajaxReturn($json);

    }

    /**
     * 获取官网前10个黑名单ip 建议刷新频率 2分钟
     * num=10 top10
     * num=all 所有
     */
    public function attackIpTopN(){
        $deviceId=checkDeviceId();
        $num=I("num");
        $json=http_post(C("SOC_PATH")."/device0/topN/blacklist",array('deviceId'=>$deviceId,"num"=>$num),'json');
        $arr=array();
        $dataList=$json['dataList'];
        $dataList2=$json['dataList2'];
        foreach($dataList as $key=>$v){

            $_d=array("count"=>$v,"ip"=>$key,'location'=>$dataList2[$key]);
            $arr[]=$_d;
        }
        $this->ajaxReturn(array("size"=>$json['size'],"dataList"=>$arr));



    }



    //获取前10个攻击类型
    public function attackTypeTopN(){
        $deviceId=checkDeviceId();

        $json=http_post(C("SOC_PATH")."/device/topN/attackType",array('deviceId'=>$deviceId),'json');
        $this->ajaxReturn($json['dataList']);

    }

    // 获取单网站漏洞类型排行
    public function vlusTypeTopN(){
        $domain=I('domain');
        $param['domain'] = $domain;
        $json=http_post(C("STORM_CENTER_PATH")."/screencenter/socWebInfoOfSreen/queryOneDomainVulsTopN",$param,'json');
        $this->ajaxReturn($json['items']);
    }
    //一天内的预估的访问趋势  每个点之间的间隔时间是1分钟 共1440个点
    // 预测访问量
    public function visitCountTrend(){
        $deviceId=checkDeviceId();

        $json=http_post(C('SOC_PATH')."/device0/visit/predict",array('deviceId'=>$deviceId),'json');
       // dump($json);
        $data=$json['predictValue'];
        $res=array();
        foreach(explode(",",$data) as $d){
            $res[]=intval($d);
        }
        $this->ajaxReturn($res);


    }
    //从凌晨到当前时间的点  每个点之间的间隔时间是1分钟  建议刷新时间  30s
    // 实时访问量
    public function visitCountReal(){
        $deviceId=checkDeviceId();


       $data=http_post(C("SOC_PATH")."/device0/visit/count",array('deviceId'=>$deviceId),'json');
        $curPoint=$this->getCurrentPoint();
        $arr=array();

        for($i = 0; $i <= $curPoint; $i++) {
            $_value=$data[$i];
            if($_value){
                $arr[]=intval($_value['realValue']);

            }else{
                $arr[]=0;
            }
        }

        $this->ajaxReturn($arr);

    }
    //国内外 攻击量     建议刷新时间  30s
    public function attackCount(){
        $deviceId=checkDeviceId();
        $data=http_post(C("SOC_PATH")."/device0/attack/source",array('deviceId'=>$deviceId),'json');
        $curPoint=$this->getCurrentPoint();
        $arr=array();
        for($i = 0; $i <= $curPoint; $i++) {
            $inside=0;
            $outside=0;
            if($data[$i]){
                $_value=$data[$i];
                $inside=intval($_value['inside_count'])+intval($_value['unknown_count']);
                $outside=intval($_value['outside_count']);


            }
            $arr[]=array("in"=>$inside,"out"=>$outside);


        }

        $this->ajaxReturn($arr);


    }
    //实时攻击/访问数据
    public function visitAndattackReal(){

        $deviceId=checkDeviceId();
        //$deviceId=1148;

        $json=http_post(C("STORM_CENTER_PATH")."/mssp/msspDevice/visitAndattackRealTime",array("deviceId"=>$deviceId),'json');
//       $visits=$json['data']['visits'];
//        $visitsNew=array();
//        $cons=array("美国");
//        foreach($visits as $vit){
//            $num=rand(0,count($cons)-1);
//            $vit['srcGeoRegion']=$cons[$num];
//            $visitsNew[]=$vit;
//
//        }
//        $json['data']['visits']=$visitsNew;
        $this->ajaxReturn($json['data']);

    }
    private function getCurrentPoint(){
        $time=date('H:i');
        $tmp=explode(":",$time);
        $hour=intval($tmp[0]);
        $sec=intval($tmp[1]);
        return $hour*60+$sec;
    }







}