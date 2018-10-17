<?php
namespace Base\Controller;
use Admin\Controller\BaseController;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;

/**
 * Class ClientController
 * @package Base\Controller
 * 合同信息
 */
class ContractController extends BaseController {


    private function test(){
        //header("Content-Type: text/html; charset=utf-8");
    }

    /**  进入列表 */
    public function index(){
        $this->display("contractList");
    }


    /** 进入新增或者修改页面 */
    public function addUpdatePage(){
        $this->getcurrentObject();
        $this->display("clientAddUpdate");
    }

    /** 获取当前被编辑对象 */
    public function getcurrentObject(){
        $_id = I('_id');
        if($_id){
            $md = new AutoIncrementModel(Constants::$DB_CONTRACT_LIST);
            $row = $md->where(array(_id=>$_id))->find();
            if ($row) {
                $this->assign("currentObject", urlencode(json_encode($row)));
            }
        }
    }

    /**
     * 查询所有系统角色的用户，以及该站点关注的用户
     * 目前直接查询所有用户，避免未关注的时候不能选择
     */
    public function listUser(){
        //header("Content-Type: text/html; charset=utf-8");
        $model=new AutoIncrementModel(Constants::$DB_AUTH_USER);
        $map['username'] = array('$exists'=>true, '$not'=>array('$in'=>array("dbapp")) );
        $users = $model->field("_id,username,name,email")->where($map)->select();
        $list = array();
        foreach($users as $k=>$row){
            $list[]=$row;
        }
        $this->ajaxReturn(array(code=>1,items=>$list));
    }

    public function listSeller(){
        $md = new AutoIncrementModel(Constants::$DB_SELLER_LIST);
        $sellers = $md->field("_id,phone_num,name,email")->where(array(state=>"1"))->select();
        $list = array();
        foreach($sellers as $k=>$row){
            $list[]=$row;
        }
        $this->ajaxReturn(array(code=>1,items=>$list));
    }

    public function listClient(){
        $md = new AutoIncrementModel(Constants::$DB_CLIENT_LIST);
        $clients = $md->field("_id,phone_num,name,email")->where(array(state=>"1"))->select();
        $list = array();
        foreach($clients as $k=>$row){
            $list[]=$row;
        }
        $this->ajaxReturn(array(code=>1,items=>$list));
    }

    /** 添加或者修改  */
    public function addOrUpdate(){
        $md = new AutoIncrementModel(Constants::$DB_CONTRACT_LIST);
        if(I('_id')){
            $_id = I('_id');
        } else {
            $_id = $md->getMongoNextId();
        }
        $where = array();
        $where['no'] = I('no');
        //$where['_logic'] = 'and';
        $where['state'] = 1;
        $where['_id'] = array('$ne'=>intval($_id));
        //先判断该ip是否已经存在
        $rows = $md->where($where)->select();
        if($rows){
            $this->ajaxReturn(array(msg=>'该合同编号已存在', code=>0));
        }

        $params = array();
        $params['_id'] = $_id;
        $params['no'] = I('no');
        $params['name'] = I('name');
        $params['client'] = I('client');
        $params['begin_date'] = I('begin_date');
        $params['end_date'] = I('end_date');
        $params['project_manager'] = I('project_manager');
        $params['seller'] = I('seller');
        $params['type'] = I('type');
        if(I('_id')){
            $params['modify_time'] = date("Y-m-d H:i:s");
            $params['modify_user_id'] = current_user_id();
        } else {
            $params['state'] = 1;
            $params['create_time'] = date("Y-m-d H:i:s");
            $params['create_user_id'] = current_user_id();
        }
            //入库
        $md->save($params,array(upsert=>true));
        $this->ajaxReturn(array(msg=>'操作成功', code=>1));
    }


    /** 获取列表直接（从本地库获取） */
    public function getList(){
        $md = new AutoIncrementModel(Constants::$DB_CONTRACT_LIST);
        $list = $md->select();//->where(array(state=>1))
        $items = array();
        $nowSeconds =  strtotime(date("Y-m-d"));
        $endSeconds = 0;
        // TODO 终止的合同不显示出来,原型里面有，暂保留
        foreach($list as $k=>$row){
            if($row['state'] == 1){
                $endSeconds = $row['end_date'] ? strtotime($row['end_date']) : 0;
                if($endSeconds - $nowSeconds < 0){
                    $row['stateDesc'] = '逾期';
                } else if($endSeconds - $nowSeconds < 60 * 60 * 24 * 7 ){//剩余合同7天临期
                    $row['stateDesc'] = '临期';
                } else {
                    $row['stateDesc'] = '正常';
                }
            } else {
                $row['stateDesc'] = '终止';
            }

            $items[]=$row;
        }

        $ret['recordsTotal']= count($items);
        $ret['recordsFiltered'] = count($items);
        $ret['items'] = array_values($items);
        $this->ajaxReturn($ret);
    }

