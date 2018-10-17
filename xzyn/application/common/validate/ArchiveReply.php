<?php
namespace app\common\validate;
//文章回复验证器
use think\Validate;

class ArchiveReply extends Validate
{
    protected $rule = [
        'contents' => 'require',
        'aid' => 'require',
        'uid' => 'require|number',
        'audit' => 'require|in:0,1',
    ];

    protected $message = [
        'contents.require' => '回复内容不能为空',
        'aid.require' => '文章ID不能为空',
        'uid.require' => 'UID不能为空',
        'uid.number' => 'UID必须为数字整数',
        'audit' => '状态必须为数字整数（0,1）',
    ];

    protected $scene = [
        'add'   => ['contents', 'aid'],
        'edit'  => ['contents', 'audit'],
        'audit' => ['audit'],
        'zan_num' => ['zan_num'],
    ];
}