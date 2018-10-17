<?php
/**
 * Created by PhpStorm.
 * User: ST
 * Date: 2015/7/14
 * Time: 9:43
 */

namespace Self\Controller;
use Home\Controller\BaseController;
use Think\Controller;

class SelfHomeController extends BaseController{
    public function index(){
        $json = http_post(C('STORM_CENTER_PATH')."/getWebReportOfHomeNum",null,"json");
        $this -> assign('not_check_num', $json[data][not_check_num]);
        $this -> assign('check_fail_num', $json[data][check_fail_num]);
        $this -> assign('not_finish_num', $json[data][not_finish_num]);
        $this -> assign('finish_num', $json[data][finish_num]);
        $this->display();
    }

    public function showLineData(){
        $json = http_post(C('STORM_CENTER_PATH')."/getWebReportOfHomeLineData",null,"json");
        $result['code']=1;
        $result['msg']=$json[msg];
        $result['data']=$json[data];
        $this->ajaxReturn($result);
    }


} 