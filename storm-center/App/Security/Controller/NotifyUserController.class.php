<?php
namespace Security\Controller;
use Home\Controller\BaseController;
use Think\Controller;

class NotifyUserController extends BaseController {


    public function index(){
        $this->display("index");
    }

    public function toAdd(){
        $this->display("add");
    }

    public function toUpdate(){
        $param['USER_ID'] = I("u_id");
        $data = http_post(C('STORM_CENTER_PATH')."/security/queryNotifyUser", $param,'json');
        $this->assign('userId', I('u_id'));
        $this->assign('notifyUser', $data['other']['list'][0]);
        $this->display("update");
    }

    public function add(){
        $param['USER_NAME'] = I('userName');
        $param['USER_TYPE'] = I('userType');
        $param['USER_SEX'] = I('userSex');
        $param['USER_POSITION'] = I('userPosition');
        $param['USER_FIRM'] = I('userFirm');
        $param['USER_TEL'] = I('userTel');
        $param['USER_HANDSET'] = I('userHands');
        $param['USER_EMAIL'] = I('userEmail');
        $param['USER_WEIXIN'] = I('userWeixin');
        $param['USER_MIXIN'] = I('userMixin');
        $param['USER_QQ'] = I('userQQ');
        $param['NOTIFY_TYPE'] = I('notifyType');
        $user=session("user");
        $param['CREATE_USER'] = $user['username'];
        $param['LAST_MODIFY_USER'] = $user['username'];
        $param['REMARK'] = I("remark");
        $data = http_post(C('STORM_CENTER_PATH')."/security/addNotifyUser", $param,'json');
        if($data['code']){
            $this->ajaxReturn(array("code"=>1,"msg"=>"添加成功"));
        }else{
            $this->ajaxReturn(array("code"=>0,"msg"=>"添加失败"));
        }
    }

    public function update(){
        $param['USER_ID'] = I("userId");
        $param['USER_NAME'] = I('userName');
        $param['USER_TYPE'] = I('userType');
        $param['USER_SEX'] = I('userSex');
        $param['USER_POSITION'] = I('userPosition');
        $param['USER_FIRM'] = I('userFirm');
        $param['USER_TEL'] = I('userTel');
        $param['USER_HANDSET'] = I('userHands');
        $param['USER_EMAIL'] = I('userEmail');
        $param['USER_WEIXIN'] = I('userWeixin');
        $param['USER_MIXIN'] = I('userMixin');
        $param['USER_QQ'] = I('userQQ');
        $param['NOTIFY_TYPE'] = I('notifyType');
        $user=session("user");
        $param['CREATE_USER'] = $user['username'];
        $param['LAST_MODIFY_USER'] = $user['username'];
        $param['REMARK'] = I("remark");
        $data = http_post(C('STORM_CENTER_PATH')."/security/updateNotifyUser", $param,'json');
        if($data['code']){
            $this->ajaxReturn(array("code"=>1,"msg"=>"修改成功"));
        }else{
            $this->ajaxReturn(array("code"=>0,"msg"=>"修改失败"));
        }
    }

    public function delete(){

        $param['USER_ID'] = I('userId');
        $user=session("user");
        $param['LAST_MODIFY_USER'] = $user['username'];
        $data = http_post(C('STORM_CENTER_PATH')."/security/deleteNotifyUser", $param,'json');
        if($data['code']){
            $this->ajaxReturn(array("code"=>1,"msg"=>"删除成功"));
        }else{
            $this->ajaxReturn(array("code"=>1,"msg"=>"删除失败"));
        }

    }

    public function query(){
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        $param=I('param');
        $start = (I('currentpage') - 1) * I('limit');
        $limit = I('limit');
        $param['start'] = $start;
        $param['limit'] = $limit;
        if(I('is_DELETE') || I('is_DELETE') == 0){
            $param['is_DELETE'] = I('is_DELETE');
        }
        if(I('userName')){
            $param['USER_NAME'] = I('userName');
        }
//        var_dump($param);
        $data = http_post(C('STORM_CENTER_PATH')."/security/queryNotifyUser", $param,'json');
        if($data['code']){
            $result['code']=1;
            $result['total'] = $data['other']['count'];
            $result['rows'] = $data['other']['list'];
        }
        $this->ajaxReturn($result);
    }

    public function beatchDelete(){
        $param['ids'] = I('ids');
        $user=session("user");
        $param['user'] = $user['username'];
        $data = http_post(C('STORM_CENTER_PATH')."/security/beatchDeleteNotifyUser", $param,'json');

        if($data['code']){
            $this->ajaxReturn(array("code"=>1,"msg"=>"删除成功"));
        }else{
            $this->ajaxReturn(array("code"=>1,"msg"=>"删除失败"));
        }
    }
}