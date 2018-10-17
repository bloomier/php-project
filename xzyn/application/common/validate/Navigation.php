<?php
namespace app\common\validate;
//网站导航验证器
use think\Validate;

class Navigation extends Validate {
	protected $rule = [
		'name' => 'require',
		'title' => 'require|alpha',
		'url' => 'require',
		'type' => 'require|number',
		'orderby' => 'number',
		'icon' => 'alphaDash',
		'iconcolor' => 'alphaDash',
		'news' => 'max:6',
		'bgcolor' => 'alphaDash',

	];

	protected $message = [
		'name.require' => '导航名称必填',
		'title.require' => '导航别名必填',
		'title.alpha' => '导航别名只能是字母',
		'url.require' => 'URL必填',
		'type.require' => '分类必填',
		'type.number' => '分类必须是数字',
		'orderby.number' => '排序必须是数字',
		'icon.alphaDash' => 'icon图标只能是字母、数字和下划线_及破折号-',
		'iconcolor.alphaDash' => '图标颜色只能是字母、数字和下划线_及破折号-',
		'news.max' => '角标信息不能超过6位',
		'bgcolor.alphaDash' => '角标背景颜色只能是字母、数字和下划线_及破折号-',
	];

	protected $scene = [
		'add' => ['name', 'title', 'url', 'type', 'orderby','icon','iconcolor','news','bgcolor'],
		'name' => ['name'],
		'title' => ['title'],
		'url' => ['url'],
		'type' => ['type'],
		'orderby' => ['orderby'],
		'icon' => ['icon'],
		'iconcolor' => ['iconcolor'],
		'closed' => ['closed'],
		'target' => ['target'],
		'news' => ['news'],
		'bgcolor' => ['bgcolor']
	];
}
