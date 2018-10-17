<?php


namespace MSSP\Controller;
use Home\Controller\BaseController;
use Think\Controller;

/**
 * 我的站点
 * Class ContractController
 * @package MSSPSelf\Controller
 */
class SiteController extends BaseController {


    public function index(){
        $user=session("user");
        $param = array();
        if($user['role_id'] != 1){
            $param['userId'] = $user['id'];
        }else{
            $param['userId'] = 0;
        }
        $param['param'] = "";
        $param['start'] = 0;
        $param['limit'] = 1;
        $json = http_post(C('STORM_CENTER_PATH')."/mssp/msspContract/queryUserSite", $param,'json');
        $this->assign("total", $json['total']);
        $this->display("index");
    }



    public function query(){
        $user=session("user");
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        if(I('param')){
            $param['param']= "%".I('param')."%";
        }
        if(I('currentpage') && i('limit')){
            $param['start'] = (I('currentpage') - 1) * I('limit');
            $param['limit'] = I('limit');
        }
        if($user['role_id'] != 1){
            $param['userId'] = $user['id'];
        }else{
            $param['userId'] = 0;
        }
        if(I("package") != null){
            $param['packages'] = I("package");
        }else{
            $param['packages'] = 0;
        }
        $json = http_post(C('STORM_CENTER_PATH')."/mssp/msspContract/queryUserSite", $param,'json');
        $domainList = array();
        $tmpDomainList = array();
        if($json['code']){
            $result['code']=1;
            $result['total'] = $json['total'];
            $values = array();
            foreach($json['items'] as $tmp){
                $tmpDomain = $tmp['domain'];
                $domainList[] = $tmp['domain'];
                $tmp['encodeDomain'] = encodeApiKey($tmpDomain);
                $values[] = $tmp;
            }
            $tmpDomainList = $values;
        }
        $serverJson = http_post(C('WARN_FILTER_PATH')."/api/contract/statisticsinfos/list", array("domains"=>implode(",", $domainList)), 'json');
        $values = array();
        foreach($tmpDomainList as $tmp){
            $tmpDomain = $tmp['domain'];
            $tmp['serviceInfo'] = $serverJson['data'][$tmpDomain];
            $values[] = $tmp;
        }
        $result['rows'] = $values;
        $this->ajaxReturn($result);
    }

    private function judgeRole($roleId){
        $role=M("role")->where(array("id"=>$roleId))->find();
        if($role && $role['name'] == "管理员"){
            return true;
        }
        return false;
    }




}