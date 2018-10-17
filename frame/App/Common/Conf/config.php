<?php
$config= array(
    'MODULE_ALLOW_LIST'  => array('Home','Admin','API','SAAS','Mobile','IAPI', 'Base', 'Mobile'),
    //IAPI 内部用的API接口
    'DEFAULT_MODULE'     => 'Home',
    'DEFAULT_CONTROLLER' => 'Index',
    'DEFAULT_CHARSET'    => 'utf-8', // 默认输出编码
    'CHECK_TIME'         => 180,     // 多长时间内连续登录错误锁定用户和封ip
    'CHECK_PHONECODE'    => false,   // 是否校验手机验证码
    'WAF_DEBUG'          => false,    // 添加站点时是否为调试模式
    'IMPORT_MAX_COUNT'   => 50,      // 一次导入站点最大值
    "POLICY_NAMEE"       => array(
        "1101"=>"协议违规"
    ),
    "ALI_SOURCE_IP"=>array(
        "115.236.45.235"=>"1"
    ),
    //"MSG_USER"=>array(name=>'值班',phone=>'13148322519',email=>'securitycenter@dbappsecurity.com.cn'),
    "MSG_USER"=>array(name=>'石教云',phone=>'18667935148',email=>'ancyshi.shi@dbappsecurity.com.cn'),
    "SAAS_KEY" =>"9yptYOUQfHoKQK9pPZ702vSAxfiRSe1aZpCFMo0DBFYGU5Azus72CFHrMFnW4L1w"

);
//$dbconfig=array(
//    //数据库配置信息
//    'DB_TYPE'   => 'mongo', // 数据库类型
//    //'DB_HOST'   => '192.168.40.110', // 服务器地址
//    //'DB_HOST'   => '172.16.2.43', // 服务器地址
//    'DB_HOST'   => '172.16.7.70', // 服务器地址
//    'DB_NAME'   => 'cloudwaf', // 数据库名
//    'MAIN_DB'   => 'cloudwaf',
//    'DB_PORT'   => 1000,       // 端口
//    'DB_PREFIX' => 'cwaf.',    // 数据库表前缀
//    'DB_CHARSET'=> 'utf8',     // 字符集
//
//);

$dbconfig=array(
    //数据库配置信息
    'DB_TYPE'   => 'mysql', // 数据库类型
    //'DB_HOST'   => '192.168.40.110', // 服务器地址
    //'DB_HOST'   => '172.16.2.43', // 服务器地址
    'DB_HOST'   => '172.16.11.233', // 服务器地址
    'DB_USER'               =>  'root',     // 用户名
    'DB_PWD'                =>  '123456',      // 密码
    'DB_NAME'   => 'nisp3', // 数据库名
    'MAIN_DB'   => 'nisp3',
    'DB_PORT'   => 3306,       // 端口
    'DB_PREFIX' => 't_',    // 数据库表前缀
    'DB_CHARSET'=> 'utf8',     // 字符集

);

$apiConfig=array(
    "NISP3_PATH"=>"http://localhost:8080/frame-web",
    "A_LI_YUN_PATH"=>"http://yd-highddos-cn-hangzhou.aliyuncs.com",
    'STORM_CENTER_PATH'=>'http://172.16.2.40:8089/stormcenter',
    'MSG_SERVER_PATH'=>"http://172.16.2.42:8089/msgserver/message",//获取短信接口
    'PATH_SITE_POINT'=>"http://172.16.2.43:8090/temp" , //端口，指纹信息
    'ZBBIX_PATH'=>'http://172.16.7.100:9090',
    'WARN_FILTER_PATH'=>"http://172.16.2.88:8089/warnapp",
    "API_PATH"=>"http://172.16.7.50:8089/cloudwaf/",
    "STORM_CENTER_PATH"=>"http://172.16.2.41:8090/iapi",//数据中心提供的接口

    //'SOC_PLAT_FORM_PATH'=>"http://127.0.0.1:8080/socplatform",//solr查询
    'SOC_PLAT_FORM_PATH'=>"http://172.16.6.107:8088/socplatform",//solr查询
    //"YUN_WAF_PATH"=>"https://183.131.19.19:8080", //云waf接口路径
    "YUN_WAF_PATH"=>"https://172.16.7.71:8080", //云waf接口路径


    'POLICY_PATH'=>"http://172.16.7.47:8090/ArkHenryWeb",            //获取当天触发策略列表
    'IP_TOPN_PATH'=>"http://172.16.7.100:8085/ArkHenryWebDbapp",     //获取访问和攻击ipTopN
    'REPORT_PATH'=>"http://172.16.7.100:8080/dataplatform/normal",   //获取报告的安全防护数据，暂时只用到攻击类型

    'G20_PATH'=>"http://172.16.7.46:8085/ArkHenryWebG20"    //G20


);

$templateConfig=array(
    'TMPL_EXCEPTION_FILE'=>APP_PATH."/Common/Tpl/exception.html",
    'TMPL_ACTION_ERROR'=>APP_PATH."/Common/Tpl/dispatch_jump.html"
);

return array_merge($config,$dbconfig,$apiConfig,$templateConfig);
