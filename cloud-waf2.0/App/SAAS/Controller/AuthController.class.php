<?php
namespace SAAS\Controller;
use Common\Model\AutoIncrementModel;
use Common\Vendor\Constants;
use Common\Vendor\UserVerify;
use Common\Vendor\Util;
use Think\Controller\RestController;
use Think\Hook;
use Think\Controller;

/**
 * Class WebSurveyController
 * @package API\Controller
 * 网站普查的一些接口
 */
class AuthController extends RestController {

    public function _initialize(){
        $data=I();
        ksort($data);
        $arr=array();
        foreach($data as $k=>$v){
            if($k!='token'){
                $arr[]=($k."=".urldecode($v));
            }
        }
        $arr[]="key=".C("SAAS_KEY");
        $xtoken=join("&",$arr);
        $xtoken=md5($xtoken);
//        dump($xtoken);
        if($xtoken!=I('token')){
           $this->__404__();
        }
    }
    private function __404__(){
        $ret=array(code=>0);
        Hook::listen("action_end",$ret);
        header('HTTP/1.1 404 Not Found');
        header('status: 404 Not Found');
        exit();
    }
    public function index(){
        $action=I("action");
        if($action){
            $this->$action();
        }else{
            $this->__404__();
        }


    }

    private function createInstance(){//创建实例
        //定义一张表 saas_refrect
        $aliUid =I('aliUid');
        $orderBizId=I('orderBizId');
        $mobile=I("mobile");
        $count=intval(I('accountQuantity'));
        if(!$count){
            $count=1;
        }
        if(!$aliUid||!$orderBizId){
            $ret=array(instanceId=>0);
            $this->ajaxReturn($ret);
        }
        $md=new AutoIncrementModel(Constants::$DB_SAAS_REFLECT);
        $exists=$md->where(array(instanceId =>$orderBizId))->find();
        if($exists){//幂等输出
            $ret=array(instanceId=>$exists['instanceId'],appInfo=>array("authUrl"=>"http://admin.dbappwaf.cn/index.php/SAAS/Auth/index"));
            $this->ajaxReturn($ret);
        }else{
            /**
             * 处理用户生成等逻辑
             */
            /**
             * 这块如果异常 输出instanceId=>0
             */
            $md=new AutoIncrementModel(Constants::$DB_SAAS_REFLECT);
            $_id=$md->getMongoNextId();
            $data=array(_id=>$_id,aliUid=>$aliUid,instanceId=>$orderBizId,orderId=>I('orderId'),skuId=>I('skuId'),
                domainCount=>$count,mobile=>$mobile,email=>I("email"),expiredOn=>I("expiredOn"),createTime=>date("Y-m-d h:i:s")
            );
            $md->save($data,array(upsert=>true));
            //创建一个响应的用户，这个用户是无法通过登录页来登录的
            $umd=new AutoIncrementModel(Constants::$DB_AUTH_USER);
            $exists2=$umd->where(array(username =>$aliUid))->find();
            if(!$exists2){
                $_id=$umd->getMongoNextId();
                $user=array(_id=>$_id,username=>$aliUid,name=>$aliUid,roles=>array(4));
                $umd->save($user,array(upsert=>true));
            }
            //这里需要发送一条短信和邮件 通知玄武盾管理员联系用户 添加站点 数量为I('accountQuantity') 并且这个表的数据可以在页面中查看
            $this->sendMsg();
            $ret=array(instanceId=>$orderBizId,appInfo=>array("authUrl"=>"http://admin.dbappwaf.cn/index.php/SAAS/Auth/index"));
            $this->ajaxReturn($ret);


        }

    }


    /** 收到订单信息，然后通知值班人员联系客户添加相应站点 */
    private function sendMsg(){
        $content = "请您联系以下玄武盾客户，电话:".I('mobile').'，然后帮助其添加'.I('accountQuantity').'个站点，并添加站点关注人为:'.I('aliUid').'，谢谢！';
        $this->sendOneMsg($content, C('MSG_USER.name'), C('MSG_USER.phone'), 1);
        $this->sendOneMsg($content, C('MSG_USER.name'), C('MSG_USER.email'), 4);
    }



