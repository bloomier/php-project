<?php
/**
 * Created by PhpStorm.
 * User: jianghaifeng
 * Date: 2016/3/1
 * Time: 14:25
 */

namespace Home\Controller;
use Org\Util\String;
use Think\Controller;
use Admin\Controller\BaseController;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;
use Common\Vendor\WafConsole;

class VulsAndValidateController extends BaseController {

    /** */
    public function index(){
        $this->getDomainTitol();
        $this->getServerNote();
        $this->display("vulsAndValidate");
    }
    public function getSiteTitleMsg(){
        $data=http_post(C(Constants::$PATH_API)."/api/cloudwaf/siteVuls/getSiteVulsMsg",null,'json');
        $result = array();
        //return $data['items'];
        foreach($data['items'] as $k=>$value){
            $result[$value['_id']] = $value['title'];
        }
//        dump($result);
        return $result;
    }

    /** 获取域名站点名对照表 */
    public function getDomainTitol(){
        $uid = current_user_id();
        $siteTitle   = $this->getSiteTitleMsg();
        $domains = $this->getAllSitesStr($uid);
        $domainArr = explode(",",trim($domains));
        $md = new StringModel(Constants::$DB_ASSET);
        $condition['_id'] = array("in",$domainArr);
        $rows = $md->field("title")->where($condition)->select();
        foreach($rows as $value){
            $result[$value['_id']]=$value['title']==""&&$siteTitle[$value['_id']]?$siteTitle[$value['_id']]:$value['title'];
        }
        $this->assign("domainTitle",$result);
//        return $result;

    }

    /** 服务解析对照表 */
    public function getServerNote(){
        $data = http_post(C(Constants::$PATH_SITE_POINT)."/api/getServiceExplain",null,'json');
        foreach($data['rows'] as $value){
            $result[$value['service']]=$value['explain'];
        }
//        dump($result);
        $this->assign("serviceNote",$result);
    }


    /** 根据分页来获取服务质量下降的站点
     *  domains站点列表用逗号隔开
     *  limit限定多少条
     *  start其实值（从0开始）
     *  api/cloudwaf/domian/lasestError?domains=all&limit=10&start=0
     */
    public function getAllSiteValidate(){
        $currentPage = 0;
        if(I('currentPage')){
            $currentPage = intval(I('currentPage') * 12);
        }

        $uid = current_user_id();
        $domains = $this->getAllSitesStr($uid);
        //$domainsArr = explode(",",$domains);
        $param = array(domains=>$domains,limit=>12,start=>$currentPage);
        $data=http_post(C(Constants::$PATH_WARNAPP)."/api/cloudwaf/domian/lasestError",$param,'json');

        $province = $data['other'];
        $result = array();
        $temp = $data['items'];
        foreach($temp as $k=>$v){
            $oneSite = array();
            foreach($v['data'] as $kOne=>$vOne){
                $oneSiteKey = $province[$kOne] ? $province[$kOne] : $kOne;
                if($vOne['value']>= 200 && $vOne['value'] < 400){
                    $oneSite[$oneSiteKey] = $vOne['other']['nslookup_time'] + $vOne['other']['connect_time'];
                } else {
                    $oneSite[$oneSiteKey] = -1;
                }
            }
            $result[$v['domain']] = $oneSite;
        }
        $total = ceil($data['total'] / 12);
        $json = array('data'=>$result,'total'=>$total);
//        dump($result);
        $this->ajaxReturn($json);


    }

    /** 获取服务质量下降站点对应地图可用性数据 */
    public function getDownloadSite(){
        $uid = current_user_id();
        $domains = $this->getAllSitesStr($uid);
        $domainsArr = explode(",",$domains);
        $topN=count($domainsArr);
        $param = array(domains=>$domains,topN=>$topN);
//        header("Content-type: text/html; charset=utf-8");
        $data=http_post(C(Constants::$PATH_WARNAPP)."/api/cloudwaf/domian/worstN",$param,'json');
        $province = $data['other'];
        $result = array();
        $temp = $data['items'];
        foreach($temp as $k=>$v){
            $oneSite = array();
            foreach($v['data'] as $kOne=>$vOne){
                $oneSiteKey = $province[$kOne] ? $province[$kOne] : $kOne;
                if($vOne['value']>= 200 && $vOne['value'] < 400){
                    $oneSite[$oneSiteKey] = $vOne['other']['nslookup_time'] + $vOne['other']['connect_time'];
                } else {
                    $oneSite[$oneSiteKey] = -1;
                }
            }
            $result[$v['domain']] = $oneSite;
        }
//        dump($result);
        $this->ajaxReturn($result);
    }

