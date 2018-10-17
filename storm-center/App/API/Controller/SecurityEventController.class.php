<?php
namespace API\Controller;

use Think\Controller\RestController;

class SecurityEventController extends APIBaseController {
    public function getEventCategory(){
        $category=C("EVENT_TYPE");
        $this->ajaxReturn(array("code"=>1,"values"=>$category));

    }
    public function getEventByDomain(){

        $param['web_domain'] = I('domain');


        $vulsInfo = http_post(C('STORM_CENTER_PATH')."/api/security/querySecurityEvent", $param,'json');

        $this->ajaxReturn(array("code"=>1,"msg"=>"","imgserver"=>C('IMAGE_SERVER').'/upload/', "info"=>$vulsInfo['items']));

    }

    public function getEventByDay(){
        $param['happen_times'] = I('day');

        $vulsInfo = http_post(C('STORM_CENTER_PATH')."/api/security/querySecurityEvent", $param,'json');

        $this->ajaxReturn(array("code"=>1,"msg"=>"", "info"=>$vulsInfo['items']));
    }


}