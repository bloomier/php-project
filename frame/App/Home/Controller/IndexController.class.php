<?php
namespace Home\Controller;
use Admin\Controller\BaseController;
use Think\Controller;
class IndexController extends BaseController {
    public function index(){
        $this->display("./index");
    }

    public function tree(){
        $this->display("./tree");
    }

    public function home(){
        $this->display("./home");
    }

    public function table(){
        $this->display("./table");
    }

    public function dataTable(){
        $md = M('param_set');
        $rows=$md->select();
        $ret['items'] = array_values($rows);
        $this->ajaxReturn( $ret);
    }

    public function ipGroup(){
        $this->display("./ipGroup");
    }

    public function getTreeNodes(){
        $json = http_post(C('NISP3_PATH')."/modules/business/ipgroup/getTreeNodes", I(), 'json');
        $this->ajaxReturn($json);
    }

    public function insertOrUpdate(){
        $json = http_post(C('NISP3_PATH')."/modules/business/ipgroup/insertOrUpdate", I(), 'json');
        $this->ajaxReturn($json);
    }

}