<?php
namespace OptCenter\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;
use Think\Upload;

/**
 * 任务
 *
 * Class IndexController
 * @package OptCenter\Controller
 */
class TaskCreateController extends BaseController {


    /**
     * 任务首页
     */
    public function index2(){

        // 获取策略组
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataGroupPolicy/query", array(),'json');
        if($data['code']){
            $this->assign("policy_group",urlencode(json_encode($data['items'])));
        }

        // 获取节点信息
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataNode/query", array(),'json');
        if($data['code']){
            $this->assign("nodes",$data['items']);
        }

        // 获取策略信息
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataPolicy/query", array(),'json');
        if($data['code']){
            $this->assign("policy_detail", urlencode(json_encode($data['items'])));
        }
        $this->display('index2');
    }

    /**
     * 任务首页
     */
    public function index(){

        $this->assign("srcDomainList" , urlencode(I("domainList")));

        $this->display('index');
    }

    /**
     * 文件上传
     *
     */
    public function upload(){
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        $rows = array();
        $content =file_get_contents($_FILES['file_data']['tmp_name']);
        $array = explode("\n", $content);
//        var_dump($array);
        for($i=0; $i < count($array); $i++){
            $rows[] = $array[$i];
        }
        $result['code'] = 1;
        $result['rows'] = $rows;
        $this->ajaxReturn($result);
    }

    /**
     * 下一步
     */
    public function nextStmp(){

        $domainList = I("domainList");
        $this->assign("domainList", urlencode($domainList));

        // 获取策略组
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataGroupPolicy/query", array(),'json');
        if($data['code']){
            $this->assign("policy_group",$data['items']);
        }

        // 获取节点信息
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataNode/query", array(),'json');
        if($data['code']){
            $this->assign("nodes",$data['items']);
        }


        $this->display("taskcreate");
    }

    /**
     * 获取网站历史记录
     */
    public function domainListHistory(){
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        $param['domainList'] = I('domainList');

        $data = http_post(C('STORM_CENTER_PATH')."/webdomain/domainCheckHistory", $param,'json');
        if($data['code']){
            $result['code']=1;
            $result['rows'] = $data['items'];
        }
        $this->ajaxReturn($result);
    }

    /**
     * 添加任务
     */
    public function addTask(){

        $result=array("code"=>0,"msg"=>'');

        $param = array();
        $param['name'] = I('name');
        $param['policy_group_id'] = I('policy_group_id');
        $param['remark'] = I('remark');
        $param['deep'] = I('deep');
        $param['is_cyc'] = I('is_cyc');
        $param['slice_size'] = I('slice_size');
        $param['node_id'] = I('node_id');
        $param['urls'] = I('urls');
        $param['scan_style'] = I('scan_style');
        if(I('is_cyc')){
            $param['cyc_day'] = I('cyc_day');
        }

        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataTask/insert", $param,'json');
        if($data['code']){
            $result['code']=1;
        }else{
            $result['msg'] = $data['msg'];
        }
        $this->ajaxReturn($result);
    }

    public function addTask2(){
        $result=array("code"=>0,"msg"=>'');
        $user=session("user");

        $param = array();
        $param['name'] = I('name');
        $param['policy_ids'] = I('policy_ids');
        $param['remark'] = I('remark');
        $param['deep'] = I('deep');
        $param['is_cyc'] = I('is_cyc');
        $param['slice_size'] = I('slice_size');
        $param['node_id'] = I('node_id');
        $param['urls'] = I('urls');
        $param['task_creater'] = $user['id'];

        if(I('is_cyc')){
            $param['cyc_day'] = I('cyc_day');
        }
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataTask/insert2", $param,'json');
        if($data['code']){
            $result['code']=1;
        }else{
            $result['msg'] = $data['msg'];
        }
        $this->ajaxReturn($result);
    }

}