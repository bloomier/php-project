<?php
namespace app\common\validate;
//贴吧回复验证器
use think\Validate;

class PostReply extends Validate
{
    protected $rule = [
        'contents' => 'require',
        'post_id' => 'number',
        'zan_num' => 'number',
        'uid' => 'require|number',
        'audit' => 'in:0,1',
    ];

    protected $message = [
        'contents.require' => '内容不能为空',
        'post_id.number' => '帖子ID必须为数字整数',
        'uid.require' => 'UID不能为空',
        'uid.number' => 'UID必须为数字整数',
        'audit' => '审核必须为数字整数（0,1）',
        'zan_num.number' => '赞数量必须为数字整数',
    ];

    protected $scene = [
        'add'   => ['contents', 'uid', 'audit'],
//      'edit'  => ['title', 'title', 'click', 'status', 'create_time'],
        'audit' => ['audit'],
        'zan_num' => ['zan_num'],
    ];
}