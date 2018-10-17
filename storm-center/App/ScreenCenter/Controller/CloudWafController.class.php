<?php
namespace ScreenCenter\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;


class CloudWafController extends BaseController {



    public function index(){
        $this->display("./cloud-waf");
    }

    public function realTimeDefense(){
        $json=http_post(C("CLOUD_WAF_PATH")."/api/cloudwaf/hosts/count",null,'json');
        $data['domain_num']=$json['other'];

        $json_attack = http_post(C("CLOUD_WAF_PATH")."/api/cloudwaf/defense/count",null,'json');
        $data['day_attack_num'] = $json_attack['data']['today'];
        $data['all_attack_num'] = $json_attack['data']['history'];


        $this->ajaxReturn($data);
    }

    public function attackSource(){
        $json=http_post(C("CLOUD_WAF_PATH")."/api/cloudwaf/visitArea/topN",null,'json');
        $data=array();
        $total = 0;
        foreach($json['data'] as $k=>$v){
            $data[]=array("location"=>$k,"count"=>$v);
            $total += $v;
        }
        $json['dataList'] = $data;
        $json['size'] = $total;
        $this->ajaxReturn($json);
    }

    public function attackType(){
        $json=http_post(C("CLOUD_WAF_PATH")."/api/cloudwaf/attacktype/topN",null,'json');
        // $typeList = $data['other'];
        $data=array();
        foreach($json['data'] as $k=>$v){
            $data[]=array("type"=>$k,"count"=>$v);
        }

        $result['dataList']=$data;
        $this->ajaxReturn($result);
    }

    // ����ԴIP������
    public function attackIPBlackList(){
        $param['point'] = 1440;
        $param['keys'] = 'all';
        $json=http_post(C("CLOUD_WAF_PATH")."/api/cloudwaf/attackip/topN", null,'json');
        $arr=array();
        $arr = $json['items'];
//        $dataList=$json['dataList'];
//        $dataList2=$json['dataList2'];
//        foreach($dataList as $key=>$v){
//
//            $_d=array("count"=>$v,"ip"=>$key,'location'=>$dataList2[$key]);
//            $arr[]=$_d;
//        }
        $this->ajaxReturn(array("size"=>count($arr),"dataList"=>$arr));
    }


}