    /**
     * $content 发送内容
     * $sendTo  发送给谁
     * $sendAddr 发送地址（短信密信就是手机号；邮件就是邮箱地址）
     * $type 发送类型（1：表示短信，2：表示密信；4：表示邮件）
     */
    private function sendOneMsg($content, $sendTo, $sendAddr, $type){
        $param = array();
        $params = array();
        $params['content'] = $content;
        if($type == 4){
            $params['subject'] = '玄武盾阿里订单通知';
        }
        $params['send'][0]["to"] = $sendTo;
        $params['send'][0]["addr"] = $sendAddr;
        $param['type'] = $type; //1：表示短信，2：表示密信；4：表示邮件
        $param['params'] = json_encode($params);
        $param['sign'] = 'A_LI_YUN_REPORT';
        $json = http_post(C('MSG_SERVER_PATH'),$param,"json");
//        if($json['code'] == 1){
//            $json['msg'] = "手机验证码发送成功请注意查收";
//        } else {
//            $json['msg'] = "手机验证码发送失败";
//        }
        return $json;
    }


    private function renewInstance(){//续费实例
        $instanceId=I('instanceId');
        $expiredOn=I("expiredOn");
        if(!$instanceId||!$expiredOn){
            $this->ajaxReturn(array("success"=>"false"));
        }
        $md=new AutoIncrementModel(Constants::$DB_SAAS_REFLECT);
        $exists=$md->where(array(instanceId =>$instanceId))->find();
        if(!$exists){
            $this->ajaxReturn(array("success"=>"false"));
        }
        $exists['expiredOn']=$expiredOn;
        $md->save($exists,array(upsert=>"true"));
        $this->ajaxReturn(array("success"=>"true"));

    }
    private function expiredInstance(){//过期实例
        $instanceId=I('instanceId');
        if(!$instanceId){
            $this->ajaxReturn(array("success"=>"false"));
        }
        $md=new AutoIncrementModel(Constants::$DB_SAAS_REFLECT);
        $exists=$md->where(array(instanceId =>$instanceId))->find();
        if(!$exists){
            $this->ajaxReturn(array("success"=>"false"));
        }
        $exists['locked']=1;
        $md->save($exists,array(upsert=>true));

        $this->ajaxReturn(array("success"=>"true"));
    }

    private function releaseInstance(){//释放实例
        $instanceId  =I('instanceId');
        $md=new AutoIncrementModel(Constants::$DB_SAAS_REFLECT);

        $exists=$md->where(array(instanceId =>$instanceId))->find();
        if(!$exists){
            $this->ajaxReturn(array("success"=>"true"));
        }

        $md->where(array(instanceId =>$instanceId))->delete();
        if($exists){
            $uid=$exists['aliUid'];
            $umd=new AutoIncrementModel(Constants::$DB_AUTH_USER);
            $umd->where(array(username =>$uid))->delete();
        }

        $this->ajaxReturn(array("success"=>true));

    }

    private function verify(){//免登认证
        $instanceId  =I('instanceId');
        if(!$instanceId){
            $this->__404__();
        }
//        if(session("?user")){
//            $user=session("user");
//            $firstAction= $user['firstAction'];
//            $this->redirect($firstAction);
//        }
        $md=new AutoIncrementModel(Constants::$DB_SAAS_REFLECT);
        $exists=$md->where(array(instanceId =>$instanceId))->find();
        if(!$exists){
            $this->__404__();
        }
        $uid=$exists['aliUid'];
        $md=new AutoIncrementModel(Constants::$DB_AUTH_USER);
        $user=$md->where(array(username=>$uid))->find();
        if(!$user){
            $this->__404__();
        }
        $userVerify=new UserVerify();
        $actions=$userVerify->checkActions($user,false);
        $permissions=$userVerify->checkPermissions($actions);
        $menus=$userVerify->checkMenus($actions);
        $firstAction=$userVerify->getFirstAction($menus);
        $user['actions']=$permissions;
        $util=new Util();
        $user['menus']=$util->data_merge($menus);
        $user['firstAction'] = $firstAction;
        //登录进去后去掉关于和退出系统菜单
        $user['isShow'] = 1;
        session("user",$user);
        $this->redirect($firstAction);



    }


}