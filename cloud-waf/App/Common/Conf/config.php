<?php
$config= array(
    'MODULE_ALLOW_LIST'  => array('Home','Admin','API','SAAS','Mobile','IAPI', 'Base'),
    //IAPI 内部用的API接口
    'DEFAULT_MODULE'     => 'Admin',
    'DEFAULT_CONTROLLER' => 'Test2',
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
$dbconfig=array(
    //数据库配置信息
    //'DB_TYPE'   => 'mongo', // 数据库类型
    'DB_TYPE'   => 'mysql', // 数据库类型
    //'DB_HOST'   => '192.168.40.110', // 服务器地址
    //'DB_HOST'   => '172.16.2.43', // 服务器地址
    'DB_HOST'   => '127.0.0.1', // 服务器地址
    'DB_NAME'   => 'doc', // 数据库名
    'DB_USER'   => 'root',
    'DB_PWD'    => '123456',
    'DB_PORT'   => 1000,       // 端口
    'DB_PREFIX' => 'cwaf.',    // 数据库表前缀
    'DB_CHARSET'=> 'utf8',     // 字符集

);

$apiConfig=array(
    "A_LI_YUN_PATH"=>"http://yd-highddos-cn-hangzhou.aliyuncs.com"


);

$templateConfig=array(
//    'TMPL_EXCEPTION_FILE'=>APP_PATH."/Common/Tpl/exception.html",
//    'TMPL_ACTION_ERROR'=>APP_PATH."/Common/Tpl/dispatch_jump.html"
);

return array_merge($config,$dbconfig,$apiConfig,$templateConfig);
