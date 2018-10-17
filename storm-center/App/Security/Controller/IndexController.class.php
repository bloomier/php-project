<?php
namespace Security\Controller;
use Home\Controller\BaseController;
use Think\Controller;

class IndexController extends BaseController {


    public function index(){
        $json = http_post(C('STORM_CENTER_PATH')."/getEventOfHomeNum",null,"json");
        $this -> assign('not_check_num', $json[data][not_check_num]);
        $this -> assign('not_bulletin_num', $json[data][not_bulletin_num]);
        $this -> assign('not_repair_num', $json[data][not_repair_num]);
        $this -> assign('current_month_num', $json[data][current_month_num]);
        $this -> assign('current_month_report_num', $json[data][current_month_report_num]);
        $this->display();
    }




    public function getEventOfHomeValue(){
        $json = http_post(C('STORM_CENTER_PATH')."/getEventOfHomeValue",null,"json");

        $result['code']=1;
        $result['msg']=$json[msg];
        $result['data']=$json[data];
        $this->ajaxReturn($result);
    }

    //获取一周趋势
    public function getOneWeekTrend(){
        $param = array();
        $param['province'] = I('province');
        $json = http_post(C('STORM_CENTER_PATH')."/security/getOneWeekTrend",$param,"json");

        $result['code']=1;
        $result['msg']=$json[msg];
        $result['data']=$json[data];
        $this->ajaxReturn($result);
    }


    public function index_back(){
        $json = http_post(C('STORM_CENTER_PATH')."/getEventOfHomeNum",null,"json");
        $this -> assign('not_check_num', $json[data][not_check_num]);
        $this -> assign('not_bulletin_num', $json[data][not_bulletin_num]);
        $this -> assign('not_repair_num', $json[data][not_repair_num]);
        $this -> assign('current_month_num', $json[data][current_month_num]);
        $this->display();
    }
}