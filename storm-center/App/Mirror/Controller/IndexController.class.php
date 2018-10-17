<?php
/**
 * Created by PhpStorm.
 * User: ah
 * Date: 2015/9/21
 * Time: 14:57
 */

namespace Mirror\Controller;
use Home\Controller\BaseController;
use Think\Controller;

/**
 */
class IndexController extends BaseController {


    public function index(){
        $this->display("index");
    }
    public function summary(){

        $json=http_post(C("MIRROR_PATH")."/api/global/summary/get",null,'json');
        $this->ajaxReturn($json['data']);

    }
    public function deviceList(){
        $json=http_post(C("MIRROR_PATH")."/api/global/device/list",array(),'json');
        $this->ajaxReturn($json['data']);

    }
    public function seq_point(){
        $timeType=I('timeType');
        if($timeType=='hour'){
            $json=http_post(C("MIRROR_PATH")."/api/daily/logcounter/list",array("keys"=>I("keys"),timeNum=>I("timeNum")),'json');
        }else if($timeType=='day'){
            $json=http_post(C("MIRROR_PATH")."/api/merged_daily/logcounter/list",array("keys"=>I("keys"),timeNum=>I("timeNum")),'json');

        }
        $this->ajaxReturn($json);
    }
    public function pellet_point(){
        $timeType=I('timeType');
        if($timeType=='hour'){
            $json=http_post(C("MIRROR_PATH")."/api/daily/logbit/list",array("keys"=>I("keys"),timeNum=>I("timeNum")),'json');
        }else{
            $json=http_post(C("MIRROR_PATH")."/api/merged_daily/logbit/list",array("keys"=>I("keys"),timeNum=>I("timeNum")),'json');
        }
        $this->ajaxReturn($json);
    }
    public function log_category(){
        $timeType=I('timeType');
        if($timeType=='hour'){
            $json=http_post(C("MIRROR_PATH")."/api/daily/logcategory/counter",array("keys"=>I("keys"),timeNum=>I("timeNum")),'json');

        }else{
            $json=http_post(C("MIRROR_PATH")."/api/merged_daily/logcategory/counter",array("keys"=>I("keys"),timeNum=>I("timeNum")),'json');
        }
        $this->ajaxReturn($json);
    }
    public function latest_logs(){
        $json=http_post(C("MIRROR_PATH")."/api/daily/loglatest/list",array("keys"=>I("keys")),'json');
        $this->ajaxReturn($json['data']);
    }




}