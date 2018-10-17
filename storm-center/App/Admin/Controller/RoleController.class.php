<?php
namespace Admin\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;


class RoleController extends BaseController {

    public function index(){
        $this->display();
    }
    public function listRole(){
        $result['code']=0;
        $where=array("1=1");
        $param=I("param");
        if($param){
            $where[]="name like '%".$param."%'";
        }
        $roles=M("role")->page(easyPage())->where($where)->select();
        $total=M("role")->where($where)->count();
        if($roles){
            $result['code']=1;
            $result['rows']=$roles;
            $result['total']=$total;
        }

        $this->ajaxReturn($result);
    }
    public function getRoleById(){
        $model=new  Model();
        $role=$model->table(array(
            C('DB_PREFIX').'role'=>'role',
            C('DB_PREFIX').'auth_group_access'=>'access',
        ))->where(array("role.id=access.uid","role.id=".I("id")))->field("role.id,role.name,group_concat(access.group_id) groups")->find();
        $this->ajaxReturn($role);
    }
    public function listAllRoleGroup(){
        $mType_groups=array(1=>"公共模块",2=>"大数据搜索平台",3=>"安全事件",4=>"自助报告",8=>"MSSP平台",6=>"云观测数据中心",7=>"运营中心");
        $groups= M('auth_group')->order("seq")->select();
        //$moudelGroups=array();
        $moudels=array();
        $optGroups=array();
        foreach($groups as $g){
            if($g['type']==0){
                foreach($mType_groups as $key=>$value){
                    //$mTypeName=$value;
                    if($g['m_type']==$key){
                        $moudels[$value][]= $g;
                    }


                }
            }else if($g['type']==1){
                $optGroups[]=$g;
            }
        }
       $mergedMoudels=array();
        foreach($moudels as $key=>$value){
            $mergedMoudels[$key]=data_merage($value);

        }

       $arr=array("moudels"=>$mergedMoudels,"opts"=>data_merage($optGroups));
       $this->ajaxReturn($arr);

       // dump($arr);
    }
    public function addOrUpdateRole(){
        $result['code']=0;
        $role=M('role');
        $id=I("id");
        $role->name=I("name");
        $row=0;
        if($id){//修改
            $role->where(array("id"=>$id))->save();
            M('auth_group_access')->where(array("uid"=>$id))->delete();
            $this->addGroupAccess($id);



        }else{
            $row=M("role")->where(array("name"=>I("name")))->find();
            if($row){
                $result['msg']="角色名已存在";
                $this->ajaxReturn($result);
            }
            $returnId=$role->add();
            //添加group_access
            $this->addGroupAccess($returnId);


        }
        $result['code']=1;
        $result['msg']=($id?"修改":"添加")."成功";
        $this->ajaxReturn($result);
    }
    private function addGroupAccess($roleId){
        $groupIds = explode(',',I("groups"));
        $groupList=array();
        foreach($groupIds as $gid){
            $groupList[]=array("uid"=>$roleId,"group_id"=>$gid);
        }
        M('auth_group_access')->addAll($groupList);
    }

    public function listAllRole(){
        $roles=M("role")->select();
        $this->ajaxReturn($roles);
    }
    public function delete(){
        $map["id"]=array("in",I("ids"));
        $row=M("role")->where($map)->delete();
        if($row){
            $accessMap['uid']=array("in",I("ids"));
            M('auth_group_access')->where($accessMap)->delete();
        }

        $this->ajaxReturn(array("code"=>1,"msg"=>$row."条记录被删除"));    }


}