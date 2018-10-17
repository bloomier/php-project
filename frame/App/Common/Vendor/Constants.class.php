<?php
namespace Common\Vendor;
class Constants  {
    public static $DB_AUTOINCREMENT_PK="pk";
    public static  $DB_ASSET_MAPPER="asset_mapper";//资产映射表

    public static $DB_RULE_CACHE="rule_cache";
    public static $DB_STATS_VULS="stats_vuls";
    public static $DB_STATS_SURVER="stats_survey";
    public static $DB_STATS_SECURITY="stats_security";
    public static $DB_STATS_ZERODAY="stats_zeroday";
    public static $DB_STATS_FINGER="stats_finger";
    public static $DB_NOTIFY_GROUP="notify_group";
    public static $DB_NOTIFY_USER="notify_user";

    public static $DB_STATIC_ASSERT = "assert_census";

    public static $DB_EXPORT_TASK="export_task";

    public static $DB_EVENT="event";
    public static $DB_EVENT_LOG = "event_log";

    public static $API_DATA_CENTER="API_DATA_CENTER";
    public static $API_CLOUD="API_CLOUD";
    public static $IMG_SERVER="IMG_SERVER";

    public static $TASK_EXPORT_ASSET=1;
    public static $TASK_EXPORT_ASSETREAPORT=2;
    public static $TASK_EXPORT_EVENT = 3;
    public static $TASK_EXPORT_EVENT_SUM = 4;

    // 信息发送类型
    public static $MSG_EMAIL_TYPE = 4;
    public static $MSG_SMS_TYPE = 1;
    public static $MSG_MIXIN_TYPE = 2;

    public static $DB_AUTH_USER="auth_user";
    public static $DB_REGION="region";
    public static $DB_USER_RELATION_REGION='user_r_region';
    public static $DB_AUTH_ROLE='auth_role';
    public static $DB_AUTH_ACTION='auth_action';
    public static $DB_ASSET="asset";//资产表
    public static $DB_USER_2_ASSET="user_2_asset";
    public static $DB_LOG_OPT="opt_log";
    public static $DB_RULE_LOG_OPT="rule_opt_log";
    public static $DB_IP_BLACKLIST="ip_blacklist";
    public static $DB_MAIN_ASSET_OF_USER="main_asset_of_user";
    public static $DB_CC_ATTACK="cc_attack";
    public static $DB_DEFENSE_ATTACK="defense";
    public static $DB_POLICY_ATTACK="policy";
    public static $DB_POLICY_LIST="policy_list";
    /** 访问控制表 */
    public static $DB_ACCESS_LIST="access_list";
    /** 高防Ip接口调用失败记录 */
    public static $DB_INTERFACE_ERROR="interface_error";

    public static  $PATH_API="API_PATH";
    public static  $PATH_STORM_CENTER = "STORM_CENTER_PATH";
    public static  $PATH_WARNAPP = "WARN_FILTER_PATH";
    public static  $PATH_SITE_POINT = "PATH_SITE_POINT";
    public static  $STORM_CENTER_PATH = "STORM_CENTER_PATH";


    public static  $DB_ASSET_NEW="asset_new";//新资产表
    public static  $DB_USER_2_ASSET_NEW="user_2_asset_new";//资产关联表
    public static  $DB_SAAS_REFLECT="saas_reflect";

    public static $DB_POLICY_RELATION = "policy_relation"; //策略和站点、url关联表

    /** 客户列表  */
    public static $DB_CLIENT_LIST = "client_list";
    /** 销售列表  */
    public static $DB_SELLER_LIST = "seller_list";
    /** 合同列表 */
    public static $DB_CONTRACT_LIST = "contract_list";


}