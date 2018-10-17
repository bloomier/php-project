<?php
/**
 * Created by PhpStorm.
 * User: jianghaifeng
 * Date: 2016/2/2
 * Time: 17:10
 */

function current_user_id(){
    $user=session("user");
    return intval($user["_id"]);
}

function is_manager(){
    return current_user_id()==1;
}
function current_db(){
    return C("DB_NAME");
}


function authcheck($action,$user){
    if($user['_id']==1 || $user['isSystemRole']){
        return true;
    }else{
        return in_array(strtolower($action),$user['actions']);
    }

}
function startWith($str, $needle) {

    return strpos($str, $needle) === 0;

}
function http_post($url,$data,$returnType){
    $data_string=http_build_query($data);
    $_curl = curl_init($url);
    curl_setopt($_curl, CURLOPT_FOLLOWLOCATION, 1); // 使用自动跳转
    if(startWith($url,"https")){
        curl_setopt($_curl, CURLOPT_SSL_VERIFYPEER, 0); // 对认证证书来源的检查
        curl_setopt($_curl, CURLOPT_SSL_VERIFYHOST, 1); // 从证书中检查SSL加密算法是否存在
    }
//    curl_setopt($_curl, CURLOPT_HTTPHEADER, array('Expect:'));
    curl_setopt($_curl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($_curl, CURLOPT_POST,1);
    curl_setopt( $_curl, CURLOPT_POSTFIELDS,$data_string);
    curl_setopt($_curl, CURLOPT_RETURNTRANSFER,true);
    curl_setopt($_curl,CURLOPT_TIMEOUT,15);
    //curl_setopt($_curl,CURLOPT_TIMEOUT,60);
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

function http_get($url,$data,$returnType){
    $data_string=http_build_query($data);
    $_curl = curl_init($url);
    curl_setopt($_curl, CURLOPT_FOLLOWLOCATION, 1); // 使用自动跳转
    if(startWith($url,"https")){
        curl_setopt($_curl, CURLOPT_SSL_VERIFYPEER, 0); // 对认证证书来源的检查
        curl_setopt($_curl, CURLOPT_SSL_VERIFYHOST, 1); // 从证书中检查SSL加密算法是否存在
    }
//    curl_setopt($_curl, CURLOPT_HTTPHEADER, array('Expect:'));
    curl_setopt($_curl, CURLOPT_CUSTOMREQUEST, "GET");
    curl_setopt($_curl, CURLOPT_POST,1);
    curl_setopt( $_curl, CURLOPT_POSTFIELDS,$data_string);
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


function encodeApiKey($data) {
    // $secret_key="dbapp@com.cn";
    //AES, 128 ECB模式加密数据
    $screct_key = "dbapp@com.cn";
    $screct_key = base64_decode($screct_key);
    $data = trim($data);
    $str = addPKCS7Padding($data);
    $iv = mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128,MCRYPT_MODE_ECB),MCRYPT_RAND);
    $encrypt_str =  mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $screct_key, $str, MCRYPT_MODE_ECB, $iv);
    return base64_encode($encrypt_str);
}

function decodeApiKey($data) {
    $screct_key ="dbapp@com.cn";
    $data = base64_decode($data);
    $screct_key = base64_decode($screct_key);
    $iv = mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128,MCRYPT_MODE_ECB),MCRYPT_RAND);
    $encrypt_str =  mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $screct_key, $data, MCRYPT_MODE_ECB, $iv);
    $encrypt_str = trim($encrypt_str);
    $encrypt_str = stripPKSC7Padding($encrypt_str);
    return $encrypt_str;
}

/** 获取uuid  */
function uuid(){
    if (function_exists('com_create_guid')){
        $uuid = com_create_guid();
    }else{
        mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
        $charid = strtoupper(md5(uniqid(rand(), true)));
        $hyphen = chr(45);
        $uuid = substr($charid, 0, 8).$hyphen
            .substr($charid, 8, 4).$hyphen
            .substr($charid,12, 4).$hyphen
            .substr($charid,16, 4).$hyphen
            .substr($charid,20,12);

        //return $uuid;
    }
    $uuid = str_replace("{","",$uuid);
    $uuid = str_replace("}","",$uuid);
    return $uuid;
}

/**
 * 填充算法
 * @param string $source
 * @return string
 */
function addPKCS7Padding($source){
    $source = trim($source);
    $block = mcrypt_get_block_size('rijndael-128', 'ecb');
    $pad = $block - (strlen($source) % $block);
    if ($pad <= $block) {
        $char = chr($pad);
        $source .= str_repeat($char, $pad);
    }
    return $source;
}

/**
 * 移去填充算法
 * @param string $source
 * @return string
 */
function stripPKSC7Padding($source){
    $source = trim($source);
    $char = substr($source, -1);
    $num = ord($char);
    if($num==62)return $source;
    $tmp = substr($source,0,-$num);
    return $tmp ? $tmp : $source;
}

/**
 * 验证码检查
 */
function check_verify($code, $id = ""){
    $verify = new \Think\Verify();
    return $verify->check($code, $id);
}

/**
 * 验证用户是否有某个action权限
 * @param $action
 * @return bool
 */
function check_action($action){
    $user = session("user");
    if(!$user || !$user['actions'] || !$action) {
        return false;
    }
//    if($user['_id'] == 1){
//        return true;
//    }
    //dump($user['actions']);
    return in_array(strtolower($action), $user['actions']);
}


function getSystemMillis(){
    $timemillis = explode ( " ", microtime () );
    $timemillis = $timemillis [1] . ($timemillis [0] * 1000);
    $time2 = explode ( ".", $timemillis );
    $timemillis = $time2 [0];
    return $timemillis;
}

function string_is_empty($str){
    if(isset($str)&&!empty($str)&&$str!=''){
        return false;
    }
    return true;
}


/**
 * 文件下载
 * @param $path 文件路径
 * @param $filename  下载后的文件名称
 * @return bool
 */
function download($path,$filename=''){
    $name=basename($path);
    if(!string_is_empty($filename)){
        $name=$filename;
    }
    $file_size = filesize($path);
    header("Content-type: application/octet-stream");
    header("Accept-Ranges: bytes");
    header("Accept-Length: $file_size");
    header("Content-Disposition: attachment; filename=".$name);

    $fp = fopen($path,"r");
    $buffer_size = 1024;
    $cur_pos = 0;

    while(!feof($fp)&&$file_size-$cur_pos>$buffer_size){
        $buffer = fread($fp,$buffer_size);
        echo $buffer;
        $cur_pos += $buffer_size;
    }
    $buffer = fread($fp,$file_size-$cur_pos);
    echo $buffer;
    fclose($fp);
    return true;
}


