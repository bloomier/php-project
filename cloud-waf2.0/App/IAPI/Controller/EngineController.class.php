<?php
namespace IAPI\Controller;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;
use Think\Controller;
class EngineController extends IpAuthController {
    public function queryLocation(){
        $json=file_get_contents("./Public/asset/source/province-city-dist.json");
        $this->ajaxReturn(json_decode($json,true));
    }
    public function getProphetInfoScript(){
        $script=file_get_contents("./Public/asset/source/driver_script/screen.js");
        $this->ajaxReturn(array(code=>1,"script"=>$script));
    }



}