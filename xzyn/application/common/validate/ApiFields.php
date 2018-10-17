<?php
namespace app\common\validate;
//接口验证器
use think\Validate;

class ApiFields extends Validate
{
    protected $rule = [
        'fieldName' => 'require|alphaDash',
    ];

    protected $message = [
        'fieldName.require' => '字段名称不能为空',
        'fieldName.alphaDash' => '字段名称只能是字母和数字，下划线_及破折号-',
    ];

    protected $scene = [
        'add'   => ['fieldName'],
        'edit'  => ['fieldName'],
        'fieldName' => ['fieldName'],
        'default' => ['default'],
        'info' => ['info'],
    ];
}