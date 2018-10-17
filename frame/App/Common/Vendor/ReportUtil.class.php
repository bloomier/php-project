<?php
/**
 * Created by PhpStorm.
 * User: jianghaifeng
 * Date: 2016/4/12
 * Time: 14:28
 */

namespace Common\Vendor;


use Common\Model\StringModel;

class ReportUtil{

    public $domain;

    /**
     * 返回报告所需内容
     */
    public function initReportContent(){
        $result["info"] = $this->domainInfo();// 获取基础信息
        $result["vuls"] = $this->domainVulsInfo();// 获取漏洞数据
        $cloudApi = new Cloud();
        $result["vid"] = $cloudApi->queryPolicyMapper();// 获取vid信息
        $result["event_type"] = $cloudApi->security_event_mapper();// 获取事件类型

        $list = $this->domainSecInfo();// 获取安全事件;
        if($list){
            $result["event"] = $list;
        }
        return $result;
    }

    /**
     * 获取网站基本信息
     */
    private function domainInfo(){
        $assertDB = new StringModel(Constants::$DB_ASSET);
        $result = $assertDB->where(array(_id=>$this->domain))->find();
        return $result;
    }

    /**
     * 网络漏洞信息
     */
    private function domainVulsInfo(){
        $param = array();
        $param["request_type"] = 2;
        $param["params"] = json_encode(array("domain"=>$this->domain));
        $json = http_post(C("DC_SERVER")."/vuls/info", $param, 'json');
        return $json["map"]["vuls"];
    }

    /**
     * 获取该网站所有安全事件
     */
    private function domainSecInfo(){
        $secDB = new StringModel(Constants::$DB_EVENT);
        $list = $secDB->where(array("domain"=>$this->domain))->order("timestamp desc")->select();
        return $list;
    }

    /**
     * 查询poc信息
     */
    public function queryPoc($rowkey){
        $param = array();
        $param["request_type"] = 3;
        $param["params"] = json_encode(array("rowkey"=>$rowkey));
        $json = http_post(C("DC_SERVER")."/vuls/info", $param, 'json');
        return $json;
    }


}