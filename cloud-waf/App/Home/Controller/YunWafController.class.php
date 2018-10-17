<?php
/**
 * Created by PhpStorm.
 * User: jianghaifeng
 * Date: 2016/3/1
 * Time: 14:25
 */

namespace Home\Controller;
use Think\Controller;
use Admin\Controller\BaseController;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;
use Common\Vendor\WafConsole;

class YunWafController extends Controller {

    // 218.60.114.145&orderNum=361332008
    // frontIp=120.55.238.176&orderNum=361352030
    // frontIp=180.97.162.80&orderNum=361312003
    /** */
    public function index(){
        $this->display("attackSituation");
    }


    public function lock_ip(){
        $config = array();
        $config['action'] = 'block';
        $config['expire'] = 0;
        $config['uuid'] = '778542E6-F3BE-41D1-9F9D-5207F99D3C0A';
        $sip = array();
        $sip[] = array("111.47.111.18","");
        $config['match'] = json_encode($sip);
        //$config=array(domain=>$domain, ip=>$ip, port=>$port, rule=>1, bypass=>0 );
        $console=new WafConsole();
        $result = $console->_ac_create($config);
        dump($result);
    }

    public function getList(){
        $console=new WafConsole();
        $result = $console->_ac_list();
        dump($result);
    }


}