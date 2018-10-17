<?php


namespace MSSP\Controller;
use Home\Controller\BaseController;
use Think\Controller;

/**
 * 我的站点
 * Class ContractController
 * @package MSSPSelf\Controller
 */
class LoginController extends Controller {


    public function index(){
        $errorMsg2 = I('errorMsg2');
//        dump($errorMsg2);
//        die();
        $user=session("user");
//        $this->display("index");

        if($user){
            //$this->redirect("/MSSP/Monitor/index");
            $this->assign("loginType",88);
            $this->assign("errorMsg2",$errorMsg2);
            $this->display("index");
        }else{
            $this->assign("loginType",88);
            $this->assign("errorMsg2",$errorMsg2);
            $this->display("index");
        }


    }








}