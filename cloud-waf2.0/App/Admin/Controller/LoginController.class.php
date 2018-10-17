<?php
namespace Admin\Controller;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;
use Common\Vendor\Util;
use Think\Controller;
use Think\Hook;
use Think\Verify;


class LoginController extends Controller {
    public function index(){
//        if(session("?user")){
//            $user=session("user");
//            $this->redirect($user['firstAction']);
//        }else{
//            $this->display("./page/login");
//        }
        $this->display("./page/login");

    }

//    public function getClictIp(){
//        dump(get_client_ip());
//    }

    public function login(){
        $user = array(
            "id"=>1,
            "name"=>"admin",
            "username"=>"admin",
            "name"=>"admin",
            "actions"=>array(),
            "menus"=>array(),
            "firstAction"=>"/Home/Index/inde",
            "firstActionName"=>"首页",
            "isSystemRole"=>true
        );
        $actions=$this->checkActions($user);
        $permissions=$this->checkPermissions($actions);
        $menus=$this->checkMenus($actions);
        $firstMenu=$this->getFirstAction($menus);
        $user['actions']=$permissions;
        $util=new Util();
        $user['menus']=$util->data_merge($menus);
        $user['firstAction'] = $firstMenu['name'];
        $user['firstActionName'] = $firstMenu['title'];

        if($user){
            session("user",$user);
        }
        $ret=array(code=>1,msg=>"登录成功","firstAction"=>$firstMenu['name']);
        $this->ajaxReturn($ret);
    }

    public function login_old(){
        $this->checkIp();
        $user=$this->checkUser();
        $user['isSystemRole'] = $this->checkSystemRole($user);
        $actions=$this->checkActions($user);
        $permissions=$this->checkPermissions($actions);
        $menus=$this->checkMenus($actions);
        $firstMenu=$this->getFirstAction($menus);
        $user['actions']=$permissions;
        $util=new Util();
        $user['menus']=$util->data_merge($menus);
        $user['firstAction'] = $firstMenu['name'];
        $user['firstActionName'] = $firstMenu['title'];

        if($user){
            session("user",$user);
        }
        $ret=array(code=>1,msg=>"登录成功","firstAction"=>$firstMenu['name']);
        $this->ajaxReturn($ret);
    }


    private function checkActions($user){
        //如果是系统管理员或者用户id等于1，将拥有所有权限
        if($user['_id']==1 || $user['isSystemRole']){
            $md=new AutoIncrementModel(Constants::$DB_AUTH_ACTION);
            $action=$md->where(array(status=>1))->order("seq asc")->select();
            $actions= array_values($action);
        }else{

            $md=new AutoIncrementModel(Constants::$DB_AUTH_ROLE);
            $role_ids=$user['roles'];
            $where=array();
            $where["_id"]=array("in",$role_ids);
            $roles=$md->where($where)->select();
            $rule_ids=array();
            foreach(array_values($roles) as $role){
                $rule_ids=array_merge($rule_ids,$role['rules']);
            }
            $rule_ids=array_unique($rule_ids);
            $md=new AutoIncrementModel(Constants::$DB_AUTH_ACTION);
            $where=array();
            $where["_id"]=array("in",array_values($rule_ids));
            $where['status']=1;
            $where['_logic']='and';
            $action=$md->where($where)->order("seq asc")->select();
            $actions= array_values($action);
        }
        //所有用户都要加上个人设置的权限
        $actions[]= array(
            _id=>1098,name=>"Admin/Setting/index",title=>"个人设置",is_menu=>0,pid=>1000,seq=>1098,status=>1
        );
        $actions[]= array(
            _id=>109801,name=>"Admin/Setting/update",title=>"更新个人设置",is_menu=>0,pid=>1098,seq=>109801,status=>1
        );

        return $actions;


    }

    private function  checkMenus($actions){
        $menus=array();
        foreach($actions as $ac ){
            if($ac['is_menu']==1){
                $menus[]=$ac;
            }
        }
        return $menus;
    }

    private function getFirstAction($menus){
        foreach($menus as $menu){
            if($menu['name']){
                return $menu;
            }
        }
        return array(name=>"Admin/Setting/index",title=>"我的站点");
    }

