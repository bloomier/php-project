<?php
namespace Security\Controller;
use Home\Controller\BaseController;
use Think\Controller;

class ESearchController extends BaseController {


    public function index(){
        $this -> assign('event_type_config', C('EVENT_TYPE'));
        $this -> assign('all_provinces_config', C('ALL_PROVINCES'));
        $this -> assign('deal_state_config', C('DEAL_STATE'));

        $params = array(
            "site_domain"=>I("site_domain"),
            "site_name"=>I("site_name"),
            "event_source"=>I("event_source"),
            "begin_time"=>I("begin_time"),
            "end_time"=>I("end_time"),
            "area"=>I("area"),
            "deal_state"=>I("deal_state"),
            "event_type"=>I("event_type")
        );
        $json = http_post(C('STORM_CENTER_PATH')."/queryEventSearch",$params,"json");
        $this -> assign('info', $json[items]);

        $this->display("index");
    }


    public function search(){
        $this -> assign('event_type_config', C('EVENT_TYPE'));
        $this -> assign('all_provinces_config', C('ALL_PROVINCES'));
        $this -> assign('deal_state_config', C('DEAL_STATE'));

        $params = array(
            "site_domain"=>I("site_domain"),
            "site_name"=>I("site_name"),
            "event_source"=>I("event_source"),
            "begin_time"=>I("begin_time"),
            "end_time"=>I("end_time"),
            "area"=>I("area"),
            "oldArea" => I("oldArea"),
            "deal_state"=>I("deal_state"),
            "event_type"=>I("event_type")
        );
        $json = http_post(C('STORM_CENTER_PATH')."/queryEventSearch",$params,"json");
        $result['code']= $json[code];
        $result['msg']= $json[msg];
        $result['data']= $json[items];
        $this->ajaxReturn($result);
        $this->redirect("index");
    }

    public function export(){
        $params = array(
            "site_domain"=>I("site_domain"),
            "site_name"=>I("site_name"),
            "event_source"=>I("event_source"),
            "begin_time"=>I("begin_time"),
            "end_time"=>I("end_time"),
            "area"=>I("area"),
            "deal_state"=>I("deal_state"),
            "event_type"=>I("event_type")
        );
        header("Content-Type:text/html;   charset=utf-8");

        $json = http_post(C('STORM_CENTER_PATH')."/exportEventSearch",$params,"json");
        //下载文件
        $filename=realpath($json[msg]); //文件名
        $date=date("Ymd-H:i:m");
        Header( "Content-type:  application/octet-stream ");
        Header( "Accept-Ranges:  bytes ");
        Header( "Accept-Length: " .filesize($filename));
        header( "Content-Disposition:  attachment;  filename= {$date}.xls");
        // echo file_get_contents($filename);
        readfile($filename);
        $this->success('index');

    }

    public function exportDetail(){
        $params = array(
            "domain"=>I("site_domain"),
            "site_name"=>I("site_name"),
            "event_source"=>I("event_source"),
            "begin_time"=>I("begin_time"),
            "end_time"=>I("end_time"),
            "area"=>I("area"),
            "deal_state"=>I("deal_state"),
            "event_type"=>I("event_type"),
            "report_email"=>I("report_email")
        );
        header("Content-Type:text/html;   charset=utf-8");

        $json = http_post(C('STORM_CENTER_PATH')."/exportDetailEventSearch",$params,"json");
        //下载文件
        $filename=realpath($json[msg]); //文件名
        $date=date("Ymd-H:i:m");
        Header( "Content-type:  application/octet-stream ");
        Header( "Accept-Ranges:  bytes ");
        Header( "Accept-Length: " .filesize($filename));
        header( "Content-Disposition:  attachment;  filename= {$date}.xls");
        // echo file_get_contents($filename);
        readfile($filename);
        $this->success('index');

    }


}