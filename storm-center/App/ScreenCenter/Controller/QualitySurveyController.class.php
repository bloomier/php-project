<?php
namespace ScreenCenter\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;


class QualitySurveyController extends BaseController {

    public function getAlertList(){
        $result = array('code'=>0, 'items'=>array(), 'other'=>array());
        $param = array();
        $param['min'] = 1;
        $param['ids'] = I('ids');
        $json = http_post(C("WARN_FILTER_PATH")."/api/contract/domains/laesterror", $param, 'json');
        if($json['code']){
            if(count($json['data']) > 0){
                $result['items'] = $json['data'];
                $result['code'] = 1;
                $result['other'] = $json['other'];
            }
        }
        $this->ajaxReturn($result);
    }

    public function index(){
        $user=session("user");
        $param=array();
        if($user['id']!=1&&$user['role_id']!=1){
            $param['user_id']= $user['id'];
        }
        $json=http_post(C("STORM_CENTER_PATH")."/mssp/MsspUserContractRelation/queryContractId",$param,'json');
        if($json['code']<0){
            $this->error("对不起,数据异常");
        }
        $contractIds=$json['other']['contract_ids'];

        if($contractIds==''){
            $this->error("对不起,您还没有对应的合同");
        }
        $this->assign("contractIds",$contractIds);
        $json=http_post(C("STORM_CENTER_PATH")."/mssp/MsspUserScreenConfig/queryConfig",array("user_id"=>$user['id']),'json');
        if($json['other']['domain_list']){
            $this->assign("config_domains",$json['other']['domain_list']);
        }
        $this->display("./quality-survey");
    }

    public function warning(){
         $json=http_post(C("WARN_FILTER_PATH")."/api/contract/warning/get",array(ids=>I("ids")),'json');
         $this->ajaxReturn($json);
    }
    public function nodeCount(){
        $json=http_post(C("WARN_FILTER_PATH")."/api/contract/nodes/count",array(ids=>I("ids")),'json');
        $this->ajaxReturn($json);
    }
    public function domainCount(){
        $json=http_post(C("WARN_FILTER_PATH")."/api/contract/domains/count",array(ids=>I("ids")),'json');
        $this->ajaxReturn($json);
    }
    public function domainList(){
        $json=http_post(C("WARN_FILTER_PATH")."/api/contract/domains/list",array(ids=>I("ids")),'json');
        $this->ajaxReturn($json);
    }
    public function domainStatus(){
        $json=http_post(C("WARN_FILTER_PATH")."/api/contract/domains/deatil",array(ids=>I("ids")),'json');
        $this->ajaxReturn($json);
    }
    public function sends(){
        $json=http_post(C("WARN_FILTER_PATH")."/api/contract/sends/get",array(ids=>I("ids")),'json');
        $this->ajaxReturn($json);
    }
    public function accessinfos(){
        $json=http_post(C("WARN_FILTER_PATH")."/api/contract/accessinfos/list",array(domains=>I("domains")),'json');
        $this->ajaxReturn($json);
    }
    public function updateConfig(){
        $user=session("user");
        if(I('domain_list')){

            $json=http_post(C("STORM_CENTER_PATH")."/mssp/MsspUserScreenConfig/insertOrUpdate",array("user_id"=>$user['id'],'domain_list'=>I('domain_list')),'json');
        }
        $this->ajaxReturn($json);

    }
    public function  getImg(){
        header("Content-type: image/png");
        $path=C('SCREEN_SHOT_PATH')."/getImg?domain=".I('domain')."&small=".I('small')."&defaultImg=".I("defaultImg");
        $content=file_get_contents($path);
        echo $content;
    }
}