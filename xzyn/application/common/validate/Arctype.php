<?php
namespace app\common\validate;
//文章分类验证器
use think\Validate;

class Arctype extends Validate
{
    protected $rule = [
        'pid' => 'require|integer',
        'typename' => 'require',
        'mid' => 'require|integer',
        'dirs' => 'require|/^[a-zA-Z0-9\-\_]+$/',
        'target' => 'require',
        'templist' => 'require|/^[a-zA-Z0-9\_]+$/',
        'temparticle' => 'require|/^[a-zA-Z0-9\_]+$/',
        'pagesize' => 'require|integer|>=:1',
        'sorts' => 'require|integer|>=:1',
        'status' => 'require|in:0,1',
        'is_release' => 'in:0,1',
        'is_daohang' => 'in:0,1',
    ];

    protected $message = [
        'pid' => '上级分类必须为数字整数',
        'typename' => '分类名称不能为空',
        'mid' => '分类模型必须为数字整数',
        'dirs.require' => '分类目录不能为空',
        'dirs' => '分类目录必须为（数字字母-_）',
        'target' => '弹出方式不能为空',
        'templist' => '列表页模板必须为（数字字母_）',
        'temparticle' => '内容页模板必须为（数字字母_）',
        'pagesize' => '分页条数必须为大于0数字整数',
        'sorts' => '排序必须为大于0数字整数',
        'status' => '状态必须为数字整数（0,1）',
        'is_release' => '是否允许发布必须为数字整数（0,1）',
    ];

    protected $scene = [
        'add'   => ['pid', 'typename', 'mid', 'dirs', 'target', 'templist', 'temparticle', 'pagesize', 'sorts', 'status'],
        'edit'  => ['pid', 'typename', 'mid', 'dirs', 'target', 'templist', 'temparticle', 'pagesize', 'sorts', 'status'],
        'status' => ['status'],
        'typename' => ['typename'],
        'dirs' => ['dirs'],
        'is_release' => ['is_release'],
        'is_daohang' => ['is_daohang'],
    ];
}