<?php
namespace app\common\validate;

use think\Validate;

class AuthGroup extends Validate
{
    protected $rule = [
        'title' => 'require',
        'level' => 'require|integer|>=:1',
        'status' => 'require|in:0,1',
        'module' => 'require',
    ];

    protected $message = [
        'title' => '角色名称不能为空',
        'level' => '角色等级必须为数字整数',
        'status' => '状态必须为数字整数（0,1）',
        'module' => '所属模块不能为空',
    ];

    protected $scene = [
        'add'   => ['title', 'level', 'status', 'module'],
        'edit'  => ['title', 'level', 'status', 'module'],
        'status' => ['status'],
        'title' => ['title'],
        'level' => ['level'],
        'notation' => ['notation'],
    ];
}