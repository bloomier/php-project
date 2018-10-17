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
use Common\Vendor\MemberReg;

class TestController extends Controller {


    public function globalTest(){
        $wafConsole = new WafConsole();
        // 574fd1aabf064
        $result = $wafConsole->_global_list();
        //http_post('https://172.16.7.71:8080/platform/config1 ',null,'json');
        dump($result);
    }

    public function php(){
        $wafConsole = new WafConsole();
        // 574fd1aabf064
        $result = $wafConsole->_php_info();
        //http_post('https://172.16.7.71:8080/platform/config1 ',null,'json');
        dump($result);
    }

    public function globalEdit(){
        $wafConsole = new WafConsole();
        $config = array();
        /**
         *  'bypass' => int 0
        'rule_engine' => string 'on' (length=2)
        'rule_disable' =>
        array
        0 => string '11010001' (length=8)
        'rule_detect' =>
        array
        0 => string '444444' (length=6)
        1 => string '@1202' (length=5)*/
        $config['bypass'] = 0;
        $config['rule_engine'] = 'on';
        $config['rule_disable'] = array('11010001');
        $config['rule_detect'] = array();
        $result = $wafConsole->_global_edit($config);
        dump($result);
    }

    public function memberReg(){
        header("Content-Type: text/html; charset=utf-8");
        $member = new MemberReg();
        $config = array();
        $config['handset'] = '18667935148';
        $config['password'] = 'd67691efdcb72c8d98669ce0fda2b0f3';
        $config['memberNike'] = 'ancyshi.shi';
        $config['token'] = uuid();
        $result = $member->_member_reg($config);
        dump($result);
    }


    public function regAllMember(){
        header("Content-Type: text/html; charset=utf-8");
        $member = new MemberReg();
        $auth_user=new AutoIncrementModel(Constants::$DB_AUTH_USER);
        $users=$auth_user->select();
        $config = array();
        foreach($users as $k=>$v){
            if($v['_id'] != 1){
//                dump($v);
//                dump($v['password']);
                $config['handset'] = $v['username'];
                $config['password'] = $v['password'];
                $config['memberNike'] = $v['name'];
                $config['token'] = uuid();
                $result = $member->_member_reg($config);
            }

//            $config['handset'] = $v['username'];
//            $config['password'] = $v['password'];
//            $config['memberNike'] = $v['name'];
//            $config['token'] = uuid();
//            $result = $member->_member_reg($config);

        }
        dump("success");
    }

    /**
     * 进入列表
     */
    public function index(){
        $this->display("index");
    }


    public function deleteSite(){
        $wafConsole = new WafConsole();
        // 574fd1aabf064
        $result = $wafConsole->_delete('5757dd8d8f586');
        $result = $wafConsole->_delete('5757dd9c958fc');
        dump($result);
    }

    public function clear(){
//        $wafConsole = new WafConsole();
//        // 574fd1aabf064
//        $result = $wafConsole->_clear();
//        dump($result);
    }

    public function insertSite(){
        //574fccf8f15ec   574fcdc85698a
        $wafConsole = new WafConsole();
        $config = array();
        $config['ip'] = '127.0.0.2';
        $config['port'] = 80;
        $config['domain'] = array('www.test.com');
        $config['rule'] = 1;
        $config['dos'] = 0;

        // 站点规则定制
        $zone_rule = array();
        $zone_rule['rule_engine'] = "on";
        //过滤掉的策略
        $zone_rule['rule_disable'] = array();
        //只过的策略
        $zone_rule['rule_detect'] = array();
        $config['zone_rule'] = $zone_rule;

        //页面或路径定制策略
        $page_rule = array();
        $one_page_rule = array();
        $one_page_rule['path'] = '*';
        $one_page_rule['cache'] = array(enable=>"on",expire=>3600);
        $one_page_rule['rule_engine'] = "on";//规则引擎运行模式: on阻断，off关闭，detect仅检测
        $one_page_rule['rule_disable'] = array();
        $one_page_rule['rule_detect'] = array();
        $page_rule[] = $one_page_rule;
        $config['page_rule'] = $page_rule;

        $config['bypass'] = 0;

        $result = $wafConsole->_create($config);
        dump($result);
    }

    public function getList(){
        $wafConsole = new WafConsole();
        $result = $wafConsole->_list();
        dump($result);
    }

    public function editSite(){
        $wafConsole = new WafConsole();
        $config = array();
        $config['ip'] = '127.0.0.1';
//        $config['port'] = 80;
//        $config['domain'] = array('www.test.com');
//        $config['rule'] = 1;
//        $config['dos'] = 0;
//
//        // 站点规则定制
//        $zone_rule = array();
//        $zone_rule['rule_engine'] = "on";
//        //过滤掉的策略
//        $zone_rule['rule_disable'] = array();
//        //只过的策略
//        $zone_rule['rule_detect'] = array();
//        $config['zone_rule'] = $zone_rule;
//
//        //页面或路径定制策略
        $page_rule = array();
        $one_page_rule = array();
        $one_page_rule['path'] = '*';
//        $one_page_rule['cache'] = array(enable=>"on",expire=>3600);
        $one_page_rule['rule_engine'] = "on";//规则引擎运行模式: on阻断，off关闭，detect仅检测
        //$one_page_rule['rule_disable'] = '';
        $one_page_rule['rule_disable'] = array();
        $page_rule[] = $one_page_rule;
        $config['page_rule'] = $page_rule;

//        $config['bypass'] = 1;
        $config['id'] = '5754e8ae4f899';
        $result = $wafConsole->_edit($config);
        dump($result);
    }



}