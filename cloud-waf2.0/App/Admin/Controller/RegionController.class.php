<?php
namespace Admin\Controller;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;
use Common\Vendor\Util;
use Think\Controller;
use Think\Model\MongoModel;

class RegionController extends Controller {
    /**
     * 域管理
     */
    public function _initialize(){
        if(session('?user')){
            $user=session("user");
            $actionName=strtolower(ACTION_NAME);
            if($actionName=='listall'||$actionName=='currentregion'||$actionName=='switchregion'){//着3个action在全局用户切换域的时候 应该是有权限的
                if(!is_global_user()){
                    $this->error("对不起,您不是超级用户");
                }
            }else{
                if($user['username']!='dbapp'){
                    $this->error("对不起,您不是admin用户");
                }
            }

            $this->assign("user",$user);
        }else{
            $this->
            $this->error("对不起,您还没有登录","Admin/Login/index");
        }
    }
    public function index(){
        change_db_main();

        $this->assign("deletable",C('REGION_DELETE')?1:0);
        $this->display('./page/region');
    }
    public function editPage(){
        if(I("_id")){
            $md=new AutoIncrementModel(Constants::$DB_REGION);
            $this->assign("_id",intval(I("_id")));
            $this->assign("update",1);
            $this->assign("region",$md->where(array(_id=>intval(I("_id"))))->find());
        }
        $this->display('./page/region_edit');
    }

    /**
     * 添加/修改域
     */
    public function addOrUpdate(){
        change_db_main();
        $md=new AutoIncrementModel(Constants::$DB_REGION);
        $param=I();
        $ret=array("code"=>1,"msg"=>"操作成功");
        $addOpt=false;
        if(!I("_id")){//添加
            $addOpt=true;
            $param["_id"]=$md->getMongoNextId();
            $param['location']=array(province=>I("province"),city=>I("city"),district=>I("district"),location_type=>intval(I("location_type")));
            if(I('domain_suffix')){
                $param['domain_suffix']=explode(",",I('domain_suffix'));
            }else{
                $param['domain_suffix']=array();
            }

            $param['init']=intval(I('need_init'));
        }else{
            $param["_id"]=intval(I("_id"));
            unset($param['name_en']);
            unset($param['domain_suffix']);
        }
        unset($param['province']);
        unset($param['city']);
        unset($param['district']);
        unset($param['location_type']);
        unset($param['need_init']);
//        $this->ajaxReturn($param);

        $where=array();
        $where['name_en'] = I("name_en");
        $where['_id'] = array("neq",$param["_id"]);
        $where['_logic'] = 'and';
        $exist=$md->where($where)->find();
        if($exist){
            $ret['where']=$where;
            $ret['exist']=$exist;
            $ret['code']=0;
            $ret['msg']="操作失败,已经存在的域名称";
            $this->ajaxReturn($ret);
        }
        $row=$md->save($param,array(upsert=>true));
        $ret['item']=$md->where(array(_id=>$param['_id']))->find();
        if(!$row){
            $ret['code']=0;
            $ret['msg']="操作失败";
        }else{
            if($addOpt){//自动添加域管理员
                $msg= $this->addRegionManager($param);
                $ret['add']=1;
                $ret['msg']=$msg;
            }
        }

        $this->ajaxReturn($ret);
    }


    private function addRegionManager($region){
        change_db_main();
        $md=new StringModel(Constants::$DB_USER_RELATION_REGION);
        $username=$region['name_en'].'_manager';
        $exist=$md->where(array(username=>$username))->find();
        if($exist){
            return "域添加成功,警告!域管理员添加失败,已经存在的用户名。";
        }else{
            $md=new StringModel(Constants::$DB_USER_RELATION_REGION);
            $md->save(array(_id=>$username,region=>$region['_id']),array(upsert=>true));
            change_db($region['_id']);
            $md=new AutoIncrementModel(Constants::$DB_AUTH_USER);
            $util=new Util();
            $randPwd=$util->randChar(10);
            $user=array(username=>$username,name=>"管理员",is_manager=>1,password=>md5($randPwd), phone=>I("phone"));
            $md->add($user);
            return "添加成功,管理员:".$username.",初始密码：".$randPwd;
        }
    }
    public function resetManagerPwd(){
        if(!I("_id")){
            $this->ajaxReturn(array(code=>0,msg=>"不存在域"));
        }
        $region_id=intval(I("_id"));
        $param=array();
        $param["_id"]=1;
        $util=new Util();
        $randPwd=$util->randChar(10);
        $param['password']=md5($randPwd);
        change_db($region_id);
        $md=new AutoIncrementModel(Constants::$DB_AUTH_USER);
        $md->save($param,array(upsert=>true));
        $this->ajaxReturn(array(code=>1,msg=>"重置成功,管理员新密码:".$randPwd));
    }


    /**
     * 查询域
     */
    public function listAll(){
        change_db_main();
        $md=new AutoIncrementModel(Constants::$DB_REGION);
        $where['init'] = array("gte",0);
        $rows=$md->where($where)->order("_id asc")->select();
        if(!$rows){
            $rows=array();
        }
        $this->ajaxReturn(array_values($rows));

    }
    public function findById(){
        change_db_main();
        $md=new AutoIncrementModel(Constants::$DB_REGION);
        $row=$md->where(array(_id=>intval(I("_id"))))->find();
        $this->ajaxReturn($row);
    }
    public function currentRegion(){
        $region_id=current_region_id();
        change_db_main();
        $md=new AutoIncrementModel(Constants::$DB_REGION);
        $row=$md->where(array(_id=>$region_id))->find();
        $this->ajaxReturn($row);
    }
    public function switchRegion(){
        $ret=array(code=>0);
        $region_id=I("region_id");
        if($region_id){
            $user=session("user");
            $user['region_id']=intval($region_id);
            session("user",$user);
            $ret['code']=1;
        }
        $this->ajaxReturn($ret);

    }

    public function delete(){
        $_id=I("_id");
        if($_id&&intval($_id)!=1){
            change_db($_id);
            $dbName=current_db();

            echo "drop database:".$dbName."<br>";
            $md=new MongoModel();
            $db=$md->getDB();
            $db->drop();
            change_db_main();
            $md=new AutoIncrementModel(Constants::$DB_REGION);
            $region=$md->where(array(_id=>intval($_id)))->find();
            if($region){
                $username=$region['name_en'].'_manager';
                echo "delete user_r_relation:".$username."<br>";

                $md=new StringModel(Constants::$DB_USER_RELATION_REGION);
                $md->where(array(_id=>$username))->delete();

                echo "delete region:".$region['_id']."<br>";
                $md=new AutoIncrementModel(Constants::$DB_REGION);
                $md->data(array(_id=>intval($_id),init=>-1))->save();
//                $md->where(array(_id=>intval($_id)))->delete();
            }
        }








        //$this->ajaxReturn($result);
    }





}