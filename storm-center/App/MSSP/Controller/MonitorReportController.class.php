<?php
/**
 * Created by PhpStorm.
 * User: ah
 * Date: 2015/7/15
 * Time: 14:35
 */

namespace MSSP\Controller;
use Home\Controller\BaseController;
use Think\Controller;

/**
 * 合同
 * Class ContractController
 * @package MSSP\Controller
 */
class MonitorReportController extends BaseController {


    public function index(){
        $this->generateContent();
        $this->display();
    }


    public function generateContent(){
        $param['domain'] = decodeApiKey(I("url"));
        $param['time'] = I('time');
        $serviceInfo = http_post(C('STORM_CENTER_PATH')."/service/getReportInfo", $param,'json');
        $this->assign("domain", I("domain"));
        $this->assign("time", I("time"));
        $this->assign('value', urlencode(json_encode($serviceInfo['other'])));
        $this->assign("public", APP_TMPL_PATH.'Public');
        $this->assign("param_time_source", I('time'));
        $this->assign("param_url_source", urlencode(I("url")));
    }
}