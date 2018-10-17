<?php
namespace Home\Controller;
use Admin\Controller\BaseController;
use Think\Controller;
class IndexController extends BaseController {
    public function index(){
        $this->display("./index");
    }

}