<?php
/**
 * Created by PhpStorm.
 * User: ah
 * Date: 2015/7/15
 * Time: 14:35
 */

namespace MSSP\Controller;
use Home\Controller\BaseController;
use Think\Controller;

/**
 * 客户列表
 * Class ContractController
 * @package MSSP\Controller
 */
class CustomerController extends BaseController {


    public function index(){
        $this->display("index");
    }

    public function toUpdate(){
        $param['id'] = I("id");
        $data = http_post(C('STORM_CENTER_PATH')."/mssp/msspCustomer/selectByPrimaryKey", $param,'json');
//        $this->assign('id', I('id'));
        $this->assign('customer', $data['other']);
        $this->display("updata");
    }

//    public function queryById(){
//        $result=array("code"=>0,"item"=>"");
//        $param['id'] = I("id");
//        $data = http_post(C('STORM_CENTER_PATH')."/mssp/msspCustomer/selectByPrimaryKey", $param,'json');
//        if($data['code']){
//            $result['code'] = 1;
//            $result['item'] = $data['other'];
//        }
//        $this->ajaxReturn($result);
//    }

    public function query(){
        $result=array("code"=>0,"total"=>0,"rows"=>array());// 定义返回内容 code判断是否成功 totol数据数量 rows具体内容
        $start = (I('currentpage') - 1) * I('limit');
        $limit = I('limit');
        $param['start'] = $start;
        $param['limit'] = $limit;

        if(I('name')){
            $param['name'] = I('name');
        }
       if(I('state')){
           $param['state']=I('state');
          if( $param['state']==2){
              $param['state']=0;
          }
       }

        $data = http_post(C('STORM_CENTER_PATH')."/mssp/msspCustomer/query", $param,'json');
        if($data['code']){
            $result['code']=1;
            $result['total'] = $data['total'];
            $result['rows'] = $data['items'];
        }
        $this->ajaxReturn($result);
    }

    public function add(){
        $this->display("add");
    }


    /**
     * 修改
     */
    public function update(){
        $result = array(msg=>'操作失败！', code=>0);
        $param = array();
        $param['id'] = I('id');

        if(I("name")){
            $param['name'] = I("name");
        }
        if(I("remark")){
            $param['desc'] = I("remark");
        }
        if(I("phone")){
            $param['phone'] = I("phone");
        }
        if(I("email")){
            $param['email'] = I("email");
        }
        if(I("state")){
            $param['state'] = I("state");
        } else {
            $param['state'] = 0;
        }
        $data = http_post(C('STORM_CENTER_PATH')."/mssp/msspCustomer/update", $param,'json');
        if($data['code']) {
            $result['code'] = 1;
            $result['msg'] = '操作成功！';
        }
        $this->ajaxReturn($result);
    }

    /**
     * 添加
     */
    public function insert(){
        $result = array(msg=>'操作失败!', code=>0);
        $param = array();
        $param['id'] = I('id');
        if(I('phone')){
            $param['phone'] = I('phone');
        }
        if(I("email")){
            $param['email'] = I("email");
        }
        if(I("remark")){
            $param['desc'] = I("remark");
        }
        if(I("name")){
            $param['name'] = I("name");
        }
        $data = http_post(C('STORM_CENTER_PATH')."/mssp/msspCustomer/insert", $param,'json');
        if($data['code']) {
            $result['code'] = 1;
            $result['msg'] = '操作成功！';
        }
        $this->ajaxReturn($result);
    }


    /**
     * 批量删除
     */
    public function beatchDelete(){
        $param['ids'] = I('ids');
        $data = http_post(C('STORM_CENTER_PATH')."/mssp/msspCustomer/beatchDelete", $param,'json');
        if($data['code']){
            $this->ajaxReturn(array("code"=>1,"msg"=>"删除成功"));
        }else{
            $this->ajaxReturn(array("code"=>2,"msg"=>"请勾选删除行"));
        }
    }


}