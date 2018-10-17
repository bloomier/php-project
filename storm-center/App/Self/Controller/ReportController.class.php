<?php
namespace Self\Controller;
use Home\Controller\BaseController;
use Think\Controller;

class ReportController extends BaseController {


    public function index(){
        $this->display();
    }


    /**
     * 查看报告
     */
    public function show(){
        R('Home/Report/getDomainShowReportContent');
        $this->display("domain-report");
    }


}