    private function checkPermissions($actions){
        $permissions=array();
        foreach($actions as $ac){
            $name=strtolower($ac['name']);
            if($name){
                $permissions[]=$name;
            }
            if($ac['child_actions']){
                foreach($ac['child_actions'] as $c_ac){
                    if($c_ac['name']){
                        $permissions[]=strtolower($c_ac['name']);
                    }
                }
            }
        }
        return $permissions;
    }

    private function checkUser(){

        $verify_code=I("verify_code");
        if(!$verify_code){
            $this->ajaxReturn(array(code=>0,msg=>"验证码不能为空"));
        }
//        $verify =new Verify();
//        if(!$verify->check($verify_code)){
//            $this->ajaxReturn(array(code=>0,msg=>"验证码错误"));
//        }
        /** 校验验证码 */
        $username=I("username");
        //正式环境会校验密码
        if(C('CHECK_PHONECODE')){
            $currentCode = S($username."verify");
            if($currentCode){
                if($verify_code != $currentCode){
                    $this->ajaxReturn(array(code=>0,msg=>"验证码错误"));
                }
            } else {
                $this->ajaxReturn(array(code=>0,msg=>"验证码已过期，请重新获取"));
            }
        }

        $auth_user=new AutoIncrementModel(Constants::$DB_AUTH_USER);
        $row=$auth_user->where(array(username=>$username))->find();
        if(!$row){
            $this->ajaxReturn(array(code=>0,msg=>"登录失败,用户名或密码错误"));
        }

        // 验证是否被锁定
        if($row['isLock']){
            $this->ajaxReturn(array(code=>0,msg=>"用户被锁定，请联系管理员解锁"));
        }
        //密码验证
        if(I('password')!=$row['password']){//先不验证密码
            $this->saveLoginCount($row['_id'],$username);
            $this->ajaxReturn(array(code=>0,msg=>"登录失败,用户名或密码错误"));
        }

        $row['password']='';
        //清空缓存数据
        $this->clearCache();
        return $row;
    }

    /** 登录成功之后清空缓存数据 */
    private function clearCache(){
        $ip = get_client_ip();
        $username = I("username");
        S($ip."ipCount", 0, array('type'=>'file','expire'=>C('CHECK_TIME')));
        S($username."loginCount", 0, array('type'=>'file','expire'=>C('CHECK_TIME')));
        //因为校验ip都是每一次登录必须做的，避免最后一次成功登录，时将错误数据写入数据库，因此需要做删除操作
        $md=new StringModel(Constants::$DB_IP_BLACKLIST);
        $md->where(array(_id=>$ip,userName=>$username))->delete();
    }


    /** 校验ip是否合法，同一个ip在三分钟之内连续登录错误三次，将被加入黑名单 */
    private function checkIp(){
        $ip = get_client_ip();
        $ip_blacklist = new StringModel(Constants::$DB_IP_BLACKLIST);
        $iprow = $ip_blacklist->where(array(_id=>$ip))->find();
        if($iprow){
            $this->ajaxReturn(array(code=>0,msg=>"IP被限定，请联系管理员"));
        }
        $loginCount = S($ip."ipCount");
        if($loginCount){
            if($loginCount >= 3){ //封IP，将ip加入黑名单
                $this->sealIp($ip);
            }
            S($ip."ipCount", $loginCount + 1, array('type'=>'file','expire'=>C('CHECK_TIME')));
        } else {
            S($ip."ipCount", 1, array('type'=>'file','expire'=>C('CHECK_TIME')));
        }
    }



    /** 封ip，加入数据库表中 */
    private function sealIp($ip){
        $userName=I("username");
        $param=array(_id=>$ip,userName=>$userName,createTime=>date("Y-m-d H:i:s"));
        $md=new StringModel(Constants::$DB_IP_BLACKLIST);
        $md->save($param,array(upsert=>true));
    }

    //3分钟之内统一账号登录错误三次，锁定账号,存在的账号才需要锁定
    private function saveLoginCount($userId,$loginName){
        $loginCount = S($loginName."loginCount");
        if($loginCount){
            if($loginCount >= 3){ //锁定账号
                $this->lockUser($userId,1);
            }
            S($loginName."loginCount", $loginCount + 1, array('type'=>'file','expire'=>C('CHECK_TIME')));
        } else {
            S($loginName."loginCount", 1, array('type'=>'file','expire'=>C('CHECK_TIME')));
        }
    }


