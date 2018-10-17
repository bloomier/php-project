<?php
namespace app\common\validate;
//文章验证器
use think\Validate;

class Archive extends Validate
{
    protected $rule = [
        'typeid' => 'require|integer',
        'title' => 'require',
        'click' => 'require|integer|>=:0',
        'status' => 'require|in:0,1',
        'create_time' => 'require',
        'reply_num' => 'number',
        'zan_num' => 'number',
    ];

    protected $message = [
        'typeid' => '所属分类不能为空',
        'title' => '标题不能为空',
        'click' => '点击数必须为大于等于0数字整数',
        'status' => '状态必须为数字整数（0,1）',
        'create_time' => '创建时间不能为空',
        'reply_num.number' => '回复数量必须为数字整数',
        'zan_num.number' => '赞数量必须为数字整数',
    ];

    protected $scene = [
        'add'   => ['typeid', 'title'],
        'edit'  => ['typeid', 'title', 'click', 'status', 'create_time'],
        'status' => ['status'],
        'title' => ['title'],
        'writer' => ['writer'],
    ];
}