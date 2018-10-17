<?php
namespace app\common\validate;
//贴吧帖子验证器
use think\Validate;

class Post extends Validate
{
    protected $rule = [
        'title' => 'require',
        'details' => 'require',
        'click' => 'number',
        'reply_num' => 'number',
        'zan_num' => 'number',
        'uid' => 'require|number',
        'audit' => 'in:0,1',
        'is_fine' => 'in:0,1',
        'is_top' => 'in:0,1',
        'is_tui' => 'in:0,1',
        'orderby' => 'number',
    ];

    protected $message = [
        'title.require' => '标题不能为空',
        'details.require' => '内容不能为空',
        'click.number' => '浏览数量必须为数字整数',
        'uid.require' => 'UID不能为空',
        'uid.number' => 'UID必须为数字整数',
        'audit' => '审核必须为数字整数（0,1）',
        'is_fine' => '精华必须为数字整数（0,1）',
        'is_top' => '置顶必须为数字整数（0,1）',
        'is_tui' => '推荐必须为数字整数（0,1）',
        'reply_num.number' => '回复数量必须为数字整数',
        'zan_num.number' => '赞数量必须为数字整数',
        'orderby.number' => '排序必须为数字整数',
    ];

    protected $scene = [
        'add'   => ['title', 'details', 'uid', 'audit'],
//      'edit'  => ['typeid', 'title', 'click', 'status', 'create_time'],
        'audit' => ['audit'],
        'zan_num' => ['zan_num'],
    ];
}