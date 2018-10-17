<?php
namespace API\Controller;


use API\Util\Parsedown;
use Think\Controller;

class ApiViewController extends Controller {

    public function _initialize(){
        $key=I('xKey');
        
        if(!$key){
            $this->ajaxReturn("xKey empty");
        }
        $keyApi=M("api_key")->where(array("key"=>$key))->find();
        if(!$keyApi){
            $this->ajaxReturn("xKey error");
        }


    }
    public function apis(){
        $this->showMarkDown("api.md");

    }
    public function keyAuth(){
        $this->showMarkDown("keyAuth.md");

    }
    public function vuls(){
        $this->showMarkDown("vuls.md");

    }
    public function securityEvent(){
        $this->showMarkDown("securityEvent.md");
    }
    public function java(){
        $this->showMarkDown("java.md");

    }
    public function bigdataTask(){
        $this->showMarkDown("bigdataTask.md");

    }
    private function  showMarkDown($view){
        $text = $this->fetch("./App/API/View/".$view);

        $html=Parsedown::instance()->parse($text);
        $this->show($html,"UTF-8","text/html");

    }


}