<?php
namespace Admin\Controller;
use Common\Model\AutoIncrementModel;
use Common\Vendor\Constants;
use Think\Controller;

class RoleController extends BaseController {
    public function index(){
//        dump(current_db());
        $this->display('./page/role');
    }
    public function  addOrUpdate(){
        $md=new AutoIncrementModel(Constants::$DB_AUTH_ROLE);
        $param=I();
        $ret=array("code"=>1,"msg"=>"操作成功");
        if(!I('rules')){
            $this->ajaxReturn(array("code"=>0,"msg"=>"操作失败,请选择角色权限"));
        }
        $rules=array();
        foreach(explode(",",I("rules"))as $r){
            $rules[]=intval($r);
        }
        $param['rules']=$rules;

        if(!I("_id")) {//添加
            $param["_id"]=$md->getMongoNextId();
        }else{
            $param["_id"]=intval(I("_id"));
        }
        $where=array();
        $where['name'] = I("name");
        $where['_id'] = array("neq",$param["_id"]);
        $where['_logic'] = 'and';
        $exist=$md->where($where)->find();
        if($exist){
            $ret['code']=0;
            $ret['msg']="操作失败,已经存在的角色名称";
            $this->ajaxReturn($ret);
        }
        $row=$md->save($param,array(upsert=>true));
        $ret['item']=$param;
        if(!$row){
            $ret['msg']="操作失败";
        }
        $this->ajaxReturn($ret);

    }

    public function listAll(){
        $md=new AutoIncrementModel(Constants::$DB_AUTH_ROLE);
        $row=$md->select();
        $this->ajaxReturn(array_values($row));
    }
    public function delete(){
        $md=new AutoIncrementModel(Constants::$DB_AUTH_ROLE);

        if(!I("_id")){
            $this->ajaxReturn(array("code"=>0,"msg"=>"删除失败,_id不能为空"));
        }
        $_id=intval(I('_id'));
        $row=$md->where(array(_id=>$_id))->delete();
        if($row['n']){
            $this->ajaxReturn(array("code"=>1,"msg"=>"删除成功"));
        } else {
            $this->ajaxReturn(array("code"=>0,"msg"=>"删除失败，不存在角色_id"));
        }

    }
    public function listActions(){
        $md=new AutoIncrementModel(Constants::$DB_AUTH_ACTION);
        $rows=$md->where(array("status"=>1))->order("seq asc")->select();
//        $data=data_merage($rows);
        $this->ajaxReturn(array_values($rows));

    }






}