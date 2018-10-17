<?php
namespace app\common\validate;
//接口验证器
use think\Validate;

class Apilist extends Validate
{
    protected $rule = [
        'apiName' => 'require',
        'status' => 'require|in:0,1',
    ];

    protected $message = [
        'apiName.require' => '接口名称不能为空',
        'status' => '状态必须为数字整数（0,1）',
        'status.require' => '状态不能为空',
    ];

    protected $scene = [
        'add'   => ['apiName'],
        'edit'  => ['apiName'],
        'apiName' => ['apiName'],
        'status' => ['status'],
        'info' => ['info'],
    ];
}