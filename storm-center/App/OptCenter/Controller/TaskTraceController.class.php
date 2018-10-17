<?php
namespace OptCenter\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;

/**
 * 首页
 *
 * Class IndexController
 * @package OptCenter\Controller
 */
class TaskTraceController extends BaseController {


    /**
     * 所有
     */
    public function index(){

        // 获取所有用户
        $user = M("user");
        $this->assign("userList", urlencode(json_encode($user->field("id,username,name,email")->select())));

        // 获取节点信息
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataNode/query", array(),'json');
        if($data['code']){
            $this->assign("nodes",$data['items']);
        }
        $this->display("index");
    }


    /**
     * 详细信息
     */
    public function detail(){
        $json=http_post(C("STORM_CENTER_PATH")."/optcenter/bigdataTask/detail",array("id"=>I('id')),'json');
        $this->assign("data",$json['data']);
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataPolicy/query", null,'json');
        if($data['code']){
            $this->assign("policy_detail", urlencode(json_encode($data['items'])));//存放原始列表
        }
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataGroupPolicy/query", array(),'json');
        if($data['code']){
            $this->assign("policy_group",urlencode(json_encode($data['items'])));
        }


        $this->display('detail');
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
        if(I('status')){
            $param['status'] = I('status');
        }
        if(I('name')){
            $param['name'] = I('name');
        }
        if(I('task_node')){
            $param['node_id'] = I('task_node');
        }
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataTask/query", $param,'json');
        if($data['code']){
            $result['code']=1;
            $result['total'] = $data['total'];
            $result['rows'] = $data['items'];
        }
        $this->ajaxReturn($result);
    }



    // 停止操作
    public function stopTask(){
        $result=array("code"=>0);
        $param['id'] = I("id");
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataTask/stop", $param,'json');
        if($data['code']){
           $result['code']=1;
        }
        $this->ajaxReturn($result);
    }

    // 重新启用任务
    public function restart(){
        $result=array("code"=>0);
        $param['id'] = I("id");
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataTask/restart", $param,'json');
        if($data['code']){
            $result['code']=1;
        }
        $this->ajaxReturn($result);
    }

    // 更新优先级
    public function update(){
        $result=array("code"=>0);
        $params['idSeq'] = json_encode(I("idSeq"));
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataTask/update", $params,'json');
        if($data['code']){
            $result['code']=1;
        }
        $this->ajaxReturn($result);
    }







}