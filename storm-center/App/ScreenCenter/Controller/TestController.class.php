<?php
namespace ScreenCenter\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;


class TestController extends Controller {



    public function index(){
        $this->display("./test");

    }


}