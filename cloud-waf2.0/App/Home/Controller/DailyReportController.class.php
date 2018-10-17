<?php
namespace Home\Controller;
use Admin\Controller\BaseController;
use Common\Vendor\Constants;
use Common\Vendor\Permission;
use Think\Controller;
use Com\VulsContent;
use Common\Vendor\WafConsole;
use Common\Model\StringModel;

/**
 * Class DailyReportController
 * @package Home\Controller
 * 日报的控制器
 */

class DailyReportController extends BaseController {


    private function testTime(){
        $dateKey=date("Y-m-d");
        $domain = "www.dbappsecurity.com.cn";
        echo date("Y-m-d H:i:s")."<br/>";
        http_post(C('REPORT_PATH'),array(destHostName=>$domain,dateTime=>str_replace("-","",$dateKey)),"json");
        echo date("Y-m-d H:i:s")."<br/>";

    }

    public function index(){
        $domain=I("domain");
        $permission=new Permission();
        $ret=$permission->check_domain_user($domain,current_user_id());
        if(!$ret){
               $this->error("对不起,您没有查看该网站的权限");
        }
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

        //此对攻击信息中包含script，做处理，避免页面错误
        $attckWarn = $this->attackWarn($dateKey,$domain);
        $data['data']['attackWarn'] = json_decode($attckWarn);

        $monitor_data=http_post(C(Constants::$PATH_WARNAPP)."/api/report/daily/get",array("domain"=>$domain,"dateKey"=>$dateKey),'json');

        $vuls_data = $this->getVulsData();
        $this->assign("cloudwaf_data", $data);
        $this->assign("monitor_data",$monitor_data);
        $this->assign("vuls_data",$vuls_data);
        $this->assign("domain",$domain);

        // $this->assign("packages",7);
        $this->assign("dateKey",$dateKey);
        $this->assign("curDate",$curDate);
        $this->assign("attackTypeId",C("POLICY_NAMEE"));
        $this->display("./page/daily_report");
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
        //$domain = "www.dbappsecurity.com.cn";
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

    //漏洞扫描数据
    public function vulsData(){
        $vuls = new VulsContent();
        $domain = I("domain");
        //$domain = "www.dbappsecurity.com.cn";
        $result= array();
        $result['websiteInfo'] = $vuls->initWebSiteInfo($domain);
        $vulsInfo = array();
        $vulsInfo['security'] = $vuls->initSecurityInfo($domain);
        $vulsInfo['vuls'] = $vuls->initVulsInfo($domain);
        $vulsInfo['web_rank']= $vuls->initCensusInfo($vulsInfo);
        $vulsInfo['safe_status'] = $vuls->initSafeStateInfo($domain, $result['websiteInfo']['domain_ip']);
        $result['vulsInfo'] = $vulsInfo;
        $this->ajaxReturn($result);
    }

    //服务质量数据
    public function getPolicyData(){
        $result = array();
        $json=http_post(C(Constants::$PATH_API)."/api/cloudwaf/siteVuls/getVulsPolicyMsg",null,'json');
        //$json=http_post("http://localhost:8080/cloudwaf/api/cloudwaf/siteVuls/getVulsPolicyMsg",null,'json');
        if($json['code'] == 1){
            foreach($json['items'] as $k=>$row){
                $result[$row['policy']] = $row['name'];
            }
        }

        $this->ajaxReturn($result);
    }



    /**
     * 导出报告
     */
    public function exportReport(){
        $content = $this->exportContent(I('domain'),I('dateKey'));
        $reportFileName="";
        if(!$reportFileName){
            $reportFileName = I('domain')."(".I('dateKey').").html";//"-report".getSystemMillis()
        }
        $htmlFile=C('TEMPLATE_PATH').$reportFileName;
        file_put_contents($htmlFile,$content);
        if($htmlFile){
            download($htmlFile);
        }else{
            echo '生成报告文件失败';
        }
    }

    /**
     * @param null $url
     * @return mixed
     */
    private function exportContent($domain,$dateKey){
        $permission = new Permission();
        $ret=$permission->check_domain_user($domain,current_user_id());
        if(!$ret){
            $this->error("对不起,您没有导出该网站报告的权限");
        }

        $param=array(
            keys=>"destHostName_".$domain,
            dateKey=>$dateKey
        );
        $data=http_post(C(Constants::$PATH_API)."/api/report/daily/get",$param,'json');
        $attackTopN=http_post(C(Constants::$PATH_API)."/api/topN/attack/ip",$param,'json');
        $data['data']['attackTopN'] = $attackTopN;
        $data['data']['attackWarn'] = $this->attackWarn($dateKey,$domain);
        $data1=http_post(C('REPORT_PATH'),array(destHostName=>$domain,dateTime=>str_replace("-","",$dateKey)),"json");
        $data['data']['attackType'] = $data1['map']['attackType'];
        $monitor_data=http_post(C(Constants::$PATH_WARNAPP)."/api/report/daily/get",array("domain"=>$domain,"dateKey"=>$dateKey),'json');
        $vuls_data = $this->getVulsData();
        $this->assign("cloudwaf_data",$data);
        $this->assign("monitor_data",$monitor_data);
        $this->assign("vuls_data",$vuls_data);
        $this->assign("domain",$domain);
        $this->assign("dateKey",$dateKey);
        $this->assign("attackTypeId",C("POLICY_NAMEE"));

        //$this->display("./page/daily_report");

        $content = $this->fetch("./page/daily_report");
        //$content = str_replace(__ROOT__, "http://admin.dbappwaf.cn", $content);
        $content = str_replace(__ROOT__."/Public", "http://admin.dbappwaf.cn/Public", $content);
        $content = str_replace("report-detail.js", "report-detail-for-export.js", $content);

        // $content = str_replace(__ROOT__."/Public", "http://admin.dbappwaf.cn/Public", $content);
        $content = str_replace("http://admin.dbappwaf.cn/Public/asset/css/font-awesome.min.css", "http://cdn.bootcss.com/font-awesome/4.3.0/css/font-awesome.css", $content);
        return $content;
    }

    //安全服务页面专家服务 字符串转义
    private function attackWarn($dateKey,$destHostName){
        $md = new StringModel(Constants::$DB_CC_ATTACK);
        $condition['dateKey'] = $dateKey;
        $condition['destHostName'] = $destHostName;
        $rows = $md->where($condition)->order('timestamp desc')->select();
        $items = array();
        if($rows){
            foreach($rows as $k=>$row){
                $items[] = $row;
            }
        }
        //此对攻击信息中包含script，做处理，避免页面错误
        $items = json_encode($items);
        //$items  = str_replace("script","'script'",$items);
        $items  = str_replace("<","&lt;",$items);
        $items  = str_replace(">","&gt;",$items);

        return  $items;
    }



}