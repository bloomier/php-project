<?php
namespace Admin\Controller;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;
use Common\Vendor\Util;
use Think\Controller;

class UserController extends BaseController {
    public function index(){
        $this->display('./page/user');
    }

    public function addOrUpdate(){

        $param=I();
        $roles=array();
        foreach(explode(",",I("roles"))as $r){
            $roles[]=intval($r);
        }
        $param['roles']=$roles;
        if(!I("_id")) {//添加

            $md=new AutoIncrementModel(Constants::$DB_AUTH_USER);
            $exist=$md->where(array(username=>I("username")))->find();
            if($exist){
                $this->ajaxReturn(array("code"=>0,"msg"=>"添加失败,已经存在用户名"));
            }
            $param["_id"]=$md->getMongoNextId();
            $util=new Util();
            $randPwd=$util->randChar(10);
            $param["password"]=md5($randPwd);
            $row=$md->add($param);
            $ret=array("code"=>1,"msg"=>"添加成功");
            $ret['item']=$param;
            if(!$row){
                $ret['msg']="添加失败";
            }
            $ret['randPwd']=$randPwd;
            $this->ajaxReturn($ret);
        }else{//修改
            $param["_id"]=intval(I("_id"));
            unset($param['username']);
            $md=new AutoIncrementModel(Constants::$DB_AUTH_USER);
            $ret=array("code"=>1,"msg"=>"修改成功");
            $row=$md->save($param);
            if(!$row){
                $ret['msg']="修改失败";
            }else{
                $ret['item']=$md->where(array(_id=> $param["_id"]))->find();
            }
            $this->ajaxReturn($ret);
        }

    }


    public function listAll(){
        $md=new AutoIncrementModel(Constants::$DB_AUTH_USER);
        $row=$md->field("_id,username,name,roles,email,phone,is_manager,isLock")->select();
        $this->ajaxReturn(array_values($row));
    }
    public function resetPwd(){
        if(!I("_id")){
            $this->ajaxReturn(array("code"=>0,"msg"=>"不存在的用户"));
        }
        $util=new Util();
        $randPwd=$util->randChar(10);
        $param=array(_id=>intval(I("_id")),password=>md5($randPwd));
        $md=new AutoIncrementModel(Constants::$DB_AUTH_USER);
        $md->save($param,array(upsert=>true));
        $this->ajaxReturn(array(code=>1,msg=>"重置成功,该用户的新密码:".$randPwd));
    }
    public function delete(){
        $md=new AutoIncrementModel(Constants::$DB_AUTH_USER);
        if(!I("_id")){
            $this->ajaxReturn(array("code"=>0,"msg"=>"删除失败,_id不能为空"));
        }
        $_id=intval(I('_id'));
        $user=$md->where(array(_id=>$_id))->find();
        if($user['is_manager']==1){
            $this->ajaxReturn(array("code"=>0,"msg"=>"删除失败,管理员账户不能被删除"));
        }
        $md->where(array(_id=>$_id))->delete();
        $ret=array("code"=>1,"msg"=>"删除成功");
        $this->ajaxReturn($ret);

    }

    //锁定or解锁用户 $isLock 1：表示锁定；0表示未锁定
    public function lockUser(){
        if(!I("_id")){
            $this->ajaxReturn(array("code"=>0,"msg"=>"不存在的用户"));
        }
        $param=array(_id=>I("_id"),isLock=>I("isLock"));
        $md=new AutoIncrementModel(Constants::$DB_AUTH_USER);
        $md->save($param,array(upsert=>true));
        $this->ajaxReturn(array("code"=>0,"msg"=>"解锁成功"));
    }







}