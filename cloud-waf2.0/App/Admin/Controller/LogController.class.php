<?php
namespace Admin\Controller;
use Common\Model\AutoIncrementModel;
use Common\Vendor\Constants;
use Think\Controller;

class LogController extends BaseController {
    public function index(){
        $md=new AutoIncrementModel(Constants::$DB_AUTH_USER);
        $row=$md->field("_id,username,name,roles,email,phone,is_manager")->select();
        $this->assign("users",$row);
        $this->display('./page/log');
    }


    public function listPage(){
        $ret=array();
        $md = new AutoIncrementModel(Constants::$DB_LOG_OPT);

        $total = $md->count();
        $rows = $md->field("_id,name,success,uid,time,ip")->order("time desc")->limit(easyLimit())->select();
        $ret['recordsTotal']=$total;
        $ret['recordsFiltered'] = $total;
        $ret['items'] = array_values($rows);
//        sleep(5);
        $this->ajaxReturn($ret);
    }









}