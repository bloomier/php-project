<?php
namespace Admin\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;


class AuthGroupController extends Controller {

    public function index(){
        $this->display('index');
    }

    public function listAuthGroup(){
        $result['code']=0;
        $where=array("1=1");
        $param=I("param");
        if($param){
            $where[]="title like '%".$param."%'";
        }
        $roles=M("auth_group")->page(easyPage())->where($where)->select();
        $total=M("auth_group")->where($where)->count();
        if($roles){
            $result['code']=1;
            $result['rows']=$roles;
            $result['total']=$total;
        }
        $this->ajaxReturn($result);
    }

    public function listAllAuthGroup(){
        $result['code']=0;
        $where=array("1=1");
        $roles=M("auth_group")->where($where)->select();
        if($roles){
            $result['code']=1;
            $result['rows']=$roles;
        }
        $this->ajaxReturn($result);
    }

    public function addOrUpdateRole(){
        $result['code']=0;
        $group=M('auth_group');
        $id=I("id");
        $group->title=I("name");
        $group->status=1;
        $group->rules=I('rules');
        $group->pid=I('pid');
        $group->type=I('0');
        $group->page_action=I('page_action');
        $group->m_type=I('m_type');
        $group->seq=I('seq');
        $row=0;
        if($id){//修改
            $group->where(array("id"=>$id))->save();
        }else{
            $returnId=$group->add();
            if($returnId){
                $row=1;
            }
        }
        $result['code']=1;
        $result['msg']=($id?"修改":"添加")."成功";
        $this->ajaxReturn($result);
    }

    public function delete(){

        $map["id"]=array("in",I("ids"));

        $row=M("auth_group")->where($map)->delete();
        $this->ajaxReturn(array("code"=>1,"msg"=>$row."条记录被删除"));

    }

    public function getRoleById(){
        $group=M("auth_group")->where(array("id=".I("id")))->select();
        $this->ajaxReturn($group);
    }

}