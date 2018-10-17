<?php
namespace OptCenter\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;

/**
 * 首页
 *
 * Class IndexController
 * @package OptCenter\Controller
 */
class IndexController extends BaseController {



    public function index(){
       $this->display('index');
    }

    public function init(){
        $this->display('test');
    }


}