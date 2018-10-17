<?php
namespace Security\Controller;
use Home\Controller\BaseController;
use Think\Controller;

class NotifyGroupController extends BaseController {


    public function index(){
        $this->display();

    }

    public function toAdd(){
        $this->display("add");
    }

    public function toUpdate(){
        $param['groupId'] = I("groupId");
        $data = http_post(C('STORM_CENTER_PATH')."/security/queryNotifyGroupById", $param,'json');
        $this->assign("notifyGroupId", I("groupId"));
        $this->assign('notifyGroup', $data['other']);
        $this->display("update");
    }

    public function query(){
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        $param['groupName']=I('groupName');
        $param['isDeleted'] = 0;
        $start = (I('currentpage') - 1) * I('limit');
        $limit = I('limit');
        $param['start'] = $start;
        $param['limit'] = $limit;
        $data = http_post(C('STORM_CENTER_PATH')."/security/queryNotifyGroup", $param,'json');
        if($data['code']){
            $result['code']=1;
            $result['total'] = $data['other']['count'];
            $result['rows'] = $data['other']['list'];
        }
        $this->ajaxReturn($result);
    }

    public function queryUserGroup(){
        $param['groupId'] = I('groupId');
        $data = http_post(C('STORM_CENTER_PATH')."/security/queryNotifyUserGroup", $param,'json');
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        if($data['code']){
            $result['code']=1;
            $result['rows'] = $data['items'];
        }
        $this->ajaxReturn($result);
    }

    public function add(){
        $param['isDeleted'] = 0;
        $param['groupName'] = I('groupName');
        $param['groupPinyin'] = I('groupPinyin');
        $param['groupType'] = I('groupType');
        $param['notifyTarget'] = I('province')."-".I('city');
        $param['remark'] = I('remark');
//        var_dump(I('subList'));
        $param['notifyUserIds'] = I('subList');
        $user=session("user");
        $param['createUser'] = $user['username'];
        $param['lastModifyUser'] = $user['username'];
        $data = http_post(C('STORM_CENTER_PATH')."/security/addNotifyGroup", $param,'json');
        if($data['code']){
            $this->ajaxReturn(array("code"=>1,"msg"=>"添加成功"));
        }else{
            $this->ajaxReturn(array("code"=>0,"msg"=>"添加失败"));
        }
    }

    public function update(){
        $param['groupId'] = I('groupId');
        $param['groupName'] = I('groupName');
        $param['groupPinyin'] = I('groupPinyin');
        $param['groupType'] = I('groupType');
        $param['notifyTarget'] = I('province')."-".I('city');
        $param['remark'] = I('remark');
//        var_dump(I('subList'));
        $param['notifyUserIds'] = I('subList');
        $user=session("user");
        $param['createUser'] = $user['username'];
        $param['lastModifyUser'] = $user['username'];
        $data = http_post(C('STORM_CENTER_PATH')."/security/updateNotifyGroup", $param,'json');
        if($data['code']){
            $this->ajaxReturn(array("code"=>1,"msg"=>"添加成功"));
        }else{
            $this->ajaxReturn(array("code"=>0,"msg"=>"添加失败"));
        }
    }

    public function delete(){
        $param['groupId'] = I('groupId');
        $param['groupName']=I('groupName');
        $user=session("user");
        $param['lastModifyUser'] = $user['username'];
        $data = http_post(C('STORM_CENTER_PATH')."/security/deleteNotifyGroup", $param,'json');
        if($data['code']){
            $this->ajaxReturn(array("code"=>1,"msg"=>"添加成功"));
        }else{
            $this->ajaxReturn(array("code"=>0,"msg"=>"添加失败"));
        }
    }

    public function beatchDelete(){
        $param['ids'] = I('ids');
        $user=session("user");
        $param['user'] = $user['username'];
        $data = http_post(C('STORM_CENTER_PATH')."/security/beatchDeleteNotifyGroup", $param,'json');

        if($data['code']){
            $this->ajaxReturn(array("code"=>1,"msg"=>"删除成功"));
        }else{
            $this->ajaxReturn(array("code"=>1,"msg"=>"删除失败"));
        }
    }
}