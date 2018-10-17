<?php
namespace Admin\Controller;
use Common\Model\AutoIncrementModel;
use Common\Vendor\Constants;
use Think\Controller;
class SettingController extends BaseController {
    public function index(){

        $this->display("./page/setting");
    }
    public function  update(){
        $param=I();
		$_id=current_user_id();//不能用I("_id")来获取用户id,会有水平权限的漏洞        
		$param["_id"]=$_id;
        if(!$_id){
            $this->ajaxReturn(array(code=>0,msg=>"不存在的用户"));
        }
        unset($param['repassword']);
        $tmpPassword=$param['tmp_password'];

        $md=new AutoIncrementModel(Constants::$DB_AUTH_USER);
        if(I('password')){//密码修改了
            $user=$md->where(array(_id=>$_id))->find();
            if($user['password']!=$tmpPassword){
                $this->ajaxReturn(array(code=>0,msg=>"旧密码错误"));
            }
        }
        unset($param['tmp_password']);
        $md->save($param,array(upsert=>true));
        $ret=array(code=>1,msg=>"修改成功");
        $this->ajaxReturn($ret);
    }

}