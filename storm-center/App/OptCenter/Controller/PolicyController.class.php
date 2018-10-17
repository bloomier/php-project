<?php
namespace OptCenter\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;

/**
 * 策略
 *
 * Class IndexController
 * @package OptCenter\Controller
 */
class PolicyController extends BaseController {


    /**
     * 策略首页
     */
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
        if(I('level')){
            $param['level'] = I('level');
        }
        if(I('name')){
            $param['name'] =I('name');
        }
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataPolicy/query", $param,'json');
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
        $result = array(msg=>'修改失败！');
        $param = array();
        $param['id'] = I('id');
        $param['level'] = I('level');
        if(I('desc')){
            $param['desc'] = I('desc');
        }
        if(I('repair')){
            $param['repair_advice'] = I('repair');
        }
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataPolicy/update", $param,'json');
        if($data['code']) {
            $result['msg'] = '修改成功！';
        }
        $this->ajaxReturn($result);

    }

    /**
     * 查看
     */
    public function policyDetail(){
        $param['id'] = I('id');
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataPolicy/select", $param,'json');
        if($data['code']){
            $this->assign("policy_detail_src", $data['other']);
            $this->assign("policy_detail", urlencode(json_encode($data['other'])));
        }
        $this->display("policy-detail");
    }
}