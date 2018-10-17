<?php
namespace OptCenter\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;

/**
 * 策略组
 *
 * Class IndexController
 * @package OptCenter\Controller
 */
class PolicyGroupController extends BaseController {


    public function index(){
       $this->display('index');
    }

    /**
     * 查询
     */
    public function query(){
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        $start = (I('currentpage') - 1) * I('limit');
        $limit = I('limit');
        $param['start'] = $start;
        $param['limit'] = $limit;
        if(I('enable') || I('enable') == 0){
            $param['enable'] = I('enable');
        }
        if(I('name')){
            $param['name'] = I('name');
        }
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataGroupPolicy/query", $param,'json');
        if($data['code']){
            $result['code']=1;
            $result['total'] = $data['total'];
            $result['rows'] = $data['items'];
        }
        $this->ajaxReturn($result);
    }

    /**
     * 修改
     */
    public function update(){
        $result = array(msg=>'操作失败！', code=>0);
        $param = array();
        $param['id'] = I('id');
        if(I('enable') || I('enable') == 0){
            $param['enable'] = I('enable');
        }
        if(I("policy_ids")){
            $param['policy_ids'] = I("policy_ids");
        }
        if(I("desc")){
            $param['remark'] = I("desc");
        }
        if(I("name")){
            $param['name'] = I("name");
        }
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataGroupPolicy/update", $param,'json');
        if($data['code']) {
            $result['code'] = 1;
            $result['msg'] = '操作成功！';
        }
        $this->ajaxReturn($result);
    }

    /**
     * 单个查询
     */
    public function policyGroupDetail(){
        $param['id'] = I('id');
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataPolicy/query", null,'json');
        if($data['code']){
            $this->assign("policy_detail", urlencode(json_encode($data['items'])));//存放原始列表
        }
        $policyGroupData = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataGroupPolicy/select", $param,'json');
        if($policyGroupData['code']){
            $this->assign("policy_group_info", urlencode(json_encode($policyGroupData['other'])));// 存放该组所包含的列表
        }
        $this->display("policygroupedit");
    }

    /**
     * 进入添加页面
     */
    public function policyGroupToAdd(){
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataPolicy/query", null,'json');
        if($data['code']){
            $this->assign("policy_detail", urlencode(json_encode($data['items'])));//存放原始列表
        }
        $this->display("policygroupedit");
    }

    /**
     * 添加
     */
    public function insert(){
        $result = array(msg=>'操作失败！', code=>0);
        $param = array();
        $param['id'] = I('id');
        if(I('enable') || I('enable') == 0){
            $param['enable'] = I('enable');
        }
        if(I("policy_ids")){
            $param['policy_ids'] = I("policy_ids");
        }
        if(I("desc")){
            $param['remark'] = I("desc");
        }
        if(I("name")){
            $param['name'] = I("name");
        }
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataGroupPolicy/insert", $param,'json');
        if($data['code']) {
            $result['code'] = 1;
            $result['msg'] = '操作成功！';
        }
        $this->ajaxReturn($result);
    }
    

}