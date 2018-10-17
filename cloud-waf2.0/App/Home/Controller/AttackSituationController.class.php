<?php
/**
 * Created by PhpStorm.
 * User: jianghaifeng
 * Date: 2016/3/1
 * Time: 14:25
 */

namespace Home\Controller;
use Think\Controller;
use Admin\Controller\BaseController;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;

class AttackSituationController extends BaseController {

    /** */
    public function index(){
        $this->display("attackSituation");
    }

    /** 获取cc信息 */
    public function getCc(){
        $md = new StringModel(Constants::$DB_CC_ATTACK);
        //dump($md->getCollection()->getName());
        $domains = $this->getAllSitesArr();
        if(!I('dateKey')){
            $dateKey=date("Y-m-d");
        }else{
            $dateKey=I('dateKey');
        }
        $where = array();
        $where["destHostName"]=array("in",$domains);
        $where["dateKey"] = $dateKey;
        $rows = $md->where($where)->order('timestamp desc')->select();
        $items = array();
        if($rows){
            foreach($rows as $k=>$row){
                $items[] = $row;
            }
        }
        $this->ajaxReturn(array(code=>1,items=>$items));
    }

    /** 获取防御能力信息 */
    public function getDefense(){
        $md = new StringModel(Constants::$DB_DEFENSE_ATTACK);
        $domains = $this->getAllSitesArr();
        //dump($domains);
        if(!I('dateKey')){
            $dateKey=date("Y-m-d");
        }else{
            $dateKey=I('dateKey');
        }
        $where=array();
        $where["hostName"] = array("in",$domains);
        $where['dateKey']  = $dateKey;
        //$where['_logic']   = 'and';

        $rows = $md->where($where)->order('timestamp desc')->select();
        $items = array();
        $i = 0;
        if($rows){
            foreach($rows as $k=>$row){
                $items[] = $row;
                $i++;
                if($i==10){
                    break;
                }
            }
        }
        $this->ajaxReturn(array(code=>1,items=>$items,allCount=>count($rows)));
    }

    /**
     * 获取策略信息
     * 这个接口将被弃用
     */
    public function getPolicy(){
        $param = array();
        $param['domains'] = $this->getAllSitesStr("");
        $items = array();
        $json=http_post(C('IP_TOPN_PATH')."/report/policy", $param, 'json');
        if($json['code'] == 0){
            foreach($json['policy'] as $k=>$row){
                $one = array();
                $one['policyId'] = $row['policyId'];
                $one['name'] = $row['policyName'];
                $one['ipCounter'] = $row['ipCount'];
                $one['siteCounter'] = $row['hostNameCount'];
                $one['allCounter'] = $row['count'];
                $items[] = $one;
            }
        }
        $this->ajaxReturn(array(code=>1,items=>$items,allCount=>$json['count']));

//        $policyName = c('POLICY_NAMEE');
//        $md = new StringModel(Constants::$DB_POLICY_ATTACK);
//        if(!I('dateKey')){
//            $dateKey=date("Y-m-d");
//        }else{
//            $dateKey=I('dateKey');
//        }
//        $rows = $md->where(array(dateKey=>$dateKey))->order('timestamp desc')->select();
//        $items = array();
//        $result = array();
//        //$i = 0;
//        if($rows){
//            foreach($rows as $k=>$row){
//                //合并相同policyId的数据
//                if(!array_key_exists($row['policyId'], $result)){
//                    $tempPolicyId = $this->getFourPolicyId($row['policyId']);
//                    //$tempPolicyId = 1202;
//                    $row['name'] = $policyName[$tempPolicyId];
//                    $result[$row['policyId']] = $row;
//                } else {
//                    //$result[$row['policyId']]['name'] += $policyName;
//                    $result[$row['policyId']]['ipCounter'] += $row['ipCounter'];
//                    $result[$row['policyId']]['siteCounter'] += $row['siteCounter'];
//                    $result[$row['policyId']]['allCounter'] += $row['allCounter'];
//                }
//            }
//            foreach($result as $k=>$row){
//                $items[] = $row;
//            }
//        }

//        $this->ajaxReturn(array(code=>1,items=>$items,allCount=>count($result)));
    }

    /** 获取策略id的前四位 */
    private function getFourPolicyId($policyId){
        return substr($policyId,0,4);
    }

    public function getVisitAndAttackTopN(){
        $param = array();
        $param['num'] = 10;
        //echo $this->getAllSitesStr("");
        $param['domains'] = $this->getAllSitesStr("");
        $json=http_post(C('IP_TOPN_PATH')."/report/stat" ,$param,'json');
        $this->ajaxReturn($json);
    }



    //站点访问量排行  keys=destHostName_domain,destHostName_domain
    public function visitCountRank(){
        $titles = $this->getSitesTitle();
        $param = array();
        $param['keys'] = $this->getAllSitesStr("destHostName_");
        $param['point'] = 10;
        $json=http_post(C(Constants::$PATH_API)."/api/cloudwaf/domainvisit/list", $param, 'json');
        $lasest=array();
        $all=array();
        $allCount = 0;
        $lasestCount = 0;
        foreach($json['data']['all'] as $k=>$v){
            $name = $titles[$k] ? $titles[$k] : $k;
            $all[]=array(name=>$name."_".$k,value=>$v);
            $allCount += $v;
        }
        foreach($json['data']['lasest'] as $k=>$v){
            $name = $titles[$k] ? $titles[$k] : $k;
            $lasest[]=array(name=>$name."_".$k,value=>$v);
            $lasestCount += $v;
        }
        $this->ajaxReturn(array("all"=>$all,"lasest"=>$lasest,"allCount"=>$allCount,"lasestCount"=>$lasestCount));
    }

