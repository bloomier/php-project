<?php
namespace Common\Vendor;
class Util  {
    public function data_merge($srcs,$pid=0){
        $arr=array();
        foreach ($srcs as $m){
            if($m['pid']==$pid){
                $children=$this->data_merge($srcs,$m['_id'],'pid');
                if($children&&count($children)>0){
                    $m['children']=$children;

                }
                $arr[]=$m;
            }
        }
        return $arr;
    }
    public function uuid(){
        if (function_exists('com_create_guid')){
            return com_create_guid();
        }else{
            mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
            $charid = strtoupper(md5(uniqid(rand(), true)));
            $hyphen = chr(45);
            $uuid = substr($charid, 0, 8).$hyphen
                .substr($charid, 8, 4).$hyphen
                .substr($charid,12, 4).$hyphen
                .substr($charid,16, 4).$hyphen
                .substr($charid,20,12);

            return $uuid;
        }
    }
    public function randChar($length){
        $str = null;
        $strPol = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
        $max = strlen($strPol)-1;

        for($i=0;$i<$length;$i++){
            $str.=$strPol[rand(0,$max)];//rand($min,$max)生成介于min和max两个数之间的一个随机整数
        }

        return $str;
    }
    public  function isMobile($mobile) {
        if (!is_numeric($mobile)) {
            return false;
        }
        return preg_match('#^13[\d]{9}$|^14[5,7]{1}\d{8}$|^15[^4]{1}\d{8}$|^17[0,6,7,8]{1}\d{8}$|^18[\d]{9}$#', $mobile) ? true : false;
    }
    public function convertUTF8($str){
        if(empty($str)) return '';
        return  iconv('gb2312', 'utf-8', $str);
    }

    function mill_second() {
        list($s1, $s2) = explode(' ', microtime());
        return (float)sprintf('%.0f', (floatval($s1) + floatval($s2)) * 1000);
    }

    public function sendEmail($userList, $param){
        $list = array();
        foreach($userList as $tmp){
            $list[] = array(to=>"", addr=>$tmp);
        }
        $param['bcc'] = $list;
        $msgParam = array();
        $msgParam['type'] = Constants::$MSG_EMAIL_TYPE;
        $msgParam['params'] = json_encode($param);
        $result = http_post(C("MSG_PATH")."/message", $msgParam, "json");
        return $result;
    }

    public function sendMsg($userList, $param){
        $list = array();
        foreach($userList as $tmp){
            $list[] = array(to=>"", addr=>$tmp);
        }
        $param['send'] = $list;
        $msgParam = array();
        $msgParam['type'] = Constants::$MSG_SMS_TYPE;
        $msgParam['params'] = json_encode($param);
        $result = http_post(C("MSG_PATH")."/message", $msgParam, "json");
        return $result;
    }

    public function sendMixin($userList, $param){
        $list = array();
        foreach($userList as $tmp){
            $list[] = array(to=>"", addr=>$tmp);
        }
        $param['send'] = $list;
        $msgParam = array();
        $msgParam['type'] = Constants::$MSG_MIXIN_TYPE;
        $msgParam["params"] = json_encode($param);
        $result = http_post(C("MSG_PATH")."/message", $msgParam, "json");
        return $result;
    }

}