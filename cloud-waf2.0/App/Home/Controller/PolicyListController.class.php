<?php
/**
 * Created by PhpStorm.
 * User: jianghaifeng
 * Date: 2016/3/1
 * Time: 14:25
 */

namespace Home\Controller;
use Common\Vendor\WafConsole;
use Think\Controller;
use Admin\Controller\BaseController;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;
class PolicyListController extends BaseController {

    /** */
    public function index(){
        $this->display("policyList");
    }


    /**
     * 获取策略列表
     */
    public function getPolicyList(){
        $md = new StringModel(Constants::$DB_POLICY_LIST);
        // header("Content-Type: text/html; charset=UTF-8");
        $rows = $md->order('_id asc')->select();
        $policyRe = new StringModel(Constants::$DB_POLICY_RELATION);
        $reMsg = $policyRe->select();
        $items = array();
        if($rows){
            foreach($rows as $k=>$row){
                if($reMsg[$row['_id']]){
                    $row['urls'] = "";
                    $config = false;
                    if($reMsg[$row['_id']]['urls']&&count($reMsg[$row['_id']]['urls'])>0){
                        foreach($reMsg[$row['_id']]['urls'] as $i=>$url){
                            if(count($url['urls'])>0){
                                $config=true;
                                foreach($url['urls'] as $point=>$item){
                                    $row['urls']=$row['urls'].$url['domain'].":".$item.",";
                                }
                            }
                        }
                        $row['urls'] = substr($row['urls'],0,strlen($row['urls'])-1);
                    }
                    if($reMsg[$row['_id']]['allSite']==1){
                        $row['site'] = '禁用';
                    }else{
                        if($reMsg[$row['_id']]['domains']&&count($reMsg[$row['_id']]['domains'])>0||$config){
                            $row['site'] = '局部禁用';
                        }else{
                            $row['site'] = '启用';
                        }
                    }
//                    $row['site'] = $reMsg[$row['_id']]['allSite']==1?'禁用':$reMsg[$row['_id']]['domains']&&count($reMsg[$row['_id']]['domains'])>0||$config?'局部禁用':'启用';
                    $row['domains'] = count($reMsg[$row['_id']]['domains'])>0?implode(',',$reMsg[$row['_id']]['domains']):"";
                }else{
                    $row['site'] = '启用';
                    $row['domains'] = "";
                    $row['urls'] = "";
                }
                $items[] = $row;
            }
        }
        $ret['recordsTotal']= count($rows);
        $ret['recordsFiltered'] = count($rows);
        $ret['items'] = array_values($items);
        $this->ajaxReturn($ret);

    }

    public function getPolicyMsg(){
        $policyId = I('policyId');
        $condition['_id'] = $policyId;
        $md = new StringModel(Constants::$DB_POLICY_LIST);
        $row = $md->where($condition)->find();
        $this->assign('policyDetail',$row);
//        $this->ajaxReturn($row);
        $this->display("policy_configuration");
    }

    public function getPolicyRelation(){
        $md = new StringModel(Constants::$DB_POLICY_RELATION);
        $rows = $md->select();

        $this->ajaxReturn($rows);
    }


    /** 初始化策略，将文件中的策略列表插入数据库中，
     * 因为每次遍历文件效率比较慢
     * 每次策略变化时，需要重新初始化
     */
    public function initPolicy(){
        $md=new StringModel(Constants::$DB_POLICY_LIST);
        $md->getCollection()->drop();
        $json = file_get_contents("./Public/asset/source/policyList.data");

        $begin = stripos($json, "<tbody>") + 7;
        $end = stripos($json, "</tbody>") - $begin;
        //获取包含行的所有HTML数据
        $allHtml = substr($json, $begin, $end);
        //判断是否包含行tr
        while(strstr($allHtml,"</tr>")){
            $one = array();
            $trEndNum = stripos($allHtml, "</tr>");
            //获取一个tr
            $oneTr = substr($allHtml,0,$trEndNum);
            $one['_id'] = $this->getTdHtmlByTr($oneTr,0);
            //$one['id'] = $this->getTdHtmlByTr($oneTr,0);
            $one['type'] = $this->getTdHtmlByTr($oneTr,1);
            $one['desc'] = $this->getTdHtmlByTr($oneTr,2);
            $one['level'] = $this->getTdHtmlByTr($oneTr,5);
            //$result[] = $one;
            $md->save($one,array(upsert=>true));
            $allHtml = substr($allHtml,$trEndNum + 5);
        }


    }



