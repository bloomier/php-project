<?php
namespace Home\Controller;
use Think\Controller;
use Think\Hook;
use Think\Model;
use Home\Globals\Constants;

class LoginController extends Controller {

    public function index(){
        $user=session("user");

        if($user){
            $this->redirect("viewModels");

        }else{
            $this->assign("loginType",2);
            $this->display("login");
        }
    }

    public function login1(){

    }

	/**
	 * 转到用户登录界面
	 */
    public function login(){
        $username=I('username');

        $user=M("user")->where(array("username"=>$username))->find();

        if($user&&$user['login_type']!=1){
            LOGNEW(Constants::$LOG_TYPE_LOGIN,$username,0);//记录登录记录
            $this->assign("errorMsg","该用户必须用手机密信认证的方式登录");
            $this->assign("loginType",1);
            $this->display("login");
            die();
        }

        if($user&&$user['password']==I('password')){
            session("user",$user);
            LOGNEW(Constants::$LOG_TYPE_LOGIN,$username,1);//记录登录记录
            //加载模块
            $this->loadMoudels($user['id'],$user['role_id']);
            //$this->ajaxReturn(array("code"=>1));
            $this->redirect("viewModels");
           // echo cookie("username");
        }else{
            //$this->ajaxReturn(array("code"=>0,"msg"=>"登录失败,用户名或密码不正确"));
            LOGNEW(Constants::$LOG_TYPE_LOGIN,$username,0);//记录登录记录
            $this->assign("errorMsg","用户名或密码不正确");
            $this->assign("loginType",1);
            $this->display("login");

        }
        Hook::listen("action_end");
    }


    //密信登录
    public function login2(){
        // 获取登录类型 若为88则表示MSSP系统登录
        $tmpLoginType = I('loginType');

        $username = I('username');
        $user = M("user")->where(array("username"=>$username))->find();
        $password = I('password');
        // 校验用户
        $result = $this->checkUser($user,$password);
        if($result["invalid"]){
            $this->assign("errorMsg2",$result["msg"]);
            $this->gotoLogin($tmpLoginType, $result["msg"]);
            LOGNEW(Constants::$LOG_TYPE_LOGIN,$username,0);//记录登录记录
            die();
        }

        //若密码为初始密码则打开修改密码页面
        if($user && $user['password'] && $user['password'] == "2b7aa26178a4e8a49d1ecb86cc81c027"){
            session("user",$user);//修改密码时用到
            LOGNEW(Constants::$LOG_TYPE_LOGIN,$username,1);//记录登录记录
            $this->display("update_default_password");
        }

        $valicode = I('valicode');
        $this->confirmLogin($user, $valicode, $tmpLoginType);

    }

    /**
     * 确认登录系统
     * @param $user          用户信息
     * @param $valicode      输入的验证码
     * @param $tmpLoginType  登录类型, 用于判断是否为ＭＳＳＰ登录，若是ＭＳＳＰ登录正值为８８
     */
    public function confirmLogin($user, $valicode, $tmpLoginType){
        $username = $user['username'];
        $code = S($username."varify");
        if($user && $code && $code == $valicode){
            session("user",$user);
            // 登录成功修改，修改错位登录次数为0
            $data['error_count'] = 0;
            $user1=M("user")->where(array("id"=>$user['id']))->save($data);
            //加载模块
            $this->loadMoudels($user['id'],$user['role_id']);
            $log=array("code"=>0,"msg"=>"success");
            Hook::listen("action_end",$log);
            LOGNEW(Constants::$LOG_TYPE_LOGIN,$username,1);//记录登录记录
            if($tmpLoginType && $tmpLoginType == 88){
                $this->redirect("/MSSP/Monitor/index");
            } else {
                $this->redirect("viewModels");
            }
        } else{
            $log=array("code"=>0,"msg"=>"fail");
            Hook::listen("action_end",$log);
            LOGNEW(Constants::$LOG_TYPE_LOGIN,$username,0);//记录登录记录

            //修改登陆次数
            $errorMsg2 = $this->updateLoginCount($user,$code);
            $this->assign("errorMsg2",$errorMsg2);
            $this->gotoLogin($tmpLoginType,$errorMsg2);
        }

    }

    // 登录失败后跳转不同登录界面
    public function gotoLogin($loginType,$errorMsg2){
        if($loginType && $loginType == 88){
            $this->assign("loginType",88);
            //$this->display("MSSP@Login:index");
            //$this->redirect("/MSSP/Login/index", array('errorMsg2' =>$errorMsg2));
            $url = U("/MSSP/Login/index",array('errorMsg2' =>$errorMsg2),'',false);
            redirect($url,0);
        } else {
            $this->assign("loginType",2);
            $this->display("login");
        }
    }



    //修改登陆次数
    public function updateLoginCount($user,$code){
        $result = "";
        if(!$code){
            $result = "动态密码已过期";
        } else {
            $error = $user['error_count'];
            if($error == 2){ //错误3次，则锁定用户
                $data['is_lock'] = 1;
                $user=M("user")->where(array("id"=>$user['id']))->save($data);
                $result =  "连续登陆错误次数超过3次，用户被锁定，请联系管理员解锁";
            } else {//修改错误登录次数
                $error = $error + 1;
                $data['error_count'] = $error;
                $user=M("user")->where(array("id"=>$user['id']))->save($data);
                $result =  "您已错误登录".$error."次，连续错误3次用户将被锁定";
            }
        }

        return $result;
    }

