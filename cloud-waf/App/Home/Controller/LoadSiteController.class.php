<?php
/**
 * Created by PhpStorm.
 * User: jianghaifeng
 * Date: 2016/3/1
 * Time: 14:25
 */

namespace Home\Controller;
use Think\Controller;
use Common\Model\StringModel;
use Common\Vendor\Constants;

class LoadSiteController extends Controller {


    public function loadSite(){
        $result = array("code"=>0,"msg"=>"失败","items"=>array());
        $md=new StringModel(Constants::$DB_ASSET);
        $rows = $md->field(array("_id"=>true))->select();
        //
        if($rows){
            $result = array("code"=>1,"msg"=>"成功","items"=>array_keys($rows));
        }
        $this->ajaxReturn($result);
    }




}