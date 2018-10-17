<?php
namespace app\common\validate;

use think\Validate;

class Comment extends Validate
{
    protected $rule = [
        'status' => 'require|in:0,1',
    ];

    protected $message = [
        'status' => '状态必须为数字整数（0,1）',
    ];

    protected $scene = [
        //'add'   => ['status'],
        'edit'  => ['status'],
        'status' => ['status'],
    ];
}