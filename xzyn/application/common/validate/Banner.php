<?php
namespace app\common\validate;

use think\Validate;

class Banner extends Validate
{
    protected $rule = [
        'title' => 'require',
        'sorts' => 'require|integer|>=:1',
        'status' => 'require|in:0,1',
    ];

    protected $message = [
        'title' => '标题不能为空',
        'sorts' => '排序必须为大于0数字整数',
        'status' => '状态必须为数字整数（0,1）',
    ];

    protected $scene = [
        'add'   => ['title', 'sorts', 'status'],
        'edit'  => ['title', 'sorts', 'status'],
        'status' => ['status'],
        'title' => ['title'],
        'url' => ['url'],
    ];
}