    //站点攻击量排行 keys=destHostName_domain,destHostName_domain
    public function attackCountRank(){
        $titles = $this->getSitesTitle();
        $param = array();
        $param['keys'] = $this->getAllSitesStr("destHostName_");
        $param['point'] = 10;
        $json=http_post(C(Constants::$PATH_API)."/api/cloudwaf/domainattack/list", $param, 'json');
        $lasest=array();
        $all=array();
        $allCount = 0;
        $lasestCount = 0;
        foreach($json['data']['all'] as $k=>$v){
            $name = $titles[$k] ? $titles[$k] : $k;
            $all[]=array(name=>$name."_".$k,value=>$v);
            $allCount += $v;
        }
        foreach($json['data']['lasest'] as $k=>$v){
            $name = $titles[$k] ? $titles[$k] : $k;
            $lasest[]=array(name=>$name."_".$k,value=>$v);
            $lasestCount += $v;
        }
        $this->ajaxReturn(array("all"=>$all,"lasest"=>$lasest,"allCount"=>$allCount,"lasestCount"=>$lasestCount));
    }

    private function getSitesTitle(){
        $uid=current_user_id();
        $md=new StringModel(Constants::$DB_ASSET);
        $rows=$md->field('_id,title')->select();
        $sites=array();
        foreach($rows as $k=>$row){
            $sites[$row['_id']] = $row['title'];
        }

        return $sites;

//        $data=http_post(C(Constants::$PATH_API)."/api/cloudwaf/siteVuls/getSiteVulsMsg",null,'json');
//        $result = array();
//        foreach($data['items'] as $k=>$value){
//            $result[$value['_id']] = $value['title'];
//        }
        //return $result;
    }

    //waf集群访问趋势访问次数-攻击次数
    public function visitAttackCounterList(){
        $param = array();
        //dump($this->getAllSitesStr("destHostName_"));
        $param['keys'] = $this->getAllSitesStr("destHostName_");
        $json=http_post(C(Constants::$PATH_API)."/api/cloudwaf/visit_attack/countlist",$param,'json');
        $this->ajaxReturn($json['data']);
    }


    /** 获取当前用户的所有站点用逗号隔开的字符串 */
    public function getAllSitesStr($prefix){
        //$prefix = "destHostName_";
        if(!$prefix){
            $prefix = "";
        }
        $uid  = current_user_id();
        $user = session("user");
        if($user['isSystemRole']){
            $mdasset = new StringModel(Constants::$DB_ASSET);
            $rows = $mdasset->field("_id")->select();
            $domains=array();
            foreach($rows as $domain){
                $domains[]= $prefix.$domain['_id'];
            }
            $str = implode(",",$domains);
            return $str;
        }else{
            $md = new AutoIncrementModel(Constants::$DB_USER_2_ASSET);
            $condition = array();
            $condition['uid'] = $uid;
            $rows=$md->field('domain')->where($condition)->select();
            $domains=array();
            foreach($rows as $k=>$row){
                $domains[] = $prefix.$row['domain'];
            }
            $str = implode(",",$domains);
//        dump($str);
            return $str;
        }
    }

    /** 获取当前用户的所有站点域名数组 */
    public function getAllSitesArr(){
        $domains=array();
        $uid  = current_user_id();
        $user = session("user");
        if($user['isSystemRole']){
            $mdasset = new StringModel(Constants::$DB_ASSET);
            $rows = $mdasset->field("_id")->select();

            foreach($rows as $domain){
                $domains[]= $domain['_id'];
            }
        }else{
            $md = new AutoIncrementModel(Constants::$DB_USER_2_ASSET);
            $condition = array();
            $condition['uid'] = $uid;
            $rows=$md->field('domain')->where($condition)->select();
            foreach($rows as $k=>$row){
                $domains[] = $row['domain'];
            }
        }
        return $domains;
    }

    /** 获取当前用户的所有站点IP数组 */
    public function getAllIpsArr(){
        $domains=array();
        $uid  = current_user_id();
        $user = session("user");
        if($user['isSystemRole']){
            $mdasset = new StringModel(Constants::$DB_ASSET);
            $rows = $mdasset->field("ip")->select();

            foreach($rows as $ip){
                $domains[]= $ip['ip'];
            }
        }else{
            $md = new AutoIncrementModel(Constants::$DB_USER_2_ASSET);
            $condition = array();
            $condition['uid'] = $uid;
            $rows2 = $md->field('domain')->where($condition)->select();
            $ralations = array();
            foreach($rows2 as $k=>$row){
                $ralations[] = $row['domain'];
            }

            $mdasset = new StringModel(Constants::$DB_ASSET);
            $where = array();
            $where["_id"]=array("in",$ralations);
            $rows = $mdasset->where($where)->field("ip")->select();
            foreach($rows as $ip){
                $domains[]= $ip['ip'];
            }
        }
        $str = implode(",",$domains);
        return $str;
    }

}