<?php
namespace Admin\Controller;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;
use Think\Controller;

class BlackIpController extends BaseController {
    public function index(){
        $this->display('blackIp');
    }

    public function listAll(){
        $md=new StringModel(Constants::$DB_IP_BLACKLIST);
        $row=$md->select();
        $this->ajaxReturn(array_values($row));
    }

    public function delete(){
        $md=new StringModel(Constants::$DB_IP_BLACKLIST);

        if(!I("_id")){
            $this->ajaxReturn(array("code"=>0,"msg"=>"删除失败,_id不能为空"));
        }
        $_id=I('_id');
        $userName = I('userName');
        $row=$md->where(array(_id=>$_id,userName=>$userName))->delete();
        if($row['n']){
            $this->ajaxReturn(array("code"=>1,"msg"=>"删除成功"));
        }else{
            $this->ajaxReturn(array("code"=>0,"msg"=>"删除失败，不存在角色_id"));
        }

    }








}