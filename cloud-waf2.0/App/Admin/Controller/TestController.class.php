<?php
namespace Admin\Controller;
use Common\Model\StringModel;
use Common\Vendor\Util;
use Common\Vendor\WafConsole;
use Common\Vendor\WafConsoleOld;
use Common\Vendor\Constants;
use Think\Controller;
use Common\Vendor\AliYun;
class TestController extends Controller {

    public function mobile(){
        //$this->display();
        $this->display('test');
    }

    public function first(){
        $this->display('first');
    }

    public function log(){
        $this->display('log');
    }

    public function indexindex(){
        //$this->display();
        $this->display('index');
    }

    public function last_exec(){
        header("Content-Type: text/html; charset=utf-8");
        echo "这个是输出到浏览器的内容";

        //=======这部分是将输出内容刷新到用户浏览器并断开和浏览器的连接=====
        // 如果使用的是php-fpm
        if(function_exists('fastcgi_finish_request')){
            // 刷新buffer
            ob_flush();
            flush();
            // 断开浏览器连接
            fastcgi_finish_request();
        }

        //========下面是后台要继续执行的内容========
        // 这里是模拟你的耗时逻辑
        sleep(10);
        file_put_contents('/tmp/test.log', 'ok');
    }


    public function index(){
        dump(WafConsole::$ERROR_MAPPER);
    }
    public function listAll(){
        $console=new WafConsole();
        $result=$console->_list();
        dump($result);
    }

    public function updateMongo(){
//        $md=new StringModel(Constants::$DB_ASSET);
//
//        $console=new WafConsole();
//        $result=$console->_list();
//        foreach($result as $k=>$row){
//            $domains = $row['domain'];
//            foreach($domains as $k1=>$row1){
//                $new = $md->where(array(_id=>$row1))->find();
//                $new['config'] = $row;
//                $new['ip'] = $row['ip'];
//                $new['port'] = $row['port'];
//                $new['waf_id'] = $k;
//                $md->save($new,array(upsert=>true));
//            }
//        }
//        echo 'over';
    }
    public function create(){
//        $console=new WafConsole();
//        $config=array(
//            id=>uuid(),
//            ip=>"192.168.111.123",
//            port=>80,
//            domain=>array("www.baibai.com"),
//            rule=>1
//        );
//        $result=$console->_create($config);
//        dump($result);
    }
    public function delete(){
        $console=new WafConsole(); //575528b6cef40   574feec38c11d
        $result=$console->_delete('575686c473c41');
        dump($result);
    }


    /**
     * '5723359d63d83' =>
    array
    'domain' =>
    array
    0 => string '0day.websaas.cn' (length=15)
    'ip' => string '120.131.67.219' (length=14)
    'port' => string '80' (length=2)
    'rule' => int 1
    'bypass' => int 0
     */
    public function edit(){
        $console=new WafConsole();
        //$zone_rule = array();
        //$zone_rule['rule_engine'] = "on";
        $config=array(
            ip=>"220.191.210.71",
            port=>80,
            domain=>array("www.hzgzw.gov.cn"),
            rule=>1,
            bypass => 1,
            //zone_rule => $zone_rule,
            id=>"5763987e74fe7"
        );
        /** @var
         * $zone_rule = array();
        $zone_rule['rule_engine'] = I('protect_mode');
        $param['zone_rule'] = $zone_rule;
         * $result */

        //echo $num."<br/>";
        $result=$console->_edit($config);
        dump($result);

    }

    public function testAliYun(){
        echo date("Y-m-d H:i:s")."<br/>";
        $aliyun = new AliYun();
        $config = array();
        $config['InstanceId'] = '361312003';//高防实例ID
        $config['Domain'] = "www.bai22.com";//域名
        $config['Protocols'] = json_encode(array("http"));//协议，http、https，JSON数组格式
        $config['SourceIps'] = json_encode(array('127.0.0.1'));//源站IP列表，JSON数组格式
        $config['WafEnable'] = 0;//是否开启waf 防护，0：否，1：是，默认是
        $config['CcEnable'] = 0; //是否开启cc防护，0：否，1：是，默认是

        $result = $aliyun->CreateDomain($config);
        dump($result);
        echo date("Y-m-d H:i:s")."<br/>";

        $deleteConfig = array();
        $deleteConfig['InstanceId'] = '361312003';//高防实例ID
        $deleteConfig['Domain'] = "www.bai22.com";//域名
        $result = $aliyun->DeleteDomain($deleteConfig);
        dump($result);

        echo date("Y-m-d H:i:s")."<br/>";
    }

    public function echoTime(){

        $console=new WafConsole();
        $config=array(
            ip=>"192.168.111.123",
            port=>80,
            domain=>array("www.baibai.com"),
            rule=>1,
            bypass => 0,
            id=>"180EF3DC-5BDB-4FAE-A232-9F0670015FC6"
        );
        echo date("Y-m-d H:i:s")."<br/>";
        for($num = 0; $num < 1000; $num++){
            //echo $num."<br/>";
            $result=$console->_edit($config);
            dump($result);
        }
        echo date("Y-m-d H:i:s")."<br/>";

    }
    public function find1(){
        $console=new WafConsole();
        $config=array(
            id=>"180EF3DC-5BDB-4FAE-A232-9F0670015FC6",
//            ip=>"120.55.144.27",
//            port=>80
        );
        $result=$console->_find($config);
        dump($result);
    }

    public function test(){
        header("Content-Type: text/html; charset=utf-8");
        $param = array("province"=>"山东","domain"=>"gov.cn");
        $params = array("params"=>json_encode($param));
        $result = http_post("http://localhost:8080/dc/domain/groupByProvinceDomain2", $params,"json");
        dump($result);

    }



    public function getAcList(){
        $console = new WafConsole();
        $list = $console->_ac_list();
        print_r($list);
    }

    public function lock_ip(){
        $config = array();
        $config['action'] = 'block';
        $config['expire'] = 0;
        $config['uuid'] = '58BC82CC-98A1-183E-6A97-31EC49E42E2D';
        $sip = array();
        //www.hzsj.gov.cn 183.136.190.62
        $sip[] = array("183.136.190.61","");
        $sip[] = array("183.136.190.61",'X-Forwarded-For,-1');
        //$domain = array("test.baidu.com");
        $match = array();
        $match["sip"] = $sip;
        //$match["domain"] = $domain;
        //$config['match'] = json_encode($match);
        $config['match'] = $match;
        //$config=array(domain=>$domain, ip=>$ip, port=>$port, rule=>1, bypass=>0 );
        $console=new WafConsole();
        $result = $console->_ac_create($config);
        dump($result);
    }


    public function ac_delete(){
        $console=new WafConsole();
        $result=$console->_ac_delete(I("uuid"));
        dump($result);
    }
}