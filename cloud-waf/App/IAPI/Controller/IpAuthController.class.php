<?php
namespace IAPI\Controller;
use Think\Controller;
class IpAuthController extends Controller {
    public function _initialize(){
        $client_ip=get_client_ip();
        if(startWith($client_ip,"172.16.7")||startWith($client_ip,"192.168.40.110")||startWith($client_ip,"192.168.28")||$client_ip=='127.0.0.1' || $client_ip=='0.0.0.0'){
            return true;
        }
        $this->ajaxReturn(array("code"=>0,"msg"=>"ip forbidden"));
    }

}