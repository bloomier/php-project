<?php
/**
 * Created by PhpStorm.
 * User: ah
 * Date: 2015/7/15
 * Time: 14:35
 */

namespace Service\Controller;
use Home\Controller\BaseController;
use Think\Controller;

class ReportController extends Controller {


    public function index(){
        $param['domain'] = I('domain');
        $param['time'] = I('time');
        $serviceInfo = http_post(C('STORM_CENTER_PATH')."/service/getReportInfo", $param,'json');
        $this->assign("domain", I("domain"));
        $this->assign("time", I("time"));
        $this->assign('value', urlencode(json_encode($serviceInfo['other'])));
        $this->assign("public", APP_TMPL_PATH.'Public');
        $this->display("index");
    }
    public function generateDailyReport(){
        // 获取原始数据
        if(!I('domain')||!I('time')){
            $this->ajaxReturn(array("code"=>0,"msg"=>"params error"));
        }
        $param['domain'] = I('domain');
        $param['time'] = I('time');
        $serviceInfo = http_post(C('STORM_CENTER_PATH')."/service/getReportInfo", $param,'json');
        $this->assign("domain", I("domain"));
        $this->assign("time", I("time"));
        $this->assign('value', urlencode(json_encode($serviceInfo['other'])));
        // 生成报告

        $content = $this->fetch("Service@Report/index");

        $content = str_replace(__ROOT__."/Public", "http://api.websaas.cn/Public", $content);
        $content = str_replace("http://www.websaas.cn/Public/css/font-awesome.min.css", "http://cdn.bootcss.com/font-awesome/4.3.0/css/font-awesome.css", $content);
//

        return $content;
    }


    public function exportReport(){
        $content=$this->generateDailyReport();

        $reportFileName=I('reportFileName');
        if(!$reportFileName){
            $reportFileName=getSystemMillis()."servicereport.html";
        }
        $htmlFile=C('TEMPLATE_PATH').$reportFileName;
        file_put_contents($htmlFile,$content);

        if($htmlFile){
            download($htmlFile);
        }else{
            echo '生成报告文件失败';
        }

    }


}