<?php
/**
 * Created by PhpStorm.
 * User: jianghaifeng
 * Date: 2016/2/2
 * Time: 17:10
 */
function clearCaches(){
    $dir=TEMP_PATH;
    $dh = opendir($dir);
    while ($file = readdir($dh)) {
        if ($file != "." && $file != "..") {
            $fullpath = $dir . "/" . $file;
            if (!is_dir($fullpath)) {
                unlink($fullpath);
            } else {
                deldir($fullpath);
            }
        }
    }
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

function change_db($region_id){
    C("DB_NAME",C("MAIN_DB")."_region_".$region_id);
}

function change_db_main(){
    C("DB_NAME",C("MAIN_DB"));
}

function current_db(){
    return C("DB_NAME");
}
function current_region_id(){
    $user=session("user");
    if(!$user){
        return 0;
    }
    return $user['region_id'];
}
function current_user_id(){
    $user=session("user");
    return intval($user["_id"]);
}
function is_global_user(){
    $user=session("user");
    if($user['is_global']&&$user['is_global']==1){
        return true;
    }
    return false;
}
function is_manager(){
    $user=session("user");
    if($user['id']==1){
        return true;
    }
    if($user['is_manager']&&$user['is_manager']==1){
        return true;
    }

    return false;
}


function authcheck($action,$user){
    if($user['is_manager']==1 || $user['_id'] == 1 || $user['isSystemRole']){
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

function field_filter($fields,$filter){
    $param=array();
    foreach($filter as $f){
        if($fields[$f]){
            $param[$f]=$fields[$f];
        }
    }
    return $param;
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

function getMillisecond() {
    list($t1, $t2) = explode(' ', microtime());
    return (float)sprintf('%.0f',(floatval($t1)+floatval($t2))*1000);
}

function easyPage(){
    $limit=I("length")?I("length"):10;
    $currentPage=I("start")?(I("start") / $limit + 1):1;
    return $currentPage.",".$limit;
}
function easyLimit(){
    $limit=I("length")?I("length"):10;
    $start=I("start")?I("start"):0;
    return $start.",".$limit;
}

/**
 * 判断url
 *
 * @param $s
 * @return bool
 */
function isUrl($s){
    return preg_match('/^http[s]?:\/\/'.
        '(([0-9]{1,3}\.){3}[0-9]{1,3}'. // IP形式的URL- 199.194.52.184
        '|'. // 允许IP和DOMAIN（域名）
        '([0-9a-z_!~*\'()-]+\.)*'. // 域名- www.
        '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.'. // 二级域名
        '[a-z]{2,6})'.  // first level domain- .com or .museum
        '(:[0-9]{1,4})?'.  // 端口- :80
        '((\/\?)|'.  // a slash isn't required if there is no file name
        '(\/[0-9a-zA-Z_!~\'\.;\?:@&=\+\$,%#-\/^\*\|]*)?)$/',
        $s) == 1;
}

function getRandomStr($len){
    $chars = array(
       "0", "1", "2","3", "4", "5", "6", "7", "8", "9"
    );
    $charsLen = count($chars) - 1;
    shuffle($chars);
    $output = "";
    for ($i=0; $i<$len; $i++)
    {
        $output .= $chars[mt_rand(0, $charsLen)];
    }
    return $output;
}

/**
 * post提交文件
 * @param $url
 * @param $data
 * @param $returnType
 * @return array|mixed
 */
function http_post_file($url,$data,$returnType){
    $_curl = curl_init($url);
    curl_setopt($_curl, CURLOPT_FOLLOWLOCATION, 1); // 使用自动跳转
    curl_setopt($_curl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($_curl, CURLOPT_POST,1);
    curl_setopt($_curl, CURLOPT_POSTFIELDS,$data);
    curl_setopt($_curl, CURLOPT_RETURNTRANSFER,true);
    curl_setopt($_curl,CURLOPT_TIMEOUT,5);
    curl_setopt($_curl, CURLOPT_HTTPHEADER, array(
            'Content-Type:multipart/form-data;',
            'User-Agent : Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)',
            'charset=UTF-8')
    );
    $result = curl_exec($_curl);
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

/**
 * 生成uuid
 * @return string
 */
function uuid(){
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

/**
 * 校验日期格式是否正确
 *
 * @param string $date 日期
 * @param string $formats 需要检验的格式数组
 * @return boolean
 */
function checkDateIsValid($date, $formats = array("Y-m-d", "Y/m/d", "Y-m-d H:i:s")) {
    $unixTime = strtotime($date);
    if (!$unixTime) { //strtotime转换不对，日期格式显然不对。
        return false;
    }
    //校验日期的有效性，只要满足其中一个格式就OK
    foreach ($formats as $format) {
        if (date($format, $unixTime) == $date) {
            return true;
        }
    }
    return false;
}

function getTimeStamp(){
    return strtotime("now") * 1000;
}
function simpleTransfer($in){
    return str_replace("&quot;","'",$in);

}







