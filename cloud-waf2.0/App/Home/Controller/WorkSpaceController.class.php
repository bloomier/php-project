<?php
namespace Home\Controller;
use Admin\Controller\BaseController;
use Think\Controller;
class WorkSpaceController extends BaseController {
    public function index(){
        $this->display("./page/work-space");
    }

}