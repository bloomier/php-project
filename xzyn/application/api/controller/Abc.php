<?php
namespace app\api\controller;

use app\common\model\ApiApp as ApiApps;
use app\common\model\ApiList as ApiLists;
use app\common\model\Image;
use expand\Str;
use expand\ApiReturn;

class Abc extends Base {
    public function initialize(){
        parent::initialize();
//		p('Index');
    }

    public function index($hash) {
    	$apiInfo = cache('apiInfo_'.$hash);	//接口信息
		$data = cache('input_'.$hash);	//请求字段
		$header = request()->header();
		$image = new Image;

		$Archive = new \app\common\model\Archive;
		$Arctype = new \app\common\model\Arctype;
		$Collect = new \app\common\model\Collect;

//		$arctype_data = $Arctype->where(['is_release'=>1,'status'=>1])->order('sorts asc')->column('id');


		return ApiReturn::r(1,$header);

//		return ApiReturn::r(1,$image->id);
    }


}
