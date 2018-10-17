<?php
namespace Admin\Controller;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;
use Think\Controller;
use Think\Db\Driver\Mongo;
use Think\Model\MongoModel;

class ConsoleController extends Controller {

    public function _initialize(){
        if(session('?user')){
            $user=session("user");
            if($user['username']!='admin'){
                $this->error("对不起,您不是admin用户");
            }
            $this->assign("user",$user);
        }else{
            $this->
            $this->error("对不起,您还没有登录","Admin/Login/index");
        }
    }

    public function index(){
        $this->display("./page/console");
    }
    public function validate(){
        $pass=I("password");
        if($pass==md5("1qazcde3!@#")){
            $this->ajaxReturn(array("code"=>1));
        }else{
            $this->ajaxReturn(array("code"=>0));
        }

    }
    public function clearCaches(){
        clearCaches();
        $this->ajaxReturn(array(code=>1));
    }


}