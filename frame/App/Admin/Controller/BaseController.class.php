<?php
namespace Admin\Controller;
use Think\Controller;
use Think\Hook;

class BaseController extends Controller {
//    public function _initialize(){
//        if(session('?user')){
//            $user=session("user");
//            //change_db($user['region_id']);
////            dump($user);
//            if(!authcheck(MODULE_NAME.'/'.CONTROLLER_NAME.'/'.ACTION_NAME,$user)){
//
//                if(IS_AJAX){
//                    $this->ajaxReturn(array(code=>0,"msg"=>"对不起,您没有操作权限"));
//                }else{
//                    $this->error("对不起,您没有操作权限");
//                }
//
//
//            }
//            $this->assign("pathInfo",MODULE_NAME.'/'.CONTROLLER_NAME.'/'.ACTION_NAME);
//            $this->assign("user",$user);
//        }else{
//            $this->redirect("Admin/Login/logout");
//        }
//    }
}