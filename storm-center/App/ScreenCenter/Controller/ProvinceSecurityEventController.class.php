<?php
namespace ScreenCenter\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;


class ProvinceSecurityEventController extends BaseController {



    public function index(){
        $province = "浙江";
        if(I('province')){
           $province = I('province');
        }
        $this->assign("province", $province);
        $this->getEventType();
        $this->display("./security-event-province");

    }

    // -- 网站综合评估


    // 获取省份网站大文件
    public function provinceBigFile(){
        $ary = array("code"=>0, "value" => array());
        $param['province'] = I('province');
        $param['limit'] = I('limit');
        $value = http_post(C('STORM_CENTER_PATH')."/screencenter/provinceSecurityEvent/queryBigSiteByProvince", $param, 'json');
        if($value['code']){
            $ary['code'] = 1;
            $ary['value'] = $value['items'];
        }
        $this->ajaxReturn($ary);
    }

    // 获取省份高危险网站明细
    public function provinceHighVulsInfo(){
        $ary = array("code"=>0, "value" => array());
        $param['province'] = I('province');
        $param['limit'] = I('limit');
        $value = http_post(C('STORM_CENTER_PATH')."/screencenter/provinceSecurityEvent/highVulsProvince", $param, 'json');
        if($value['code']){
            $ary['code'] = 1;
            $ary['value'] = $value['other']['value'];
            $ary['count'] = $value['other']['count'];
        }
        $this->ajaxReturn($ary);
    }

    // 获取省份安全事件图片列表
    public function provinceSecurityPic(){
        $ary = array("code"=>0, "value" => array(), "imagePath"=>C('IMAGE_SERVER'));
        $param['web_ip_province'] = I('province');
        $value = http_post(C('STORM_CENTER_PATH')."/screencenter/provinceSecurityEvent/queryProvincePhotoList", $param, 'json');
        if($value['code']){
            $ary['code'] = 1;
            $ary['value'] = $value['items'];
        }
        $this->ajaxReturn($ary);
    }
    //获取图片安全事件类型
    private function getEventType(){
        $data = http_post(C('STORM_CENTER_PATH')."/screencenter/provinceSecurityEvent/queryEventType", null, "json");
        $this->assign('eventType',urlencode(json_encode($data['items'])));
    }

    // 获取省份最新安全事件列表
    public function provinceSecurityList(){
        $ary = array("code"=>0, "value" => array(), "count"=>0);
        $param['web_ip_province'] = I('province');
        $param['audit_state'] = 1;
        $param['start'] = 0;
        $param['limit'] = I('limit');
        $value = http_post(C('STORM_CENTER_PATH')."/screencenter/provinceSecurityEvent/selectEventInfo", $param, 'json');
        if($value['code']){
            $ary['code'] = 1;
            $ary['value'] = $value['items'];
            $ary['count'] = $value['other'];
        }
        $this->ajaxReturn($ary);
    }

    // 获取省份安全事件市区分布
    public function provinceSecurityGroup(){
        $ary = array("code"=>0, "value" => array());
        $param['web_ip_province'] = I('province');
        $value = http_post(C('STORM_CENTER_PATH')."/screencenter/provinceSecurityEvent/queryGroupByProvince", $param, 'json');
        if($value['code']){
            $ary['code'] = 1;
            $ary['value'] = $value['items'];
        }
        $this->ajaxReturn($ary);
    }


    // 获取省份各个区域政府网站分布（一级域名）
    public function provinceDomainOneGroup(){
        $ary = array("code"=>0, "value" => array());
        $param['province'] = I('province');
        $param['domain0'] = I('domain0');
        $value = http_post(C('STORM_CENTER_PATH')."/screencenter/provinceSecurityEvent/queryDomainOneByProvinceGroup", $param, 'json');
        if($value['code']){
            $ary['code'] = 1;
            $ary['value'] = $value['items'];
        }
        $this->ajaxReturn($ary);
    }

    // 获取省份各个区域政府网站分布(二级域名)
    public function provinceDomainTwoGroup(){
        $ary = array("code"=>0, "value" => array());
        $param['province'] = I('province');
        $param['domain0'] = I('domain0');
        $value = http_post(C('STORM_CENTER_PATH')."/screencenter/provinceSecurityEvent/queryDomainTwoByProvinceGroup", $param, 'json');
        if($value['code']){
            $ary['code'] = 1;
            $ary['value'] = $value['items'];
        }
        $this->ajaxReturn($ary);
    }

    // 获取省份网站总数
    public function provinceDomainCount(){
        $ary = array("code"=>0, "value" => array());
        $param['province'] = I('province');
        if(I('domain0')){
            $param['domain0'] = I('domain0');
        }
        $value = http_post(C('STORM_CENTER_PATH')."/screencenter/provinceSecurityEvent/queryDomainOneCount", $param, 'json');
        if($value['code']){
            $ary['code'] = 1;
            $ary['value'] = $value['total'];
        }
        $this->ajaxReturn($ary);
    }

    // 获取省份二级域名总数
    public function provinceDomainTwoCount(){
        $ary = array("code"=>0, "value" => array());
        $param['province'] = I('province');
        $param['domain0'] = I('domain0');
        $value = http_post(C('STORM_CENTER_PATH')."/screencenter/provinceSecurityEvent/queryDomainTwoByProvinceCount", $param, 'json');
        if($value['code']){
            $ary['code'] = 1;
            $ary['value'] = $value['total'];
        }
        $this->ajaxReturn($ary);
    }

    // 获取省份无效域名及异常访问
    public function provinceMonitorCount(){
        $ary = array("code"=>0, "value" => array());
        $param['province'] = I('province');
        $param['start'] = 0;
        $param['limit'] = 0;
        if(I('http_code') == -2){
            $param['http_code'] = -2;
        }else{
            $param['type'] = 0;
        }
        $value = http_post(C('STORM_CENTER_PATH')."/screencenter/provinceSecurityEvent/queryMonitorSite", $param, 'json');
        if($value['code']){
            $ary['code'] = 1;
            $ary['value'] = $value['other'];
        }
        $this->ajaxReturn($ary);
    }



}