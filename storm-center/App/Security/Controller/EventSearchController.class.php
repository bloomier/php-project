<?php
/**
 * Created by PhpStorm.
 * User: ST
 * Date: 2015/11/16
 * Time: 16:26
 */

namespace Security\Controller;
use Home\Controller\BaseController;
use Think\Controller;


class EventSearchController extends BaseController {


    public function index(){
        $this -> assign('event_type_config', C('EVENT_TYPE'));
        $arr = C('EVENT_TYPE');
        foreach ($arr as $k=>$v){
            if($v==""){ // 去掉"请选择"选项
                unset($arr[$k]);
            }
        }
        $this -> assign('table_head', $arr);
        $this -> assign('deal_state_config', C('DEAL_STATE'));
        $this->display();
    }

    // 查询通报记录列表
    public function queryReportRecordList(){
        $params = array(
            "event_type_config"=>json_encode(C('EVENT_TYPE')),
            "site_domain"=>I("site_domain"),
            "site_name"=>I("site_name"),
            "event_source"=>I("event_source"),
            "begin_time"=>I("begin_time"),
            "end_time"=>I("end_time"),
            "area"=>I("area"),
            "deal_state"=>I("deal_state"),
            "event_type"=>I("event_type")
        );
        //header("Content-Type:text/html;charset=utf-8");
        $json = http_post(C('STORM_CENTER_PATH')."/security/queryReportRecordList",$params,"json");
        //dump($json[data]);
        //die();
        $this->ajaxReturn($json);
        // $this -> assign('info', $json[data]);
        // $this->display();
    }


    public function queryDetailList(){
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        $params = array(
            'limit' => I('limit'),
            'start' => (I('currentpage') - 1) * I('limit'),
            "site_domain"=>I("site_domain"),
            "site_name"=>I("site_name"),
            "event_source"=>I("event_source"),
            "begin_time"=>I("begin_time"),
            "end_time"=>I("end_time"),
            "area"=>I("area"),
            "deal_state"=>I("deal_state"),
            "event_type"=>I("event_type")
        );
        $json = http_post(C('STORM_CENTER_PATH')."/security/queryDetailList",$params,"json");
        if($json){
            $result['code']=1;
            $result['rows']=$json["items"];
            $result['total']=$json["total"];
        }
        $this->ajaxReturn($result);

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

        $json = http_post(C('STORM_CENTER_PATH')."/security/exportEvent",$params,"json");
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
//        echo json_encode($params);
//        die();
        $json = http_post(C('STORM_CENTER_PATH')."/security/exportEventDetail",$params,"json");
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