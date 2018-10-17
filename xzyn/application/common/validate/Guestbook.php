<?php
namespace app\common\validate;

use think\Validate;

class Guestbook extends Validate
{
    protected $rule = [
        'title' => 'require',
        'email' => 'email',
        'status' => 'require|in:0,1',
        'content' => 'require',
    ];

    protected $message = [
        'title' => '标题不能为空',
        'email' => '请填写正确的邮箱格式',
        'status' => '状态必须为数字整数（0,1）',
        'content' => '内容不能为空',
    ];

    protected $scene = [
        'add'   => ['title', 'email', 'status', 'content'],
        'edit'  => ['title', 'email', 'status', 'content'],
        'status' => ['status'],
    ];
}