    /** 从tr中获取td内容 */
    private function getTdHtmlByTr($tr,$num){
        $tdhtml = "";
        $tr = substr($tr,stripos($tr, "<td"),stripos($tr, "</tr>") - stripos($tr, "<td"));
        $i = 0;
        while(strstr($tr,"</td>")){
            $begin = stripos($tr, "<td");
            $end = stripos($tr, "</td>");
            $td = substr($tr,$begin, $end - $begin + 5);
            if($i == $num){
                $tdhtml = $this->getTdHtmlByTd($td);
                break;
            }
            $tr = substr($tr,$end + 5);
            $i++;
        }

        return $tdhtml;
    }

    /** 从td中获取td内容 */
    private function getTdHtmlByTd($td){
        //header("Content-Type: text/html; charset=UTF-8");
        $begin = stripos($td, ">");
        $end = stripos($td , "</td>");
        $html = substr($td,$begin + 1,$end - $begin - 1);
        return $html;
    }

    //全局策略配置  waf接口暂无
    public function globalPolicy(){
        $result = array(code=>0,msg=>"策略配置失败");
        $config = I('config');
        $policyId = I('policyId');
        $wafConsole = new WafConsole();
        $globalPolicyMsg = $wafConsole->_global_list();
        $globalPolicy = $globalPolicyMsg['items'];
        if($config == 'true'){
            foreach($policyId as $i=>$t){
                $globalPolicy['rule_disable'][] = $t;
            }
            $globalPolicy['rule_disable'] = array_unique($globalPolicy['rule_disable']);
        }else{
            foreach($policyId as $i=>$t){
                $point = array_search($t,$globalPolicy['rule_disable']);
                if($point !== false){
                    array_splice($globalPolicy['rule_disable'],$point,1);
                }
            }
        }
        $error = $wafConsole->_global_edit($globalPolicy);
        if($error['code'] === 0){
            $result = array(code=>1,msg=>"策略配置成功");
        }
        $this->ajaxReturn($result);
    }

    //站点级
    public function sitePolicy(){
        $result = array(code=>0,msg=>'策略配置失败');
        $domains = I("domains");
        $policyId = I("policyId");
        $editSitePolictyFig = false;
        $editSitePolictyFig2 = false;
        $md = new StringModel(Constants::$DB_POLICY_RELATION);
        $policyCondition['_id'] = $policyId;
        $policyRelation = $md->where($policyCondition)->select();
        $policyDomains = array();
        foreach($policyRelation as $k=>$v){
            $policyDomains = $v['domains'] == null?array():$v['domains'];
        }
        if(count(array_diff($domains,$policyDomains)) == 0 && count(array_diff($policyDomains,$domains))  == 0){
            $result = array(code=>1,msg=>'策略配置成功');
        }

        foreach($domains as $i=>$t){
            if(!in_array($t,$policyDomains)){
                $editSitePolicty1 = $this->editSitePolicty($t,$policyId,true);
                if($editSitePolicty1){
                    $editSitePolictyFig = true;
                }else{
                    $editSitePolictyFig = false;
                }
            }
        }
        foreach($policyDomains as $point=>$item){
            if(!in_array($item,$domains)){
                $editSitePolicty2 = $this->editSitePolicty($item,$policyId,false);
                if($editSitePolicty2){
                    $editSitePolictyFig2 = true;
                }else{
                    $editSitePolictyFig2 = false;
                }
            }
        }
        if($editSitePolictyFig || $editSitePolictyFig2){
            $editPolicyRelation = array();
            $editPolicyRelation['level'] = 'site';
            $editPolicyRelation['domains'] = $domains;
            $editPolicyRelationResult = $this->editPolicyRelation($policyId,$editPolicyRelation);
            if($editPolicyRelationResult){
                $result = array(code=>1,msg=>'策略配置成功');
            }
        }
        $this->ajaxReturn($result);

    }

