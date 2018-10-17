<?php
namespace Home\Controller;
use Admin\Controller\BaseController;
use Common\Model\StringModel;
use Common\Vendor\Constants;
use Think\Controller;

class AliOrderController extends BaseController {

    public function index(){
        $this->display('aliOrder');
    }

    public function listAll(){
        $md=new StringModel(Constants::$DB_SAAS_REFLECT);
        $row=$md->order('crateTime desc')->select();
        $this->ajaxReturn(array_values($row));
    }








}