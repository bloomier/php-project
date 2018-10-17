<?php
/**
 * Created by JetBrains PhpStorm.
 * User: sakoo
 * Date: 15-3-27
 * Time: 20:34
 * To change this template use File | Settings | File Templates.
 */

function string_is_empty($str){
    if(isset($str)&&!empty($str)&&$str!=''){
        return false;
    }
    return true;
}

/**
 * 根据数组中的某个键值大小进行排序，仅支持二维数组
 *
 * @param array $array 排序数组
 * @param string $key 键值
 * @param bool $asc 默认正序
 * @return array 排序后数组
 */
function array_sort($arr,$keys,$orderby='asc'){

    $keysvalue = $new_array = array();

    foreach ($arr as $k=>$v){
        $keysvalue[$k] = $v[$keys];
    }

    if($orderby== 'asc'){
        asort($keysvalue);
    }else{
        arsort($keysvalue);
    }

    reset($keysvalue);

    foreach ($keysvalue as $k=>$v){
        $new_array[] = $arr[$k];
    }
    return $new_array;
}
function decode_jsonstringify($json){
    return str_replace("&quot;","\"",$json);
}
function startWith($str, $needle) {

    return strpos($str, $needle) === 0;

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
 *
 * 对字符串进行公钥解密
 * @param $data
 */
function rsa_decrypt($data){
    $private_key=file_get_contents("Public/source/cer/cloud_pub.key");
    $decrypted='';
    $data=base64_decode($data);
    openssl_public_decrypt($data, $decrypted, $private_key,OPENSSL_ALGO_SHA1);
    return $decrypted;

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


// curl上传文件
function http_post_file($url,$data,$returnType){
    $_curl = curl_init($url);
    curl_setopt($_curl, CURLOPT_FOLLOWLOCATION, 1); // 使用自动跳转
    if(startWith($url,"https")){
        curl_setopt($_curl, CURLOPT_SSL_VERIFYPEER, 0); // 对认证证书来源的检查
        curl_setopt($_curl, CURLOPT_SSL_VERIFYHOST, 1); // 从证书中检查SSL加密算法是否存在
    }
    curl_setopt($_curl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($_curl, CURLOPT_POST,1);
    curl_setopt( $_curl, CURLOPT_POSTFIELDS,$data);
    curl_setopt($_curl, CURLOPT_RETURNTRANSFER,true);
    curl_setopt($_curl,CURLOPT_TIMEOUT,60);
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
 * 获取接口中获取统计信息
 *
 * @return array|mixed
 */
function getVulsCensus(){
    $result = http_post(C('STORM_CENTER_PATH')."/queryVirusLevelCount", array(), 'json');
    return $result;
}

/**
 *  获取统计信息
 *
 * @return mixed
 */
function getCountCensus(){
    $count=http_post(C('STORM_CENTER_PATH')."/queryUrlCount",array(),'json');
    $danger=http_post(C('STORM_CENTER_PATH')."/queryVirusCount",array(),'json');
    $result["count"] = $count;
    $result["danger"] = $danger;
    return $result;
}

/**
 * 获取按漏洞类型分类TOPN
 *
 * @return array|mixed
 */
function getVulsTopN(){
    $result = http_post(C('STORM_CENTER_PATH')."/queryVulsTopN", array(), 'json');
    return $result;
}

/**
 * 邮件发送函数
 */
function sendMail($tos,$subject, $content,$attachFile=null) {
    vendor('PHPMailer.class#phpmailer');
    vendor('PHPMailer.class#smtp');
    $mail = new PHPMailer();
    $config=C('MAIL_CONFIG');
    $mail->Mailer   = "smtp";
    $mail->Host = $config['MAIL_HOST'];
    $mail->SMTPAuth = $config['MAIL_SMTPAUTH'];
    $mail->Username = $config['MAIL_USERNAME'];
    $mail->Password = $config['MAIL_PASSWORD'];
    $mail->SMTPSecure = $config['MAIL_SECURE'];
    $mail->CharSet ="utf-8";
    $mail->Encoding = "base64"; //编码方式
    $mail->setLanguage("zh_cn");

    // 装配邮件头信息
    $mail->From = $config['MAIL_FROM'];
    $mail->IsSMTP();
//    $mail->SMTPDebug=3;
    //添加收件人
    if($tos){
        foreach($tos as $to){
            $mail->AddAddress($to);

        }
    }

    $mail->FromName = $config['MAIL_SIGN'];
    $mail->IsHTML($config['MAIL_ISHTML']);

    // 装配邮件正文信息
    $mail->Subject=$subject;
    $mail->Body = $content;

    //添加附件

    if($attachFile){
        if(is_file($attachFile)){
         //   echo 'addAttach:'.$attachFile."<br>";
            $mail->AddAttachment($attachFile);

        }

    }

    return  $mail->Send() ? true : $mail->ErrorInfo;

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
function getSystemMillis(){
    $timemillis = explode ( " ", microtime () );
    $timemillis = $timemillis [1] . ($timemillis [0] * 1000);
    $time2 = explode ( ".", $timemillis );
    $timemillis = $time2 [0];
    return $timemillis;
}

/**
 * 记录一条新日志
 */
function LOGNEW($handleType,$content,$result=1){
     $log=M('log');
    $log->handle_type=$handleType;
    $log->content=$content;
    $log->req_ip=get_client_ip();
    if(session("?user")){
        $user=session("user");
        $log->user_id=$user['id'];
    }
    $log->result=$result;
    $log->add();
}


function authcheck($rule,$user){

    if($user['id']==1){
        return true;
    }
    $auth=new \Think\Auth();

    return $auth->check($rule,$user['role_id']);
}


function easyPage(){
    $currentPage=I("currentpage")?I("currentpage"):1;
    $limit=I("limit")?I("limit"):10;
    return $currentPage.",".$limit;

}

function data_merage($srcs,$pid=0){
    $arr=array();
    foreach ($srcs as $m){
        if($m['pid']==$pid){
            $children=data_merage($srcs,$m['id'],'pid');
            if($children&&count($children)>0){
                $m['children']=$children;

            }
            $arr[]=$m;
        }
    }
    return $arr;
}
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
function dateKey(){
    $time=date('Y-m-d');
    return $time;
}
function hourKey(){
    $time=date("Y-m-d-H");
    return $time;
}
function mkDirs($dir){
    if(!is_dir($dir)){
        if(!mkDirs(dirname($dir))){
            return false;
        }
        if(!mkdir($dir,0777)){
            return false;
        }
    }
    return true;
}
function is_windows(){
   return strtoupper(substr(PHP_OS,0,3))==='WIN'?true:flase;
}

function get_rules(){
    $rules=S("storm_auth_rule");
    if(!$rules){
        $rules=array();
        $_d=M("auth_rule")->where(array('status'=>1))->select();
        foreach($_d as $r){
            if($r['need_log']){
                $rules[$r['name']]=array(title=>$r['title']);
            }
        }
        //加上API的一些日志
        $_d2=M("api_rule")->select();
        foreach($_d2 as $r2){
            $name=$r2['name'];
            if(!startWith($name,"ScreenCenter")){
                $rules[$name]=array(title=>$r2['title']);
            }
        }
        S("storm_auth_rule",$rules,array('type'=>'file','expire'=>3600));
    }

    return $rules;
}









