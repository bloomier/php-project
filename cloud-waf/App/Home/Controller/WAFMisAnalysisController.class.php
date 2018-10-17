<?php
namespace Home\Controller;
use Think\Controller;
use Admin\Controller\BaseController;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;
use Common\Vendor\WafConsole;

class WAFMisAnalysisController extends BaseController {
    /**  进入列表 */
    public function index(){
        $this->display("WAFMisAnalysis");
    }

    public function getPolicy(){
        $policyName = c('POLICY_NAMEE');
        $md = new StringModel(Constants::$DB_POLICY_ATTACK);
//        if(I('dateKey')){
//            $condition['dateKey'] = date("Y-m-d");
//        }
        $condition['dateKey'] = date("Y-m-d");
        $rows = $md->where($condition)->order('timestamp desc')->select();
        $items = array();
        $result = array();
        //$i = 0;
        if($rows){
            foreach($rows as $k=>$row){
                //合并相同policyId的数据
                if(!array_key_exists($row['policyId'], $result)){
                    $tempPolicyId = $this->getFourPolicyId($row['policyId']);
                    //$tempPolicyId = 1202;
                    $row['name'] = $policyName[$tempPolicyId];
                    $result[$row['policyId']] = $row;
                } else {
                    //$result[$row['policyId']]['name'] += $policyName;
                    $result[$row['policyId']]['ipCounter'] += $row['ipCounter'];
                    $result[$row['policyId']]['siteCounter'] += $row['siteCounter'];
                    $result[$row['policyId']]['allCounter'] += $row['allCounter'];
                }
            }

            $descMd = new StringModel(Constants::$DB_POLICY_LIST);
            $descRows = $descMd->select();



            foreach($result as $k=>$row){
                $row['policyDesc'] = $descRows[$k]['desc'];
                $row['policyLevel'] = $descRows[$k]['level'];
                $items[] = $row;
            }
        }
        $this->ajaxReturn(array(code=>1,items=>$items,allCount=>count($result)));
//        $this->ajaxReturn($descRows);
    }

    public function selPolicy(){
        $policyName = c('POLICY_NAMEE');
        $md = new StringModel(Constants::$DB_POLICY_ATTACK);
        $condition = array('timestamp'=>array('$gte'=>(int)I('start'),'$lte'=>(int)I('end')));
        if(I("policyId")){
            $condition['policyId'] = I("policyId");
        }
        $rows = $md->where($condition)->order('timestamp desc')->select();
        $items = array();
        $result = array();
        if($rows){
            foreach($rows as $k=>$row){
                //合并相同policyId的数据
                if(!array_key_exists($row['policyId'], $result)){
                    $tempPolicyId = $this->getFourPolicyId($row['policyId']);
                    $row['name'] = $policyName[$tempPolicyId];
                    $result[$row['policyId']] = $row;
                } else {
                    //$result[$row['policyId']]['name'] += $policyName;
                    $result[$row['policyId']]['ipCounter'] += $row['ipCounter'];
                    $result[$row['policyId']]['siteCounter'] += $row['siteCounter'];
                    $result[$row['policyId']]['allCounter'] += $row['allCounter'];
                }
            }

            $descMd = new StringModel(Constants::$DB_POLICY_LIST);
            $descRows = $descMd->select();

            foreach($result as $k=>$row){
                $row['policyDesc'] = $descRows[$k]['desc'];
                $row['policyLevel'] = $descRows[$k]['level'];
                $items[] = $row;
            }
        }

        $this->ajaxReturn(array(code=>1,items=>$items,allCount=>count($result)));
//        $this->ajaxReturn($rows);
    }

    public function getDetail(){
        $policyDetail['policyId'] = I("policyId");
        $policyDetail['name'] = I("name");
        $policyDetail['policyLevel'] = I("policyLevel");
        $policyDetail['policyDesc'] = I("policyDesc");
        $policyDetail['ipCounter'] = I("ipCounter");
        $policyDetail['allCounter'] = I("allCounter");
        $policyDetail['siteCounter'] = I("siteCounter");

        $this->assign("policyDetail",$policyDetail);
        $this->assign("startTime",I("startTime"));
        $this->assign("endTime",I("endTime"));
        $this->display("misinformation_detail");
    }

