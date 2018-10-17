<?php
namespace Admin\Controller;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;
use Common\Vendor\Util;
use Think\Controller;
use Think\Hook;
use Think\Verify;


class LocationController extends BaseController {
    public function getLocationSelectorData(){
        $json=file_get_contents("./Public/asset/source/province-city-dist.json");
        $json=json_decode($json,true);
        //转成前端需要的格式
        $arr=array();
        foreach($json as $province=>$citys){
            $p_arr=array(p=>$province);
            foreach($citys as $city=>$dists){
                $c_arr=array(n=>$city);
                if($dists){
                    foreach($dists as $dist){
                        $d_arr=array(s=>$dist);
                        $c_arr['a'][]=$d_arr;
                    }
                }
                $p_arr['c'][]=$c_arr;
            }
            $arr[]=$p_arr;
        }
        $this->ajaxReturn(array("citylist"=>$arr));



    }
    public function getSubLocations(){
        $province=I("province");
        $city=I("city");
        $json=file_get_contents("./Public/asset/source/province-city-dist.json");
        $json=json_decode($json,true);
//        dump($json);
        if(!$province){

           $this->ajaxReturn(array_keys($json));
        }else if(!$city){
            $json=$json[$province];
            $this->ajaxReturn(array_keys($json));
        }else{
            $json=$json[$province][$city];

            $this->ajaxReturn(array_values($json));
        }
        $this->ajaxReturn(array());
    }



}