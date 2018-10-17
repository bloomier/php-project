<?php


namespace MSSP\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Com\VulsContent;

/**
 * 我的站点
 * Class ContractController
 * @package MSSPSelf\Controller
 */
class ReportController extends ReportBaseController {

    public function index(){
        if(I("xKey")||I("xToken")||I("reqData")){//通过外部链接进入
            $data=$this->getDataByRsa_decrypt(I("reqData"));
            if(!$data){
                $this->error("对不起,无法正确解析请求");
            }
            $data=json_decode($data,true);
            $domain=$data['domain'];
            $packages=$data['packages'];
            $dateKey=$data['dateKey'];
            $this->assign("outLink",1);
        }else{
            $domain=I("domain");
            $packages = I('packages');
            $dateKey=date("Y-m-d");

            $user=session("user");
            $userid=$user['id'];
            if($user['role_id'] != 1){
                $checkResult = $this->checkUserDomainPermission($userid,$domain);
                if(!$checkResult['code']){
                    $this->error("对不起,您没有权限查看该网站的报告");
                }
            }
        }

        $this->assign("domain",$domain);
        $this->assign("packages",$packages);
        $this->assign("dateKey",$dateKey);
        $this->display("index");
    }

    public function initDomainPackages(){
        $user=session("user");
        $userid=$user['id'];
        $domain=I("domain");
        $result = $this->checkUserDomainPermission($userid, $domain);
        $this->ajaxReturn($result);
    }

    private function checkUserDomainPermission($uid,$domain){
        $result = array("code"=>0, "packages"=>0);
        if(!$uid||!$domain){
            return false;
        }
        $param = array();
        if($uid != 1){
            $param['userId'] = $uid;
        }else{
            $param['userId'] = 0;
        }
        $param['param'] = "";
        $param['start'] = 0;
        $param['limit'] = 0;
        $param['domain'] = $domain;
        $json = http_post(C('STORM_CENTER_PATH')."/mssp/msspContract/queryUserSite", $param,'json');
        if($json['code']){
            for($i = 0; $i < count($json['items']); $i++){
                $tmp = $json['items'][$i];
                if($tmp['domain'] == $domain){
                    $result['code'] = 1;
                    break;
                }
            }
        }
        return $result;
    }

    public function monitorData(){
        $json=http_post(C("WARN_FILTER_PATH")."/api/report/daily/get",array("domain"=>I('domain'),"dateKey"=>I("dateKey")),'json');
        $this->ajaxReturn($json);
    }
    public function cloudwafData(){

//        $data=http_post("http://172.16.7.100:9090/dataplatform/normal",array(destHostName=>I("domain"),dateTime=>"20160324"),"json");
//        $this->ajaxReturn($data['map']);
//        $data1 = http_post("http://172.16.7.100:9090/dataplatform/log?destHostName=".I("domain")."&&dateTime=".I("dateKey"),array(), "json");
//        $json=$data['map'];
//        $json['dailyPoint']=$data1['map']['dailyPoint'];
//        $this->ajaxReturn($json);


//        $data=http_post("http://172.16.7.100:9090/dataplatform/normal",array(destHostName=>"www.pentest.net.cn",dateTime=>date("Ymd")),"json");
//        $data1 = http_post("http://172.16.7.100:9090/dataplatform/log?destHostName=www.pentest.net.cn&&dateTime=".date("Ymd"),array(), "json");
//
//

//         $map1=http_post('http://172.16.2.41:8089/cloudwaf/api/lasest/visit_attack/countlist?point=1440&keys=destHostName_g20.org',null,'json');
//         $map2=http_post('http://172.16.2.41:8089/cloudwaf/api/lasest/flow/countlist?point=1440&keys=destHostName_g20.org',null,'json');
//        $dailyPoint=array();

        $data=http_post(C('CLOUD_WAF_PATH')."/api/report/daily/get?keys=destHostName_".I("domain"),null,"json");
        $this->ajaxReturn($data['data']);

//        $file='Public/source/textWafData';
//        $content=file_get_contents($file);
//        $json=json_decode($content,true);
//        $map1=http_post('http://172.16.2.41:8089/cloudwaf/api/lasest/visit_attack/countlist?point=1440&keys=deviceId_160030,deviceId_160033,deviceId_160036,deviceId_160039',null,'json');
//        $map2=http_post('http://172.16.2.41:8089/cloudwaf/api/lasest/flow/countlist?point=1440&keys=deviceId_160030,deviceId_160033,deviceId_160036,deviceId_160039',null,'json');
//        $dailyPoint=array();
//        $dailyPoint['visit']=$map1['data']['visit'];
//        $dailyPoint['attack']=$map1['data']['attack'];
//        $dailyPoint['flow']=$map2['data']['flow'];
//        $json['dailyPoint']=$dailyPoint;
//        $this->ajaxReturn($json);
    }
    // 过滤掉失效、逾期、不含服务质量的域名
    public function allSite(){
        $user=session("user");
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        $param = array();
        if($user['id'] != 1){
            $param['userId'] = $user['id'];
        }else{
            $param['userId'] = 0;
        }
        $param['param'] = "";
        $param['start'] = 0;
        $param['limit'] = 0;
        $json = http_post(C('STORM_CENTER_PATH')."/mssp/msspContract/queryUserSite", $param,'json');
        if($json['code']){
            $result['code']=1;
            $result['total'] = $json['total'];
            $result['rows'] = $json['items'];
        }
        $this->ajaxReturn($result);
    }

    private function compareTime($endTime){
        $nowTime = date("y-m-d h:i:s");
        if(strtotime($nowTime) < strtotime($endTime)){
            return true;
        }
        return false;
    }

    public function testPermission(){
        echo http_post("http://172.16.7.100:9090/dataplatform/normal",array(destHostName=>"W3SVC2",dateTime=>"20160115"),"text");
    }

    public function vulsData(){
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
        $this->ajaxReturn($result);
    }
}