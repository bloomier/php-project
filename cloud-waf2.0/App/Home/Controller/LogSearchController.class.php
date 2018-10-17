<?php

namespace Home\Controller;
use Think\Controller;
use Admin\Controller\BaseController;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;

/**
 * 日志查询
 *
 * Class LogSearchController
 * @package Home\Controller
 */
class LogSearchController extends BaseController {


    public function index(){

        $this->display('logSearch');
    }


    public function search_result(){

        $accessParams = I();

        $param = $accessParams[0];//获取前台传递过来的参数
        $result = array("code"=>0,"recordsTotal"=>0,"recordsFiltered"=>0,"draw"=>I('draw'),"data"=>array());
        $start = I('start');
        $param['currentpage'] = I('draw');
        $param['start'] = $start;
        $param['limit'] = I('length') - 1;


        $data = http_post(C('SOC_PLAT_FORM_PATH')."/search_result", $param,'json');
        $data = json_decode($data, true);
        if($data['code']){
            $result['code'] = 1;
            $result['recordsTotal'] = $data['total'];
            $result['recordsFiltered'] = $data['total'];
            $result['data'] = $data['rows'];
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
        $json = http_post(C('SOC_PLAT_FORM_PATH')."/search_one",$params,"json");
        $this->ajaxReturn($json);
    }

}