    //修改保护站点和站点列表
    private function editSitePolicty($domain,$policyId,$config){
        $md = new StringModel(Constants::$DB_ASSET_NEW);
        $condition['domain'] = $domain;
        $assetNew = $md->where($condition)->select();
        $wafConsole = new WafConsole();
        if($config){
            foreach($assetNew as $k=>$v){
                $one['id'] = $v['id'];
                $one['zone_rule'] = $v['zone_rule'] == null?array():$v['zone_rule'];
                //$one['zone_rule']['rule_engine'] = 'on';
                $one['zone_rule']['rule_disable'][] = $policyId;
                $one['zone_rule']['rule_disable'] = array_unique($one['zone_rule']['rule_disable']);
                $wafEdit = $wafConsole->_edit($one);
                if($wafEdit['code'] === 0){
                    $v['zone_rule']['rule_disable'] = $one['zone_rule']['rule_disable'];
                    $assetNewResult = $md->save($v,array(upsert=>true));
                    if($assetNewResult !== false){
                        return true;
                    }else{
                        return false;
                    }
                }
            }
        }else{
            foreach($assetNew as $k=>$v){
                $one['id'] = $v['id'];
                $one['zone_rule'] = $v['zone_rule'] == null?array():$v['zone_rule'];
                //$one['zone_rule']['rule_engine'] = 'on';
                $point = array_search($policyId, $one['zone_rule']['rule_disable']);
                if($point !== false){
                    array_splice($one['zone_rule']['rule_disable'],$point,1);
                }
                $wafEdit = $wafConsole->_edit($one);
                if($wafEdit['code'] === 0){
                    $v['zone_rule']['rule_disable'] = $one['zone_rule']['rule_disable'];
                    $assetNewResult = $md->save($v,array(upsert=>true));
                    if($assetNewResult !== false){
                        return true;
                    }else{
                        return false;
                    }
                }

            }
            return $wafEdit;
        }

        $wafConsole = new WafConsole();


    }


    //修改策略站点url关联表
    private  function editPolicyRelation($policyId,$item){
        $md = new StringModel(Constants::$DB_POLICY_RELATION);
        $condition['_id'] = $policyId;
        $rows = $md->where($condition)->find();
        $policyMsg = array();
        $policyMsg['_id'] = $policyId;
        $policyMsg['domains'] = array();
        $policyMsg['urls'] = array();
        if($item['level'] == 'site'){
            $policyMsg['domains'] = $item['domains'];
            $policyMsg['urls'] =$rows['urls'];
        }
        if($item['level'] == 'url'){
            $policyMsg['domains'] = $rows['domains'];
            $policyMsg['urls'] = $rows['urls'] == null?array():$rows['urls'];
            $one['domain'] = $item['domain'];
            $one['urls'] = $item['url'];
            $policyUrlIs = true;
            foreach($policyMsg['urls'] as $k=>$v){
                if($v['domain'] == $item['domain']){
                    $policyUrlIs = false;
                    $policyMsg['urls'][$k]['urls'] = $item['url'];
                }
            }
            if($policyUrlIs){
                $policyMsg['urls'][] = $one;
            }
        }

        $result = $md->save($policyMsg,array(upsert=>true));

        if($result !== false){
            return true;
        }else{
            return false;
        }
    }


