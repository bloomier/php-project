<?php
namespace ScreenCenter\Controller;
use Home\Controller\BaseController;
use Home\Globals\Log;
use Think\Controller;
use Think\Model;


class WorldNetWorkController extends Controller {

    public function index(){
        $this->assign("key","世界互联网大会官网注册网");
        $this->display("./cloud-monitor");
    }

}