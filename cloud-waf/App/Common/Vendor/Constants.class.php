<?php
namespace Common\Vendor;
class Constants  {
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