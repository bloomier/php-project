<?php
namespace Admin\Controller;
use Common\Model\AutoIncrementModel;
use Common\Vendor\Constants;
use Common\Vendor\UserVerify;
use Think\Controller;
class BaseController extends Controller {
    public function _initialize(){
        if(session('?user')){
            $user=session("user");

            if(!authcheck(MODULE_NAME.'/'.CONTROLLER_NAME.'/'.ACTION_NAME,$user)){
                $this->error("对不起,您没有操作权限");
            }
            $this->assign("user",$user);
        }else{
            //添加XXX通登录验证
            if(I('username') && I('token') == "58BC82CC-98A1-183E-6A97-31EC49E42E2D" && I('key') == "A0F5DC73-F551-0015-44B7-77063F47C434"){
                $auth_user=new AutoIncrementModel(Constants::$DB_AUTH_USER);
                $user=$auth_user->where(array(username=>I('username')))->find();
                if(!$user){
                    $this->error("对不起,您不是玄武盾用户");
                }
                $userVerify=new UserVerify();
                $actions=$userVerify->checkActions($user,false);
                $permissions=$userVerify->checkPermissions($actions);
                $user['actions']=$permissions;
                $this->assign("user",$user);
            } else {
                $this->redirect("Admin/Login/logout");
            }

        }
    }


}