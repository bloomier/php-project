<?php
namespace app\common\validate;

use think\Validate;

class Music extends Validate
{
    protected $rule = [
        'name' => 'require',
        'author' => 'require',
        'src' => 'require|url',
        'cover' => 'require|url',
        'status' => 'require|in:0,1',
    ];

    protected $message = [
        'name' => '歌名填项',
        'author' => '歌手名字必填',
        'src' => '音乐地址必填',
        'src.url' => '音乐URL地址不正确',
        'cover' => '封面图片地址',
        'cover.url' => '封面图片URL地址不正确',
        'status' => '是否启用必须为数字整数（0,1）',
    ];

    protected $scene = [
        'add'   => ['name', 'author', 'src', 'cover', 'status'],
        'edit'  => ['name', 'author', 'src', 'cover', 'status'],
        'status' => ['status'],
        'name' => ['name'],
        'author' => ['author'],
        'src' => ['src'],
        'cover' => ['cover'],
        'status' => ['status'],
        'orderby' => ['orderby'],
    ];
}