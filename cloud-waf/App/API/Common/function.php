<?php
/**
 * Created by JetBrains PhpStorm.
 * User: sakoo
 * Date: 15-4-21
 * Time: 9:55
 * To change this template use File | Settings | File Templates.
 */

function sortByTime($a,$b){
    $tmp1=explode(".",$a);
    $time1=$tmp1[0];
    $tmp2=explode(".",$b);
    $time2=$tmp2[0];
    $tmp3=explode("-",$time1);
    $tmp4=explode("-",$time2);
    $year1=$tmp3[0];
    $month1=$tmp3[1];
    $year2=$tmp4[0];
    $month2=$tmp4[1];
    if($year1>$year2){
        return -1;
    }else if($year1<$year2){
        return 1;
    }else{
        if($month1>$month2){
            return -1;
        }else if($month1<$month2){
            return 1;
        }
    }
    return 0;
}

function https_post($url,$data,$returnType){
    $_curl = curl_init($url);
    curl_setopt($_curl, CURLOPT_FOLLOWLOCATION, 1); // 使用自动跳转
    curl_setopt($_curl, CURLOPT_SSL_VERIFYHOST, 2); // 从证书中检查SSL加密算法是否存在
    curl_setopt($_curl, CURLOPT_SSLCERT, getcwd()."/conf/client.crt");
    curl_setopt($_curl, CURLOPT_SSLCERTPASSWD, "000000");

    curl_setopt($_curl, CURLOPT_SSLKEY,getcwd()."/conf/client.key");

    curl_setopt($_curl, CURLOPT_SSL_VERIFYPEER, false); // 信任任何证书，不是CA机构颁布的也没关系
    curl_setopt($_curl, CURLOPT_SSL_VERIFYHOST, 1); // 检查证书中是否设置域名，如果不想验证也可设为0
    curl_setopt($_curl, CURLOPT_VERBOSE, '1'); //debug模式，方便出错调试

    curl_setopt($_curl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($_curl, CURLOPT_POST,1);
    curl_setopt( $_curl, CURLOPT_POSTFIELDS,json_encode($data));
    curl_setopt($_curl, CURLOPT_RETURNTRANSFER,true);
    curl_setopt($_curl,CURLOPT_TIMEOUT,15);
    curl_setopt($_curl, CURLOPT_HTTPHEADER, array(
            'Content-Type:application/x-www-form-urlencoded',
            'User-Agent : Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)',
            'charset=UTF-8','Expect:')
    );
    $result = curl_exec($_curl);
    $result=str_replace("null:","\"null\":",$result);
    curl_close($_curl);
    if($returnType==='json'){
        if($result){
            return json_decode($result,true);
        }else{
            return array();
        }
    }else {
        return $result;
    }
}





