<?php


$config=array(

    'MODULE_ALLOW_LIST' => array('Home','Admin','API','Security','Self','ScreenCenter','OptCenter',"MSSP","Mirror"),
    'DEFAULT_MODULE' => 'Home',
//    'DEFAULT_MODULE'        =>  'MSSP',  // 默认模块
//    'DEFAULT_CONTROLLER'    =>  'Login', // 默认控制器
    'DEFAULT_CHARSET' => 'utf-8', // 默认输出编码

    'SESSION_AUTO_START' =>true,

    'GENERATE_PATH' => './report/selfreport/',
    'GENERATE_ZIP_PATH' => './report/selfzipreport/',

//    'EXPORT_PATH'=>'D:\\html\\',

    //一些公用属性的配置
    PROVINCES=> array('上海','广东','山东','山西','辽宁','新疆','河北','甘肃','内蒙古','北京','广西','江苏',
        '江西','福建','安徽','陕西','黑龙江','天津','西藏','云南','浙江','湖南','湖北','海南','青海','贵州','河南','重庆','宁夏','吉林'
    ),
    MAIL_CONFIG=>array(
        'MAIL_SMTP'=>TRUE,
        'MAIL_HOST'=>'mail.dbappsecurity.com.cn',
        'MAIL_SMTPAUTH'=>TRUE,
        'MAIL_USERNAME'=>'securitycenter',
        'MAIL_PASSWORD'=>'A7H8dbA6Pp@20150815',
        'MAIL_SECURE'=>'tls',
        'MAIL_CHARSET'=>'utf-8',
        'MAIL_SIGN'=>"XXX",
        'MAIL_FROM'=>"securitycenter@dbappsecurity.com.cn"
    )

);

$logConfig=array(

    /* 一些日志配置*/

    'LOG_FILE_SIZE' => '2097152'
);

$dbconfig=array(
    //数据库配置
    'DB_TYPE' => 'mysql',




//    'DB_HOST' => '192.168.40.110',
    'DB_HOST' => '172.16.2.40',
    'DB_NAME' => 'stormcenter',
    'DB_USER' => 'root',
    'DB_PWD' => '1qazCDE#5tgb',

    'DB_PORT' => '3306',

    'DB_PREFIX' => 'storm_',
    "AUTHCODE" => 'X5nByPceDOpFfRGGuT',
    'DB_FIELDTYPE_CHECK' => true, // 是否进行字段类型检查
    'DB_FIELDS_CACHE' => true, // 启用字段缓存
    'DB_CHARSET' => 'utf8', // 数据库编码默认采用utf8
    'DB_DEPLOY_TYPE' => 0, // 数据库部署方式:0 集中式(单一服务器),1 分布式(主从服务器)
    'DB_RW_SEPARATE' => false, // 数据库读写是否分离 主从式有效
    'DB_MASTER_NUM' => 1, // 读写分离后 主服务器数量
    'DB_SQL_BUILD_CACHE' => false, // 数据库查询的SQL创建缓存
    'DB_SQL_BUILD_QUEUE' => 'file', // SQL缓存队列的缓存方式 支持 file xcache和apc
    'DB_SQL_BUILD_LENGTH' => 20, // SQL缓存的队列长度
    /* 数据缓存设置 */
    'DATA_CACHE_TIME' => 0, // 数据缓存有效期 0表示永久缓存
    'DATA_CACHE_COMPRESS' => false, // 数据缓存是否压缩缓存
    'DATA_CACHE_CHECK' => false, // 数据缓存是否校验缓存
    'DATA_CACHE_PATH' => TEMP_PATH, // 缓存路径设置 (仅对File方式缓存有效)

);

$apiConfig=array(
//一些接口的配置



    'STORM_CENTER_PATH'=>'http://172.16.2.40:8089/stormcenter',
    'IMAGE_SERVER'=>"http://api.websaas.cn/imgserver",
    'WARN_FILTER_PATH'=>"http://172.16.2.88:8089/warnapp",
    'SOC_PATH'=>'172.16.6.105:9090/bdsp-web',
    'ZBBIX_PATH'=>'http://172.16.7.86:9090',
    'STATIC_PATH'=>'http://172.16.2.27:8089/static',
    'SCREEN_SHOT_PATH'=>"http://172.16.2.27:9090/screenshot",
    'CLOUD_WAF_PATH'=>"http://172.16.7.50:8089/cloudwaf",
    'CLOUD_WAF_REPORT'=>"http://172.16.7.100:9090//dataplatform",
    'MIRROR_PATH'=>"http://172.16.6.108:8089/mirror",
    'CLUBINFO_PATH'=>"http://172.16.2.43:8089/clubinfo",
    'SOCPLATFORM_PATH'=>"http://172.16.6.107:8088/socplatform"





);

$securityConfig=array(
    'ALL_PROVINCES'=>array('请选择'=>'','北京'=>'北京','天津'=>'天津','上海'=>'上海','重庆'=>'重庆',
        '山西'=>'山西','内蒙古'=>'内蒙古','陕西'=>'陕西','吉林'=>'吉林',
        '河北'=>'河北','河南'=>'河南','云南'=>'云南',
        '辽宁'=>'辽宁','湖南'=>'湖南','安徽'=>'安徽','山东'=>'山东',
        '新疆'=>'新疆','江苏'=>'江苏','浙江'=>'浙江','江西'=>'江西',
        '黑龙江'=>'黑龙江','湖北'=>'湖北','广西'=>'广西','甘肃'=>'甘肃',
        '广东'=>'广东','青海'=>'青海','西藏'=>'西藏','四川'=>'四川',
        '宁夏'=>'宁夏','海南'=>'海南','台湾'=>'台湾','香港'=>'香港',
        '福建'=>'福建','贵州'=>'贵州','澳门'=>'澳门'),
    'EVENT_TYPE' => array('请选择'=>'','黑页'=>'1','暗链'=>'2','反共'=>'3','博彩'=>'5','色情'=>'6','漏洞'=>'7','其他'=>'4')

);


return array_merge($config,$dbconfig,$logConfig,$apiConfig,$securityConfig);