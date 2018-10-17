<?php
namespace Common\Vendor;
use Common\Model\AutoIncrementModel;

class Permission  {
    /**
     * check 该用户是否有该网站的权限
     * @param $domain
     * @param $uid
     */
   public function check_domain_user($domain,$uid){
       if(!$domain||!$uid){
           return false;
       }


       $md=new AutoIncrementModel(Constants::$DB_USER_2_ASSET_NEW);
       $row = null;
       $user = session("user");
       // 如果是系统角色用户，则数据库中所有站点都允许访问
       if($user['isSystemRole']){
           $row=$md->where(array(domain=>$domain))->find();
       } else {
           $row=$md->where(array(domain=>$domain,uid=>$uid))->find();
       }

//       dump($row);
       if(!$row){
            return false;
       }
       return true;
   }


}