    /** $isLock 1：表示锁定；0表示未锁定 */
    private function lockUser($userId,$isLock){
        $param=array(_id=>$userId,isLock=>$isLock);
        $md=new AutoIncrementModel(Constants::$DB_AUTH_USER);
        $md->save($param,array(upsert=>true));
    }

    /** 发送手机验证码 */
    private function sendMsg(){
        $userName = I('username');
        if(!C('CHECK_PHONECODE')){
            S($userName."verify", 111111, array('type'=>'file','expire'=>180));
            $json['code'] = 1;
            $json['msg'] = "手机验证码发送成功请注意查收";
            return $json;
        }
        $row = $this->check_phone($userName);
        if(!$row){
            return array(code=>0,msg=>"非法手机号，请联系管理员");
        }
        $code = $this->randNum();
        $param = array();
        $params = array();
        $params['content'] = "你的登录验证码为".$code."，有效期为3分钟。如非本人操作，可不用理会。";
        $params['send'][0]["to"] = $userName;
        $params['send'][0]["addr"] = $userName;
        $param['type'] = 1;
        $param['params'] = json_encode($params);
        $json = http_post(C('MSG_SERVER_PATH'),$param,"json");
        if($json['code'] == 1){
            S($userName."verify", $code, array('type'=>'file','expire'=>180));
            $json['msg'] = "手机验证码发送成功请注意查收";
        } else {
            $json['msg'] = "手机验证码发送失败";
        }
        return $json;
    }

    /** 校验手机号是否合法，避免调用接口不停发送短信信息 */
    private function check_phone($userName){
        $auth_user=new AutoIncrementModel(Constants::$DB_AUTH_USER);
        $row=$auth_user->where(array(username=>$userName))->find();
        return $row;
    }

    /** 前端点击获取手机验证码，调用此方法 */
    public function verify(){
        //header("Content-Type: text/html; charset=utf-8");
        $userName = I('username');
        $currentCode = S($userName."verify");
        $json = array(code=>0,msg=>"手机验证码发送失败");
        //3分钟之内只允许发一次验证码
        if($currentCode){
            $json['code'] = 0;
            $json['msg'] = "三分钟内只允许获取一次验证码，请勿重复获取";
            $this->ajaxReturn($json);
        } else {
            $json = $this->sendMsg();
        }
        //dump($json);
        $this->ajaxReturn($json);
    }


    /** 生存6位的随机数 */
    public function randNum(){
        $arr=range(0,9);
        shuffle($arr);
        $result = "";
        foreach($arr as $values)
        {
            $result .= $values;
        }
        $result = substr($result,0,6);
        return $result;
    }

    public function verify_code(){
        $verify=new Verify();
        $verify->expire = 60;//有效期一分钟
        //$verify->useImgBg=true;//使用背景图片
        $verify->fontSize = 14;
        $verify->imageW = 0;
        $verify->imageH = 0;
        $verify->length = 4;
        $verify->useCurve = false;// 是否使用混淆曲线
        $verify->useNoise = true;// 是否添加杂点
//        $verify->useZh=true;
        // $verify->fontttf="cn.ttf";
        $verify->codeSet="0123456789";
        $verify->entry();

    }


    public function about(){
        $version=" 1.0.0";
        if(is_file("SVN_Build_REV")){
            $version=file_get_contents("SVN_Build_REV");
        }
        $this->ajaxReturn(array(version=>$version));
    }


    public function logout(){
        $data=array("code"=>1);
        Hook::listen("action_end",$data);
        session("user",null);
        session(null);
        $this->redirect("index");

    }

    /** 判断用户是否为系统管理员角色 */
    private function  checkSystemRole($user){
        $md=new AutoIncrementModel(Constants::$DB_AUTH_ROLE);
        if($user['_id'] == 1){
            return true;
        }
        $role_ids = $user['roles'];
        $where = array();
        $where["_id"] = array("in",$role_ids);
        $where["name"] = "系统管理员";
        $roles = $md->where($where)->select();
        if(!$roles){
            return false;
        } else {
            return true;
        }
    }

}