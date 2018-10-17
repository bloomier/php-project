<?php
/**
 * Created by PhpStorm.
 * User: sakoo
 * Date: 15-9-16
 * Time: 14:15
 */
namespace Home\Globals;
class Log
{
    /**
     * 日志文件大小限制
     * @var int 字节数
     */
    private static $log_size = 1048576; // 1024 * 1024 * 5 = 5MB

    /**
     * 设置单个日志文件大小限制
     *
     * @param int $size 字节数
     */
    public static function set_size($size)
    {
        if( is_numeric($size) ){
            self::$log_size = $size;
        }
    }

    /**
     * 写日志
     *
     * @param string $log_message 日志信息
     * @param string $log_type    日志类型
     */
    public static function write($log_message, $log_name)
    {
        // 检查日志目录是否可写
        if ( !file_exists(LOG_PATH) ) {
            @mkdir(LOG_PATH);

        }
       // echo $log_message;
        chmod(LOG_PATH,0777);

        $s_now_time = date('[Y-m-d H:i:s]');
        $log_now_day  = date('Y_m_d');
        if(!$log_name){
            $log_name=$log_now_day;
        }
        // 根据类型设置日志目标位置
        $log_path   = LOG_PATH.$log_name.".log";

       // echo $log_path;

        //检测日志文件大小, 超过配置大小则重命名
        if (file_exists($log_path) && self::$log_size <= filesize($log_path)) {
            $s_file_name = substr(basename($log_path), 0, strrpos(basename($log_path), '.log')). '_' . time() . '.log';
            rename($log_path, dirname($log_path) . DS . $s_file_name);
        }
        clearstatcache();
        if(is_array($log_message)){
            if(!is_windows()){
                $log_message=json_encode($log_message);
            }else{
                $log_message=json_encode($log_message,JSON_UNESCAPED_UNICODE);
            }
        }
        // 写日志, 返回成功与否
        return error_log("$s_now_time $log_message\n", 3, $log_path);
    }
}
