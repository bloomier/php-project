<?php
namespace ScreenCenter\Controller;
use Home\Controller\BaseController;
use Home\Globals\Log;
use Think\Controller;
use Think\Model;


class WebCloudWafController extends BaseController {


    public function index(){
        $this->display("./web-cloud-waf");

    }
    public function sitaAvail(){
        $domain=I("domain");
        $json=http_post(C("WARN_FILTER_PATH")."/api/webAccessInfo",array("domain"=>$domain),'json');
        $data=$json['data'];
        $access=array();
        foreach ($data as $key=>$value) {

            $access[$key]=$value['other']['response_time'];
        }
        $this->ajaxReturn($access);

    }
    public function visitAreaTopN(){
        $deviceId=checkDeviceId();
        $json=http_post(C("SOC_PATH")."/host/topN/area",array("deviceId"=>$deviceId),'json');
        $data=array();
        foreach($json['dataList'] as $k=>$v){
            $data[]=array("name"=>$k,"value"=>$v);
        }
        $json['dataList']=$data;
        $this->ajaxReturn($json);
    }
    public function attackIpTopN(){
        $deviceId=checkDeviceId();
        $json=http_post(C("SOC_PATH")."/host/topN/blacklist",array("deviceId"=>$deviceId),'json');
        $arr=array();
        $dataList=$json['dataList'];
        $dataList2=$json['dataList2'];
        foreach($dataList as $key=>$v){

            $_d=array("count"=>$v,"ip"=>$key,'location'=>$dataList2[$key]);
            $arr[]=$_d;
        }
        $this->ajaxReturn(array("size"=>$json['size'],"dataList"=>$arr));
    }



    public function attackUrlTopN(){

        $deviceId=checkDeviceId();
        $json=http_post(C("SOC_PATH")."/host/topN/url",array("deviceId"=>$deviceId),'json');
        $data=array();
        foreach($json['dataList'] as $k=>$v){
            $data[]=array("name"=>$k,"value"=>$v);
        }
        $json['dataList']=$data;
        $this->ajaxReturn($json);
    }
    /**
     * 最近30个点
     */
    public function visitAndAttackCount(){
        $deviceId=checkDeviceId();
        $data=http_post(C("SOC_PATH")."/host/visit/count",array('deviceId'=>$deviceId),'json');
        $attacks=$data['visit_exp'];
        $all=$data['visit_all'];
        $this->ajaxReturn(array("visit"=>$all,"attack"=>$attacks));
    }

    public function todayVisitsAndAttacks(){
        $deviceId=checkDeviceId();
        $data1=http_post(C("SOC_PATH")."/device0/topN/area",array('deviceId'=>$deviceId,"num"=>"all"),'json');
        $data2=http_post(C("SOC_PATH")."/device0/topN/blacklist",array('deviceId'=>$deviceId,"num"=>"all"),'json');
        $this->ajaxReturn(array("visitCount"=>$data1["size"],"attackCount"=>$data2['size']));

    }
    public function flows(){
     //   $deviceId=checkDeviceId();
        $json=http_post(C("SOC_PATH")."/host/network/mins",null,'json');
        $out=$json['bps_out'];
        $in=$json['bps_in'];
        $_out=array();
        $_in=array();
        foreach($out as $d){
            $_out[]=round($d*8/1024/1024,2);
        }
        foreach($in as $d){
            $_in[]=round($d*8/1024/1024,2);
        }
        $this->ajaxReturn(array("in"=>$_in,"out"=>$_out));



    }

    /**
     * 一分钟之内的流量
     */
    public function flowsInOneMin(){
        $json=http_post(C("SOC_PATH")."/host/network/secs",null,'json');
        $out=$json['bps_out'];
        $in=$json['bps_in'];
        $_out=array();
        $_in=array();
        $i=0;
        foreach($out as $d){
            $_out[]=round($d*8/1024/1024,2);
        }
        foreach($in as $d){
            $_in[]=round($d*8/1024/1024,2);
        }
        $this->ajaxReturn(array("in"=>$_in,"out"=>$_out));
    }
    public function visitAndattackReal(){
        $this->ajaxReturn(R("SOCWebInfo/visitAndattackReal"));

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





    public function test(){
        $this->display("./test");

    }
    public function testJson(){
        $nums=array();
        $total=rand(0,17657);
        $data=array("total"=>$total,"items"=>array());
        $provinces=array("浙江","安徽","北京","上海","广西","广东","四川","湖北","湖南","深圳","香港","温州","西藏","青海","内蒙古","山东","江苏","南京","江西","台湾","新疆","黑龙江");
        for($i=0;$i<10;$i++){

            $num=rand(0,count($provinces)-1);
            while(in_array($num,$nums)){
                $num=rand(0,count($provinces)-1);
            }
            $p=$provinces[$num];
            $nums[]=$num;
            $data['items'][]=array("name"=>$p,"value"=>(1000-$i*30));
        }
        $this->ajaxReturn($data);

    }






}