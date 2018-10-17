<?php
namespace ScreenCenter\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;


class DeviceSurveyController extends BaseController {



    public function index(){
        $this->assign("key",I("key"));
        $this->display("./device-survey");

    }

    public function getRunningTime(){

        $json = http_post(C("CLOUD_WAF_PATH")."/api/running/seconds/get", array("key"=>I("key")), 'json');
        $this->ajaxReturn($json);
    }
    public function defense(){
        $json=http_post(C('CLOUD_WAF_PATH')."/api/lasest/total/counter",array("keys"=>I("keys")),'json');
        $this->ajaxReturn($json);
    }

    public function health(){
        $json = http_post(C("ZBBIX_PATH").'/host-info/host/hostsort', array(), 'json');

        $this->ajaxReturn($json);

    }
//    public function defend(){


//        $json = http_post('http://172.16.2.90:9090/bdsp-web/device0/topN/area?deviceId=1046&&num=10', array(), 'json');
//
//        $this->ajaxReturn($json);
//
//    }

    public function getDeviceLogNum(){
        $json=http_post(C('CLOUD_WAF_PATH')."/api/lastest/devicelognum/list",array("keys"=>I("keys")),'json');
        $this->ajaxReturn($json);
    }

    public function getWarningMsg(){
        $data=http_post(C("CLOUD_WAF_PATH")."/api/lasest/item/list",array("keys"=>I("keys"),"point"=>30),'json');
        // $json['data']['items']=$data['data']['attack'];
        $this->ajaxReturn($data['data']['attack']);
    }

    public function getLastestTenLogs(){
        $json=http_post(C("CLOUD_WAF_PATH")."/api/lasest/lasest10Log/map",array("keys"=>I("keys")),'json');
        $this->ajaxReturn($json);
    }

}