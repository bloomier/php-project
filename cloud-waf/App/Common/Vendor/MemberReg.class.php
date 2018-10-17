<?php
namespace Common\Vendor;
class MemberReg  {
    public static $API_HOST="http://online.dbappsecurity.com.cn:9090/member/regMember";


    public static  $ERROR_MAPPER=array(
        1=>"会员注册成功",

    );

    /** 注册会员
     * @param handset     手机号码
     * @param password    密码（这个是md5的密码）
     * @param memberNike  会员昵称
     * @param token       手机唯一性标识
     * @return
     */
    public function _member_reg($config){
        $result = http_post(MemberReg::$API_HOST, $config, 'json');
        return $result;
    }





}