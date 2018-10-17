<?php
/**
 * Created by PhpStorm.
 * User: jianghaifeng
 * Date: 2016/3/1
 * Time: 14:25
 */

namespace Mobile\Controller;

use Think\Controller;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;

class ReportController extends Controller {

    public function index(){
        $domain=I("domain");
        if(!I('dateKey')){
            $dateKey=date("Y-m-d");
        }else{
            $dateKey=I('dateKey');
        }
        $curDate = date("Y-m-d");
        //$domain = "g20.org";
        //$domain = "www.dbappsecurity.com.cn";
        $param=array(
            keys=>"destHostName_".$domain,
            dateKey=>$dateKey
        );
        $data=http_post(C(Constants::$PATH_API)."/api/report/daily/get",$param,'json');

        $data1=http_post(C('REPORT_PATH'),array(destHostName=>$domain,dateTime=>str_replace("-","",$dateKey)),"json");
        $tempAttackType = json_encode($data1['map']['attackType']);
        $tempAttackType  = str_replace("<","&lt;",$tempAttackType);
        $tempAttackType  = str_replace(">","&gt;",$tempAttackType);
        $tempAttackType = json_decode($tempAttackType);
        $data['data']['attackType'] = $tempAttackType;//$data1['map']['attackType'];

        $attackTopN=http_post(C(Constants::$PATH_API)."/api/topN/attack/ip",$param,'json');
        $data['data']['attackTopN'] = $attackTopN;



        $monitor_data=http_post(C(Constants::$PATH_WARNAPP)."/api/report/daily/get",array("domain"=>$domain,"dateKey"=>$dateKey),'json');

        $this->assign("cloudwaf_data", $data);
        $this->assign("monitor_data",$monitor_data);

        $this->assign("domain",$domain);
        $this->assign("dateKey",$dateKey);
        $this->assign("curDate",$curDate);



        $this->assign('title','查看报告');
        $this->display("report");
    }



    // 云waf数据
    public function cloudwafData(){
//        $data=http_post(C(Constants::$PATH_API)."/api/report/daily/get?keys=destHostName_".I("domain"),null,"json");
//        $this->ajaxReturn($data['data']);

        $data=http_post(C('REPORT_PATH'),array(destHostName=>I("domain"),dateTime=>"20160504"),"json");
        $this->ajaxReturn($data['map']);
    }

    //服务质量数据
    public function monitorData(){
//        echo C(Constants::$PATH_WARNAPP);
        $json=http_post(C(Constants::$PATH_WARNAPP)."/api/report/daily/get",array("domain"=>I('domain'),"dateKey"=>I("dateKey")),'json');
//        $json=http_post(C(Constants::$PATH_WARNAPP)."/api/report/daily/get",array("domain"=>"www.dbappsecurity.com.cn","dateKey"=>"2016-03-24"),'json');
        $this->ajaxReturn($json);
    }
    //漏洞扫描数据
    public function getVulsData(){
        $vuls = new VulsContent();
        $domain = I("domain");
        $result= array();
        $result['websiteInfo'] = $vuls->initWebSiteInfo($domain);
        $vulsInfo = array();
        $vulsInfo['security'] = $vuls->initSecurityInfo($domain);
        $vulsInfo['vuls'] = $vuls->initVulsInfo($domain);
        $vulsInfo['web_rank']= $vuls->initCensusInfo($vulsInfo);
        $vulsInfo['safe_status'] = $vuls->initSafeStateInfo($domain, $result['websiteInfo']['domain_ip']);
        $result['vulsInfo'] = $vulsInfo;
        return $result;

    }

}