    /** 获取持续故障站点地图数据 */
    public function getAllSiteFault(){
        $uid = current_user_id();
        $domains = $this->getAllSitesStr($uid);
        $domainsArr = explode(",",$domains);
        $topN=count($domainsArr);
        $param = array(domains=>$domains,topN=>$topN);
        $data = http_post(C(Constants::$PATH_WARNAPP)."/api/cloudwaf/todayError/accessinfo",$param,'json');
//        header("Content-type: text/html; charset=utf-8");
        $province = $data['other'];
        $temp = $data['items'];
        foreach($temp as $value){
           foreach($value['data'] as $k=>$vOne){
               $oneSiteKey = $province[$k]?$province[$k]:$k;
               if($vOne['value']>= 200 && $vOne['value'] < 400){
                   $oneSite[$oneSiteKey] = $vOne['other']['nslookup_time'] + $vOne['other']['connect_time'];
               } else {
                   $oneSite[$oneSiteKey] = -1;
               }
           }
            $result[$value['domain']] = $oneSite;
        }
//        dump($result);
        $this->ajaxReturn($result);
    }

    /** 获取重要站点地图数据 */
    public function getImportanSite(){
        $uid = current_user_id();
        $domains = $this->getAllSitesStr($uid);
        $param = array(domains=>I("domain"));
        $data = http_post(C(Constants::$PATH_WARNAPP)."/api/cloudwaf/accessinfos/list",$param,'json');
        $province = $data['other']['nodes'];
        header("Content-type: text/html; charset=utf-8");
        foreach($data['data'] as $key=>$value){
            foreach($value as $k=>$vOne){
                $oneSiteKey = $province[$k]?$province[$k]:$k;
                if($vOne['value']>= 200 && $vOne['value'] < 400){
                    $oneSite[$oneSiteKey] = $vOne['other']['nslookup_time'] + $vOne['other']['connect_time'];
                } else {
                    $oneSite[$oneSiteKey] = -1;
                }
            }
            $result[$key] = $oneSite;
        }
//        dump($result);
        $this->ajaxReturn($result);

    }


    /** 获取当前用户的所有站点用逗号隔开的字符串 */
    public function getAllSitesStr($uid){
        $user=session("user");
        if($user['isSystemRole']){
            $mdasset = new StringModel(Constants::$DB_ASSET);
            $rows=$mdasset->field("_id")->select();
            $domains=array();
            foreach($rows as $domain){
                $domains[]=$domain['_id'];
            }
            $str=implode(",",$domains);
            return $str;
        }else{
            $md = new AutoIncrementModel(Constants::$DB_USER_2_ASSET);
            $condition = array();
            $condition['uid'] = $uid;
            $rows=$md->field('domain')->where($condition)->select();
            $domains=array();
            foreach($rows as $k=>$row){
                $domains[] = $row['domain'];
            }
            $str = implode(",",$domains);
//        dump($str);
            return $str;
        }
    }
    /** 获取服务质量下降站点列表 */
    public function getDomainServiceDown(){
        $uid = current_user_id();
        $userDomains = $this->getAllSitesStr($uid);
        $param['domains'] = $userDomains;
        $domainsServiceList=http_post(C(Constants::$PATH_WARNAPP)."/api/cloudwaf/nowError/list",$param,'json');

        $this->ajaxReturn($domainsServiceList);
    }

    /** 当日故障站点断网清单  */
    public function getSiteFaultList(){
        $uid = current_user_id();
        $userDomains = $this->getAllSitesStr($uid);
        $param['domains']=$userDomains;
        $domainsServiceList=http_post(C(Constants::$PATH_WARNAPP)."/api/cloudwaf/todayWarning/list",$param,'json');

//        dump($domainsServiceList);
        $this->ajaxReturn($domainsServiceList);

    }

