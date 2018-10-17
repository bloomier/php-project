<?php
namespace Admin\Controller;
use Home\Controller\AuthController;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;

class UserController extends BaseController {

    private function filter_keyword( $string ) {
        $keyword = 'select|insert|update|delete|\'|\/\*|\*|\.\.\/|\.\/|union|into|load_file|outfile';
        $arr = explode( '|', $keyword );
        $result = str_ireplace( $arr, '', $string );
        return $result;
    }

    public function index(){
        $this->display();

    }
    public function getUserById(){
        $model=new  Model();
        $user=$model->table(array(
            C('DB_PREFIX').'user'=>'user',
            C('DB_PREFIX').'role'=>'role'
        ))->where(array("user.role_id =role.id","user.id=".I("id")))
            ->field("user.id,user.username,user.name,user.email,user.login_type,role.id role_id,user.expired_date,user.is_lock,user.is_follow,user.province,user.city")->find();

        $this->ajaxReturn($user);

    }
    public function listUser(){
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        $model=new  Model();
        $query=array("user.role_id =role.id");
        $param=I('param');
        if($param){
            $param = $this->filter_keyword($param);
            $query[]="user.name like '%".$param."%' or user.username like '%".$param."%' or role.name like '%".$param."%' ";
        }

        $users=$model->table(array(
            C('DB_PREFIX').'user'=>'user',
            C('DB_PREFIX').'role'=>'role'
        ))->where($query)->order('user.id desc')
            ->field("user.id,user.username,user.name,user.email,user.login_type,role.name role_name,user.expired_date,user.is_lock,user.is_follow")->page(easyPage())->select();
        $total=$model->table(array(
            C('DB_PREFIX').'user'=>'user',
            C('DB_PREFIX').'role'=>'role'
        ))->where($query)->count();

        if($users){
            $result['code']=1;
            $result['rows']=$users;
            $result['total']=$total;
        }

        $this->ajaxReturn($result);
    }
    public function addOrUpdateUser(){
        $result['code']=0;
        $user=M('user');
        $id=I("id");

        $user->name=I("name");
        if(I("username")){
            $user->username=I("username");

        }
        $user->email=I("email");
        $user->login_type=I("login_type");
        $user->role_id=I("role_id");
        $user->is_lock=I("is_lock");
        $user->is_follow=I("is_follow");
        $user->province=I("province");
        $user->city=I("city");
        $expired_date = I("expired_date");

        if($expired_date == "" || strpos($expired_date, "0000")){
            $expired_date = null;
        } else{
            $user->expired_date=$expired_date;
        }
        $row=0;
        if($id){//修改
            if(I('password')){
                $user->password=I("password");
            }
            if($id!=1){
                $user->is_follow=I("is_follow");
                $row=$user->where(array("id"=>$id))->save();
            }
        }else{//添加
            $row=M("user")->where(array("username"=>I("username")))->find();
            if($row){
                $result['msg']="用户名已存在";
                $this->ajaxReturn($result);
            }
            $user->password=I("password");
            if($user->login_type == 0)
            $user->login_type = 2;
            $returnId=$user->add();
            if($returnId){
                $row=1;
            }
        }
        $result['code']=1;
        $result['msg']=$row.'条记录被'.($id?"修改":"添加");
        $this->ajaxReturn($result);


    }
    public function delete(){

        $map["id"]=array("in",I("ids"));

        $row=M("user")->where($map)->delete();
        $this->ajaxReturn(array("code"=>1,"msg"=>$row."条记录被删除"));

    }

    public function unLock(){
        $map["id"]=array("in",I("ids"));
        $data['is_lock'] = 0;

        $row=M("user")->where($map)->save($data);
        $this->ajaxReturn(array("code"=>1,"msg"=>$row."条记录被解锁"));
    }

    public function lock(){
        $map["id"]=array("in",I("ids"));
        $data['is_lock'] = 1;

        $row = M("user")->where($map)->save($data);
        $this->ajaxReturn(array("code"=>1,"msg"=>$row."条记录被锁定"));
    }

}