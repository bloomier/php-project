<?php
namespace Base\Controller;
use Admin\Controller\BaseController;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;

/**
 * Class ClientController
 * @package Base\Controller
 * 销售信息
 */
class SellerController extends BaseController {


    private function test(){
        //header("Content-Type: text/html; charset=utf-8");
    }

    /**  进入列表 */
    public function index(){
        $this->display("sellerList");
    }

    /** 进入新增或者修改页面 */
    public function addUpdatePage(){
        if(I('needBack')){
            $this->assign('needBack',I('needBack'));
        }
        $this->getcurrentObject();
        $this->display("sellerAddUpdate");
    }

    /** 获取当前被编辑对象 */
    public function getcurrentObject(){

        $_id = I('_id');
        if($_id){
            $md = new StringModel(Constants::$DB_SELLER_LIST);
            $row = $md->where(array(_id=>$_id))->find();
            if ($row) {
                $this->assign("currentObject", str_replace("+","%20",urlencode(json_encode($row))));
            }
        }
    }


    /** 添加或者修改  */
    public function addOrUpdate(){
        $md = new StringModel(Constants::$DB_SELLER_LIST);
        if(I('_id')){
            $uuid = I('_id');
        } else {
            $uuid = uuid();
        }
        $where = array();
        $where['name'] = I('name');
        $where['_logic'] = 'and';
        $where['_id'] = array('$exists'=>true, '$not'=>array('$in'=>array($uuid)) );
        //先判断该ip是否已经存在
        $rows = $md->where($where)->select();
        if($rows){
            $this->ajaxReturn(array(msg=>'该客户名称已存在', code=>0));
        }

        $params = array();
        $params['_id'] = $uuid;
        $params['name'] = I('name');
        $params['phone_num'] = I('phone_num');
        $params['email'] = I('email');
        $params['state'] = I('state');
        if(I('state') == "0"){
            $cMd = new AutoIncrementModel(Constants::$DB_CONTRACT_LIST);
            $cWhere = array();
            $cWhere['state'] = 1;
            $cWhere['end_date'] = array('$gte'=>date("Y-m-d"));
            $cWhere["seller"] = $uuid;
            $rows = $cMd->where($cWhere)->select();
            if($rows){
                $this->ajaxReturn(array(code=>0,msg=>"该销售关联了有效合同信息不能置为无效状态"));
            }
        }
        $params['desc'] = I('desc');
        if(I('_id')){
            $params['modify_time'] = date("Y-m-d H:i:s");
        } else {
            $params['create_time'] = date("Y-m-d H:i:s");
        }
            //入库
        $md->save($params,array(upsert=>true));
        $this->ajaxReturn(array(msg=>'操作成功', code=>1));
    }


    /** 获取列表直接（从本地库获取） */
    public function getList(){
        $md = new StringModel(Constants::$DB_SELLER_LIST);
        $list = $md->select();
        $items = array();
        foreach($list as $k=>$row){
            $items[]=$row;
        }
        //$this->ajaxReturn($result);

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
        $cMd = new AutoIncrementModel(Constants::$DB_CONTRACT_LIST);
        $cWhere = array();
        $cWhere['state'] = 1;
        $cWhere['end_date'] = array('$gte'=>date("Y-m-d"));
        $cWhere["seller"]=array("in",$_ids);
        $rows = $cMd->where($cWhere)->select();
        if($rows){
            $this->ajaxReturn(array(code=>0,msg=>"销售关联了合同信息不能删除"));
        }
        $md=new StringModel(Constants::$DB_SELLER_LIST);
        $where["_id"]=array("in",$_ids);
        $md->where($where)->delete();
        $this->ajaxReturn(array(code=>1,msg=>"删除成功"));
    }

}