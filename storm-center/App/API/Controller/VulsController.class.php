<?php
namespace API\Controller;

use Think\Controller;
use Think\Controller\RestController;

class VulsController extends APIBaseController {


    public function getVulsByDomain(){

        $param['domain'] = I('domain');


        $vulsInfo = http_post(C('STORM_CENTER_PATH')."/api/vuls/queryDomain", $param,'json');

        $this->ajaxReturn(array("code"=>$vulsInfo['code'],"msg"=>$vulsInfo['msg'], "info"=>$vulsInfo['other']));


    }

    public function getVulsCategory(){
        $vulsInfo = http_post(C('STORM_CENTER_PATH')."/api/vuls/vulsNameMap", null,'json');

        $this->ajaxReturn(array("code"=>$vulsInfo['code'],"msg"=>$vulsInfo['msg'], "info"=>$vulsInfo['items']));
    }

    public function getHideLinkVuls(){
        $param['domain'] = I('domain');
        $param['vidList'] = 'SD6016';
        $vulsInfo = http_post(C('STORM_CENTER_PATH')."/api/vuls/queryDomainAndVid", $param,'json');
        $this->ajaxReturn(array("code"=>$vulsInfo['code'],"msg"=>$vulsInfo['msg'], "info"=>$vulsInfo['items']));
    }

}