    //url级
    public function urlPolicy(){
        $result = array(code=>0,msg=>'策略配置失败');
        $domain = I('domain');
        $urls = array();
        foreach(I('urls') as $k=>$v){
            $urls[] = $v;
        }
        $policyId = I('policyId');
        $editUrlPolictyResult = $this->editUrlPolicty($domain,$urls,$policyId);
        if($editUrlPolictyResult){
            $editPolicyRelationParam = array();
            $editPolicyRelationParam['level'] = 'url';
            $editPolicyRelationParam['domain'] = $domain;
            $editPolicyRelationParam['url'] = $urls;

            $editPolicyRelationResult = $this->editPolicyRelation($policyId,$editPolicyRelationParam);
            if($editPolicyRelationResult){
                $result = array(code=>1,msg=>'策略配置成功');
            }
        }

        $this->ajaxReturn($result);

    }

    //url级保护站点和站点列表
    private function editUrlPolicty($domain,$urls,$policyId){
        $wafConsole = new WafConsole();
        $policyRelation = new StringModel(Constants::$DB_POLICY_RELATION);
        $policyRelationConfig['_id'] = $policyId;
        $policyRelationMsg = $policyRelation->where($policyRelationConfig)->select();

        $assetNew = new StringModel(Constants::$DB_ASSET_NEW);
        $assetNewConfig['domain'] = $domain;
        $assetNewMsg = $assetNew->where($assetNewConfig)->select();
        $assetNewParam = array();
        $oldUrls = array();
        foreach($policyRelationMsg as $k=>$v){
            foreach($v['urls'] as $key=>$value){
                if($value['domain'] == $domain){
                    $oldUrls = $value['urls'];
                }
            }
        }
        $wafId = '';
        foreach($assetNewMsg as $k=>$v){
            $wafId = $v['_id'];
            $assetNewParam['_id'] = $v['_id'];
        }
            $wafCondition['id'] = $wafId;
            $wafFind = $wafConsole->_find($wafCondition);
            $wafMsg = $wafFind['items'];
            foreach($urls as $i=>$url){
                if(!in_array($url,$oldUrls)){
                    $wafUrlIs = true;
                    foreach($wafMsg[$wafId]['page_rule'] as $k=>$v){
                        if($v['path'] == $url){
                            $wafUrlIs=false;
                            if(!in_array($policyId,$wafMsg[$wafId]['page_rule'][$k]['rule_disable'])){
                                $wafMsg[$wafId]['page_rule'][$k]['rule_disable'][] = $policyId;
                            }
                        }
                    }

                    if($wafUrlIs){
                        $one['path'] = $url;
                        $one['rule_engine'] = 'on';
                        $one['rule_disable'][]= $policyId;
                        $wafMsg[$wafId]['page_rule'][] = $one;
                    }

                }


            }
            foreach($oldUrls as $i=>$url){
                if(!in_array($url,$urls)){
                    foreach($wafMsg[$wafId]['page_rule'] as $k=>$v){
                        if($v['path'] == $url){
                            $policyPoint = array_search($policyId,$wafMsg[$wafId]['page_rule'][$k]['rule_disable']);
                            if($policyPoint !== false){
                                array_splice($wafMsg[$wafId]['page_rule'][$k]['rule_disable'],$policyPoint,1);
                            }
                        }
                    }
                }
            }
            $wafParam['id'] = $wafId;
            $wafParam['page_rule'] =  $wafMsg[$wafId]['page_rule'];
            $wafEdit = $wafConsole->_edit($wafParam);
            if($wafEdit['code'] === 0){
                if($wafMsg[$wafId]['page_rule'] && count($wafMsg[$wafId]['page_rule'])>0){
                    $assetNewParam['page_rule'] = $wafMsg[$wafId]['page_rule'];
                }else{
                    $assetNewParam['page_rule'] = array();
                }
                $assetNewResult = $assetNew->save($assetNewParam,array(upsert=>true));
                if($assetNewResult !== false){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }




    }

    public function editGlobalRelation(){
        $policyId = I('policyId');
        $allSite = I('allSite');
        $md = new StringModel(Constants::$DB_POLICY_RELATION);
        $param = array();
        foreach($policyId as $k=>$v){
            $param['_id'] = $v;
            $param['allSite'] = $allSite;
            $md->save($param,array(upsert=>true));
        }
    }

    public function startAll(){
        $result = array(code=>0,msg=>"策略启用失败");
        $policyId = I('policyId');
        $md = new StringModel(Constants::$DB_POLICY_RELATION);
        $assetNew = new StringModel(Constants::$DB_ASSET_NEW);
        $waf = new WafConsole();
        foreach($policyId as $point=>$item){
            $editAsset = null;
            $editAsset1 = null;
            $condition['_id'] = $item;
            $row = $md->where($condition)->find();
            $domainUrl = array();
            foreach($row['urls'] as $k=>$v){
                $domainUrl[$v['domain']] = $v['urls'];
            }
            foreach($row['domains'] as $k2=>$v2){
                $assetNewParam['domain'] = $v2;
                $assetNewMsg = $assetNew->where($assetNewParam)->find();
                $wafParam['id'] = $assetNewMsg['_id'];
                $wafMsg = $waf->_find($wafParam);
                $sitePolicy = $wafMsg['items'][$assetNewMsg['_id']]['zone_rule'];
                $sitePolicy['rule_disable'] = $this->delItem($sitePolicy['rule_disable'],$item);
                if($domainUrl[$v2]){
                    $urlPolicy = $wafMsg['items'][$assetNewMsg['_id']]['page_rule'];
                    foreach($domainUrl[$v2] as $k3=>$v3){
                        foreach($urlPolicy as $k4=>$v4){
                            if($v4['path'] ==$v3){
                                $urlPolicy[$k4]['rule_disable'] = $this->delItem($urlPolicy[$k4]['rule_disable'],$item);
                                $domainUrl[$v2] = null;
                            }
                        }
                    }
                   $editParam['page_rule'] = $urlPolicy;
                }
                $editParam['id'] = $assetNewMsg['_id'];
                $editParam['zone_rule'] = $sitePolicy;
                $error = $waf->_edit($editParam);
                if($error['code'] === 0){
                    $assetNewMsg['zone_rule'] = $editParam['zone_rule'];
                    if($editParam['page_rule']){
                        $assetNewMsg['page_rule'] = $editParam['page_rule'];
                    }
                    $editAsset = $assetNew->save($assetNewMsg,array(update=>true));
                }


            }

            foreach($domainUrl as $domain=>$urls){
                if($urls){
                    $assetNewParam1['domain'] = $domain;
                    $assetNewMsg1 = $assetNew->where($assetNewParam1)->find();
                    $wafParam1['id'] = $assetNewMsg1['_id'];
                    $wafMsg1 = $waf->_find($wafParam1);
                    $urlPolicy1 = $wafMsg1['items'][$assetNewMsg1['_id']]['page_rule'];
                    foreach($urls as $i=>$url){
                        foreach($urlPolicy1 as $k5=>$v5){
                            if($v5['path'] ==$url){
                                $urlPolicy1[$k5]['rule_disable'] = $this->delItem($urlPolicy1[$k5]['rule_disable'],$url);
                            }
                        }
                    }
                    $delUrlPolicy['id'] = $assetNewMsg1['_id'];
                    $delUrlPolicy['page_rule'] = $urlPolicy1;
                    $error1 = $waf->_edit($delUrlPolicy);
                    if($error1['code'] === 0){
                        $assetNewMsg1['page_rule'] = $delUrlPolicy['page_rule'];
                        $editAsset1 = $assetNew->save($assetNewMsg1,array(update=>true));
                    }


                }
            }

            if($editAsset !== false || $editAsset1 !== false){
                $row['allSite'] = '0';
                $row['domains'] = array();
                $row['urls'] = array();
                $editRelation = $md->save($row);
                if($editRelation !== false){
                    $result = array(code=>1,msg=>"策略启用成功");
                }
            }


        }

        $this->ajaxReturn($result);
    }

    private function delItem($arr,$item){
        $point = array_search($item,$arr);
        array_splice($arr,$point,1);

        return $arr;
    }



}