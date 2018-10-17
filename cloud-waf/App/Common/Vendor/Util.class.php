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

}