    //校验用户有效性
    public function checkUser($user,$password){
        $result = array("invalid"=>false,"msg"=>"");
        //判断用户是否存在
        if(!$user){
            $result["invalid"] = true;
            $result["msg"] = "用户不存在";
            return $result;
        }
        //密码是否正确
        if($user['password'] != $password) {
            $result["invalid"] = true;
            $result["msg"] = "用户名或密码错误";
            return $result;
        }
        // 判断用户是否以被锁定
        if($user && $user['is_lock'] == 1){
            $result["invalid"] = true;
            $result["msg"] = "用户已被锁定，请联系管理员解锁";
            return $result;
        }
        // 判断用户是否过期，前提是已将设置了过期时间的，没有设置过期时间的默认为长期有效
        if($user && $user['expired_date']){
            $expired_date = $user['expired_date'];
            if(strtotime($expired_date) < time()){
                $result["invalid"] = true;
                $result["msg"] = "用户已过期，请联系管理员延期";
                return $result;
            }
        }
        return $result;
    }

    public function viewModels(){
         $user=session("user");
         if($user){
             $this->assign("user",$user);
             $where=array("g.m_type!=0");
             if($user['id']!=1){
                 $where[]="g.id=a.group_id";
                 $where[]="a.uid=".$user['role_id'];
             }
             $model=new  Model();
             $objs=$model->table(array(
                 C('DB_PREFIX').'auth_group'=>'g',
                 C('DB_PREFIX').'auth_group_access'=>'a'

             ))->field("distinct(m_type)")->where($where)->select();
             $types=array();
             foreach($objs as $obj){
                 $types[]=$obj['m_type'];
             }
             $this->assign("mTypes",join($types,","));
             $this->display("home");
         }else{
             // 判断是否使用管理员账号登录
             $admin=I('admin');
             if($admin == "admin"){
                 $this->assign("loginType",1);
                 $this->display("loginAdmin");
             }else {
                 $this->assign("loginType",2);
                 $this->display("login");
             }
         }
    }

    public function jump(){
        $user=session("user");
        if(!$user){
            $this->display("login");
        }else{
            if(I("mType")){//加载权限范围内的第一个页面项
                $where=array("g.m_type=".I("mType"),"g.page_action!=''");
                if($user['id']!=1){
                    $where[]="g.id=a.group_id";
                    $where[]="a.uid=".$user['role_id'];
                }
                $model=new  Model();
                $obj=$model->table(array(
                    C('DB_PREFIX').'auth_group'=>'g',
                    C('DB_PREFIX').'auth_group_access'=>'a'

                ))->where($where)->order('seq')->limit(1)->find();
                $this->ajaxReturn(array("code"=>1,"msg"=>$obj['page_action']));

            }else{
                $this->ajaxReturn(array("code"=>0,"msg"=>"不存在的模块"));
            }
        }

    }

    public function loadMoudels($userId,$roleId){
        $model=new  Model();
        if($userId==1){
            $moudels=M("auth_group")->where(array("type"=>0))->order('seq')->select();
        }else{

            $moudels=$model->table(array(
                C('DB_PREFIX').'auth_group'=>'group',
                C('DB_PREFIX').'auth_group_access'=>'access'
            ))->where(array("group.type=0","group.id=access.group_id","access.uid=".$roleId))->order('seq')->select();
        }

        $moudels=data_merage($moudels);
        session("moudels",$moudels);

    }

    public function resetPwd(){
        $password1=I("password");
        $password2=I("password2");
        if(session("user")){
            $user=session("user");
            if($password1!=$user['password']){
                $result=array("code"=>0,"msg"=>"初始密码错误");
                Hook::listen("action_end",$result);

                $this->ajaxReturn($result);
            }
            M("user")->data(array("password"=>$password2))->where(array("id"=>$user['id']))->save();
            $result=array("code"=>1,"msg"=>"修改密码成功");
            Hook::listen("action_end",$result);
            $this->ajaxReturn($result);

        }

    }

    public function logout(){
        $user=session("user");
        $data=array("code"=>1,"msg"=>$user['username']);
        Hook::listen("action_end",$data);
        session("user",null);
        session("apiKey",null);
        $logoutFlag = I('msspLogout');
        if($logoutFlag && $logoutFlag == 1){
            $this->redirect("/MSSP/Login/index");
        } else {
            $this->redirect("Search/index");
        }

    }

    public function verify($phoneNum){
        $currentCode = S($phoneNum."varify");
        //一分钟之内只允许发一次验证码
        if($currentCode){
            $json['code'] = 0;
            $json['msg'] = "三分钟内只允许获取一次动态密码，请勿重复获取";
            $this->ajaxReturn($json);
        } else {
            $json = http_post(C('STORM_CENTER_PATH')."/selfreport/verify?phoneNum=".$phoneNum,null,"json");
            $json['code'] = 1;
            $code=$json['msg'];
            // $json['valicode'] = $code;
            //有效时间为3分钟
            S($phoneNum."varify", $code, array('type'=>'file','expire'=>180));
            $json['msg'] = "密信动态密码发送成功请注意查收";
            $this->ajaxReturn($json);
        }

    }

}