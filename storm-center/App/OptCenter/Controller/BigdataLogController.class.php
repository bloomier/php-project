<?php
namespace OptCenter\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;

/**
 * 策略组
 *
 * Class IndexController
 * @package OptCenter\Controller
 */
class BigdataLogController extends BaseController {


    public function index(){
        $data = http_post(C('CLUBINFO_PATH')."/optCenter/clubInfo/getDeviceName", null,'json');
        if($data['code']){
            $deviceName = $data['data'];
            $this->assign("deviceName", $deviceName);
        }
        $this->display('index');
    }


    public function search_result(){
        $result = array("code"=>0,"total"=>0,"rows"=>array());
        $start = (I('currentpage') - 1) * I('limit');
        $param['currentpage'] = I('currentpage');
        $param['start'] = $start;
        $param['limit'] = I('limit');
        if(I('key')){
            $param['key'] = I('key');
        }
        if(I('severityStr')){
            $param['severityStr'] = I('severityStr');
        }
        if(I('deviceId')){
            $param['deviceId'] = I('deviceId');
        }
        if(I('srcAddress')){
            $param['srcAddress'] = I('srcAddress');
        }
        if(I('srcPort')){
            $param['srcPort'] = I('srcPort');
        }
        if(I('destAddress')){
            $param['destAddress'] = I('destAddress');
        }
        if(I('destPort')){
            $param['destPort'] = I('destPort');
        }
        if(I('timeStr')){
            $param['timeStr'] = I('timeStr');
        }

        $data = http_post(C('SOCPLATFORM_PATH')."/search_result", $param,'json');
        $data = json_decode($data, true);
        if($data['code']){
            $result['code'] = 1;
            $result['total'] = $data['total'];
            $result['rows'] = $data['rows'];
        }
        $this->ajaxReturn($result);
    }

    public function detail(){
        $this->assign("rowkey", I("rowkey"));
        $this->display();
    }

    public function search_one(){
        $params = array(
            "rowkey"=>I("rowkey")
        );
        $json = http_post(C('SOCPLATFORM_PATH')."/search_one",$params,"json");
        $this->ajaxReturn($json);
    }

}