    private function getFourPolicyId($policyId){
        return substr($policyId,0,4);
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

    public function getZtreeNodes(){
        $policyId = I("policyId");
        $siteTitle   = $this->getSiteTitleMsg();
        $md = new StringModel(Constants::$DB_ASSET_NEW);
        $rows = $md->field("domain")->select();

        $md2 = new StringModel(Constants::$DB_POLICY_RELATION);
        $condition['_id'] = $policyId;
        $rows2 = $md2->where($condition)->select();
        foreach($rows as $value){
            $result[$value['domain']]=$siteTitle[$value['domain']]?$siteTitle[$value['domain']]:$value['domain'];
        }
        $canSelectNodes = array();
        $selectedNodes = array();
        $i = 2;
        $f = 2;
        foreach($result as $k=>$v){
            if(in_array($k,$rows2[$policyId]['domains'])){
                $one['name'] = $v?$v."_".$k:$k;
                $one['value'] = $k;
                $one['id'] = $f++;
                $one['pId'] = 1;
                $selectedNodes[] = $one;
            }else{
                $one['name'] = $v?$v."_".$k:$k;
                $one['value'] = $k;
                $one['id'] = $i++;
                $one['pId'] = 1;
                $canSelectNodes[] = $one;
            }
        }
        $result['canSelectNodes'] = $canSelectNodes;
        $result['selectedNodes'] = $selectedNodes;
        $result['urls'] = $rows2[$policyId]['urls'];
        $this->ajaxReturn($result);
    }

//    public function addPolicy(){
//        $result = array(code=>0,msg=>"策略配置失败");
//        $domain = I("domain");
//        $zone_rule = I("zone_rule");
//        $page_rule = I("page_rule");
//        $domains = I("domains");
//        $newUrls = array();
//        $md = new StringModel(Constants::$DB_ASSET_NEW);
//        $condition['domain'] = $domain;
//        $domainMsg = $md->where($condition)->select();
//        foreach($domainMsg as $k=>$v){
//            $parms['id'] = $v['id'];
//            if($zone_rule&&strlen($page_rule)<=0){
//                $v['zone_rule']['rule_disable'] = $v['zone_rule']['rule_disable']?$v['zone_rule']['rule_disable']:array();
//                if(!in_array($zone_rule,$v['zone_rule']['rule_disable'])){
//                    $v['zone_rule']['rule_disable'][] = $zone_rule;
//                    $parms['zone_rule'] = $v['zone_rule'];
//                }
//            }
//            if(strlen($page_rule)>0){
//                $urls =explode("\n",$page_rule);
//                $newUrls['domain'] = $domain;
//                $newUrls['urls'] = $urls;
//                $path = array();
//                foreach($v['page_rule'] as $i=>$t){
//                    $pathMsg['rule_disable'] = $t['rule_disable'];
//                    $pathMsg['point'] = $i;
//                    $path[$t['path']] = $pathMsg;
//                    if(!in_array($t['path'],$urls)){
//                        $tPoint = array_search($zone_rule,$t['rule_disable']);
//                        if($tPoint !== false){
//                            array_splice($t['rule_disable'],$tPoint,1);
//                        }
//                    }
//                }
//
//                $v['page_rule'] = $v['page_rule']?$v['page_rule']:array();
//                foreach($urls as $point=>$item){
//                    if(strlen(trim($item))>0){
//                        if(strpos($item,'http://')==0){
//                            $item = str_replace('http://','',$item);
//                        }
//                        if(!$path[$item]){
//                            $one['path'] = $item;
//                            $one['rule_engine'] = 'on';
//                            $one['rule_disable'] = array($zone_rule);
//                            $v['page_rule'][] = $one;
//                        }
//                        if($path[$item] && !in_array($zone_rule,$path[$item]['rule_disable'])){
//                            $v['page_rule'][$path[$item]['point']]['rule_disable'][] = $zone_rule;
//                        }
//                    }
//                }
//                $parms['page_rule'] = $v['page_rule'];
//            }
//            $wafConsole = new WafConsole();
//            $edit = $wafConsole->_edit($parms);
//            if($edit['error']&&$edit['error'][0] == 0){
//                $md->where($condition)->save($v);
//                $this->editPolicy($zone_rule,$domains,$newUrls);
//                $this->deletePolicy($zone_rule,$domains);
//                $result = array(code=>1,msg=>"策略配置成功");
//            }
//
//        }
//        $this->ajaxReturn($result);
//
//    }

//    private function deletePolicy($policyId,$domains){
//        $md = new StringModel(Constants::$DB_POLICY_RELATION);
//        $condition['_id'] = $policyId;
//        $rows = $md->where($condition)->select();
//        if($rows&&$rows[$policyId]['domains']){
//            foreach($rows[$policyId]['domains'] as $point=>$item){
//                if(!in_array($item,$domains)){
//                    $md2 = new StringModel(Constants::$DB_ASSET_NEW);
//                    $condition2['domain'] = $item;
//                    $domainMsg = $md2->where($condition2)->select();
//                    foreach($domainMsg as $k=>$v){
//                        $policyPoint = array_search($policyId,$v['zone_rule']['rule_disable']);
//                        if($policyPoint !== false){
//                            array_splice($v['zone_rule']['rule_disable'],$policyPoint,1);
//                            $md2->where($condition2)->save($v);
//                        }
//                    }
//                }
//            }
//        }
//    }

//    private function editPolicy($policyId,$domains,$urls){
//        $md = new StringModel(Constants::$DB_POLICY_RELATION);
//        $condition['_id'] = $policyId;
//        $rows = $md->where($condition)->select();
//        $one = array();
//        $one['_id'] = $policyId;
//            if($urls){
//                $one['urls'][$urls['domain']] = $urls['urls'];
//            }else if($domains){
//                $one['domains'] = $domains;
//            } else {
//                $one['domains'] = array();
//                $one['urls'] = array();
//            }
//        $md->save($one,array(upsert=>true));
//    }

//    public function globalPolicy(){
//        $this->ajaxReturn(array(code=>1));
//
//
//        $result = array(code=>0,msg=>"策略配置失败");
//        $config = I('config');
//        $policyId = I('policyId');
//        $wafConsole = new WafConsole();
//        $globalPolicy = $wafConsole->_global_list();
//        if($config){
//            $globalPolicy['rule_disable'][] = $policyId;
//        }else{
//            $point = array_search($policyId,$globalPolicy['rule_disable']);
//            if($point !== false){
//                array_splice($globalPolicy['rule_disable'],$point,1);
//            }
//        }
//        $edit = $wafConsole->_global_edit($globalPolicy);
//        if($edit['error']&&$edit['error'][0] == 0){
//            $result = array(code=>1,msg=>"策略配置成功");
//        }
//        $this->ajaxReturn($result);
//    }




}