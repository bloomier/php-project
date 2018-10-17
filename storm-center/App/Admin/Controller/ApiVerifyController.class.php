<?php
/**
 * Created by PhpStorm.
 * User: ST
 * Date: 2015/8/4
 * Time: 11:21
 */

namespace Admin\Controller;
use Home\Controller\AuthController;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;

class ApiVerifyController extends BaseController {

    public function index(){
        $this->assign("all_province_config",C("ALL_PROVINCES"));
        $this->display();
    }

    //添加或者修改
    public function addOrUpdateApi(){

        $result['code']=0;
        $api_key=M('api_key');
        $key=I("key");
        // dump($key);
        $api_key->name=I("name");
        $api_key->rules=I("rules");
        $api_key->title=I("title");
        $api_key->province=I("province");
        $api_key->hour_count=I("hour_count");
        if($key){//修改
            $api_key->where(array("`key`='".$key."'"))->save();
        }else{

            $api_key->key=str_replace("}","",str_replace("{","",uuid()));
            $api_key->key_pass=str_replace("}","",str_replace("{","",uuid()));
//            $api_key->key=substr(uuid(),1,strlen(uuid()) - 2);
//            $api_key->key_pass=substr(uuid(),1,strlen(uuid()) - 2);
            $api_key->add();
        }
        $result['code']=1;
        $result['msg']=($key?"修改":"添加")."成功";
        $this->ajaxReturn($result);
    }

    // 获取所有记录
    public function listApi(){
        $result['code']=0;
        $where=array("1=1");
        $param=I("param");
        if($param){
            $where[]="`key` like '%".$param."%' or province like '%".$param."%' or title like '%".$param."%'";
        }
        $roles=M("api_key")->page(easyPage())->where($where)->select();
        $total=M("api_key")->where($where)->count();
        if($roles){
            $result['code']=1;
            $result['rows']=$roles;
            $result['total']=$total;
        }

        $this->ajaxReturn($result);
    }

    // 通过key获取其中一条记录
    public function getApiByKey(){
        $key = I("key");
        $role=M("api_key")->where(array("`key`='".$key."'"))->find();
        $this->ajaxReturn($role);
    }

    // 获取所有API接口，用于生存树
    public function listAllApiGroup(){
        $rules=M('api_rule')->select();
        $rules=data_merage($rules);
        $this->ajaxReturn($rules);
    }

    // 删除
    public function delete(){
        $map["key"]=array("in",I("keys"));
        $row=M("api_key")->where($map)->delete();
        $this->ajaxReturn(array("code"=>1,"msg"=>$row."条记录被删除"));
    }
} 