    /** 获取高中风险站点列表 */
    public function getVulsMsg(){
        $uid = current_user_id();
        $userDomains=$this->getAllSitesStr($uid);
        $domainArr = explode(",",$userDomains);
        $vulsMsg=http_post(C(Constants::$PATH_API)."/api/cloudwaf/siteVuls/getVulsMsg",null,'json');
        foreach($vulsMsg['items'] as $value){
            $vulsMsgArr[$value['_id']]=$value;
        }
        foreach($domainArr as $value){
            if($vulsMsgArr[$value]){
                $result[]=$vulsMsgArr[$value];
            }
        }
//        dump($result);
        $this->ajaxReturn($result);


    }

    /** 获取站点故障统计列表 */
    public function getSiteFault(){
        $uid = current_user_id();
        $userDomains = $this->getAllSitesStr($uid);
        $param['domains'] = $userDomains;
        $siteFault = http_post(C(Constants::$PATH_WARNAPP)."/api/cloudwaf/todayWarning/statistics",$param,'json');
        foreach($siteFault['data'] as $k=>$v){
           $v['domain']=$k;
            $oneSite['data']=$v;
            $oneSite['count']=$v['count'];
            $result[]=$oneSite;
        }
        $siteFault['data']=$result;
        $this->ajaxReturn($siteFault);
    }

    /** 获取当前用户保留的重点关注站点信息 */
    public function userMainSites(){
        $uid = current_user_id();
        $md = new StringModel(Constants::$DB_MAIN_ASSET_OF_USER);
        $condition["_id"] = $uid;
        $rows = $md->where($condition)->select();

        $this->ajaxReturn($rows[$uid]);

    }

    /** 用户重点站点add or update */
    public function addOrUpdateSites(){
        $uid = current_user_id();

        $param['_id'] = $uid;
        $param['domains'] = I("domains");

        $md = new StringModel(Constants::$DB_MAIN_ASSET_OF_USER);
        $condition["_id"] = $uid;
        $rows = $md->where($condition)->select();
        if(!$rows){
            $ret=array("code"=>1,"msg"=>"添加成功");
            $row=$md->add($param);
            if(!$row){
                $ret['code']=0;
                $ret['msg']="添加失败";
            }
            $this->ajaxReturn($ret);
        }else{
            $ret=array("code"=>1,"msg"=>"修改成功");
            $row=$md->save($param);
            if(!$row){
                $ret['code']=0;
                $ret['msg']="修改失败";
            }

            $this->ajaxReturn($ret);
        }

    }
    //获取端口信息
    public function getRiskPort(){
        $uid = current_user_id();
        $domains = $this->getAllSitesStr($uid);
        $domainArr = explode(",",$domains);
        $md = new StringModel(Constants::$DB_ASSET);
        $IPs = array();
        $iparr=array();
        foreach($domainArr as $domain){
            $condition["_id"] = trim($domain);
            $asset = $md->field("ip")->where($condition)->select();
            $IPs[trim($domain)] = $asset[trim($domain)]['ip'];
            $iparr[] = $asset[trim($domain)]['ip'];
        }
        $ipstr = implode(",",$iparr);
        $param['ips'] = $ipstr;
        $rows = http_post(C(Constants::$PATH_SITE_POINT)."/api/getServicePort",$param,'json');
        if($rows['code']){
            foreach($rows['rows'] as $row){
                $portMsg[$row['ip']][] = $row['port'];
//                $portServer[$row['ip']][$row['port']]=$row['service'];
                $portServer[$row['ip']][]=$row['port'].":".$row['service'];
            }
            $result['portMsg'] = $portMsg;
            $result['ipPort'] = $IPs;
            $result['portServer']=$portServer;
        }
//        dump($rows);
        $this->ajaxReturn($result);


    }
    //获取指纹信息
    public function getFingerprint(){
        $uid = current_user_id();
        $domains = $this->getAllSitesStr($uid);
        $param["domains"] = $domains;
        $rows = http_post(C(Constants::$PATH_SITE_POINT)."/api/getFingerPrint",$param,'json');

//        dump($domains);
        $this->ajaxReturn($rows);

    }


    public function showAction(){
        $result = check_action("home/wafsite/add");
        dump($result);
        //dump(in_array("home/wafsite/delete", $user['actions']));
    }


}