<?php
namespace app\common\validate;

use think\Validate;

class Flink extends Validate
{
    protected $rule = [
        'webname' => 'require',
        'email' => 'email',
        'sorts' => 'require|integer|>=:1',
        'status' => 'require|in:0,1',
    ];

    protected $message = [
        'webname' => '网站名称不能为空',
        'email' => '站长email格式错误',
        'sorts' => '排序必须为大于0数字整数',
        'status' => '状态必须为数字整数（0,1）',
    ];

    protected $scene = [
        'add'   => ['webname', 'email', 'sorts', 'status'],
        'edit'  => ['webname', 'email', 'sorts', 'status'],
        'status' => ['status'],
        'webname' => ['webname'],
        'url' => ['url'],
    ];
}