<?php
namespace app\common\validate;
//应用验证器
use think\Validate;

class Apiapp extends Validate
{
    protected $rule = [
        'app_name' => 'require',
        'app_status' => 'require|in:0,1',
        'app_limitTime' => 'require|number'
    ];

    protected $message = [
        'app_name' => '应用名称不能为空',
        'app_status' => '状态必须为数字整数（0,1）',
        'app_status.require' => '状态不能为空',
        'app_limitTime.require' => 'Token有效时间不能为空',
        'app_limitTime.number' => 'Token有效时间必须是数字',
    ];

    protected $scene = [
        'add'   => ['app_name','app_limitTime'],
        'edit'  => ['app_name','app_limitTime'],
        'app_name' => ['app_name'],
        'app_status' => ['app_status'],
        'app_limitTime' => ['app_limitTime'],
    ];
}