    public function delete(){
        $_id = I('_id');
        if(!$_id){
            $this->ajaxReturn(array(code=>0,msg=>"参数错误"));
        }
        $_ids = explode(",",$_id);
        $uid=current_user_id();
        $md=new AutoIncrementModel(Constants::$DB_CONTRACT_LIST);
        $where["_id"]=array("in",$_ids);
        $md->where($where)->delete();
        $this->ajaxReturn(array(code=>1,msg=>"删除成功"));
    }

    public function getAllKindsOfCount(){
        $md = new AutoIncrementModel(Constants::$DB_CONTRACT_LIST);
        $list = $md->select();//->where(array(state=>1))
        $allCount = count($list);
        $validCount = 0;
        $adventCount = 0;
        $overdueCount = 0;
        $nowSeconds =  strtotime(date("Y-m-d"));
        $endSeconds = 0;
        //TODO 终止的合同不参与计数,原型里面有，暂保留
        foreach($list as $k=>$row){
            if($row['state'] == 1) {
                $endSeconds = $row['end_date'] ? strtotime($row['end_date']) : 0;
                if ($endSeconds - $nowSeconds < 0) {
                    $overdueCount++;
                } else if ($endSeconds - $nowSeconds < 60 * 60 * 24 * 7) {//剩余合同7天临期
                    $adventCount++;
                    $validCount++;
                } else {
                    $validCount++;
                }
            }
        }

        $result["validCount"] = $validCount;
        $result["adventCount"] = $adventCount;
        $result["overdueCount"] = $overdueCount;
        $result["allCount"] = $allCount;
        $this->ajaxReturn($result);
    }

    public function stopContract(){
        if(!I('_ids')){
            $this->ajaxReturn(array(code=>0,msg=>"参数错误"));
        }
        $_idStr = I('_ids');

        $_ids = explode(",",$_idStr);
        $md = new AutoIncrementModel(Constants::$DB_CONTRACT_LIST);
        $params = array();
        $params['state'] = 2;
        foreach($_ids as $k=>$v){
            $params['_id'] = $v;
            $md->save($params,array(upsert=>true));
        }
        $this->ajaxReturn(array(code=>1,msg=>"操作成功"));
    }

    public function contractDetail(){
        $addAction = check_action("Home/Sites/batchAddSite");
        $this->assign("addAction", $addAction);
        $user=session("user");
        $this->assign("isSystemRole", $user['isSystemRole']);
        if(I('contract_id')){
            $this->assign('contract_id',I('contract_id'));
        }
        $this->display("contractDetail");
    }


    public function showDetail(){


        $md = new AutoIncrementModel(Constants::$DB_CONTRACT_LIST);
        $where = array(_id=>intval(I('contract_id')));
        $row = $md->where($where)->find();
        if($row){
            if($row['type'] == '1'){
                $row['name'] = '【正式】'.$row['name'];
            } else {
                $row['name'] = '【试用】'.$row['name'];
            }
            $client_id = $row['client'];
            $clientMd = new StringModel(Constants::$DB_CLIENT_LIST);
            $rowClient = $clientMd->where(array(_id=>$client_id))->find();
            $row['client_name'] = $rowClient && $rowClient['name'] ? $rowClient['name'] : "";
            $row['client_phone_num'] = $rowClient && $rowClient['phone_num'] ? $rowClient['phone_num'] : "";
            $row['client_email'] = $rowClient && $rowClient['email'] ? $rowClient['email'] : "";

            $seller_id = $row['seller'];
            $sellerMd = new StringModel(Constants::$DB_SELLER_LIST);
            $rowSeller = $sellerMd->where(array(_id=>$seller_id))->find();
            $row['seller_name'] = $rowSeller ? $rowSeller['name']."(".$rowSeller['phone_num'].")" : "";

            $project_manager_id = $row['project_manager'];
            $projectMd = new AutoIncrementModel(Constants::$DB_AUTH_USER);
            $rowProject = $projectMd->where(array(_id=>$project_manager_id))->find();
            $row['project_manager_name'] = $rowProject ? $rowProject['name']."(".$rowProject['username'].")" : "";

            $create_user_id = $row['create_user_id'];
            $createUserMd = new AutoIncrementModel(Constants::$DB_AUTH_USER);
            $rowCreateUser = $createUserMd->where(array(_id=>$create_user_id))->find();
            $row['create_user_name'] = $rowCreateUser ? $rowCreateUser['name']."(".$rowCreateUser['username'].")" : "";

        }
        $this->ajaxReturn(array(code=>1,data=>$row));
    }

}