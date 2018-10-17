<?php
namespace ScreenCenter\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;


class AttackEventController extends BaseController {



    public function index(){
        $this->display("./attack-event");

    }
    public function getAttackEventJson(){
        $data=http_post(C('STORM_CENTER_PATH')."/screencenter/attackEventOfScrren/getAttackEventData",null,"json");
        $this->ajaxReturn($data);
    }




}