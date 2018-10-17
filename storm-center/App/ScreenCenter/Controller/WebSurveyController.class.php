<?php
namespace ScreenCenter\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;


class WebSurveyController extends BaseController {

    public function index(){
        $this->display("./web-survey");

    }
    /**
     * 查询网站可用性中异常，可用，不可用的网站统计个数
     */
    public function getWebAvailCount(){
        if(I("type")){
            $param['type'] = I('type') - 1;
        }
        if(I("http_code")){
            $param['http_code'] = I('http_code');
        }
        $result = http_post(C('STORM_CENTER_PATH')."/screencenter/webSurveyOfScreen/countMonitorSite",$param,"json");
        $resultArray = array("code"=>0, "count"=>0);
        if($result['code']){
            $resultArray["code"]=1;
            $resultArray["count"]=$result['other'];
        }
        $this->ajaxReturn($resultArray);
    }

    /**
     * 查询网站可用性断网记录
     */
    public function getOfflineRecord(){
        $param['type']=0;
        $param['start'] = 0;
        $param['limit'] = 50;
        $result = http_post(C('STORM_CENTER_PATH')."/screencenter/webSurveyOfScreen/queryMonitorNodeRecord",$param,"json");
        $resultArray = array("code"=>0, "items"=>array());
        if($result['code']){
            $resultArray["code"]=1;
            $resultArray["items"]=$result['items'];
        }
        $this->ajaxReturn($resultArray);
    }

    public function getWebAccessGroup(){
        $result = http_post(C('STORM_CENTER_PATH')."/screencenter/webSurveyOfScreen/queryAccessGroupCount",null,"json");
        $resultArray = array("code"=>0, "items"=>array());
        if($result['code']){
            $resultArray["code"]=1;
            $resultArray["items"]=$result['items'];
        }
        $this->ajaxReturn($resultArray);
    }

    /**
     * 查询网站可用性中区域网站个数统计
     */
    public function getRegionWebCount(){
        $result = http_post(C('STORM_CENTER_PATH')."/screencenter/webSurveyOfScreen/queryRegionWebCount",null,"json");
        $resultArray = array("code"=>0, "items"=>array());
        if($result['code']){
            $resultArray["code"]=1;
            $resultArray["items"]=$result['other'];
        }
        $this->ajaxReturn($resultArray);
    }

    public function getTypeGroup(){
        $result = http_post(C('STORM_CENTER_PATH')."/screencenter/webSurveyOfScreen/queryTypeGroup",null,"json");
        $resultArray = array("code"=>0, "items"=>array());
        if($result['code']){
            $resultArray["code"]=1;
            $resultArray["items"]=$result['items'];
        }
        $this->ajaxReturn($resultArray);
    }

    /**
     * 查询网站可用性中区域指纹信息group by 统计
     */
    public function getRegionTypeGroup(){
        $param["region"] = "北京,香港,浙江,江苏,广东,上海";
        $result = http_post(C('STORM_CENTER_PATH')."/screencenter/webSurveyOfScreen/queryRegionTypeGroup",$param,"json");
        $resultArray = array("code"=>0, "items"=>array());
        if($result['code']){
            $resultArray["code"]=1;
            $resultArray["items"]=$result['other'];
        }
        $this->ajaxReturn($resultArray);
    }

    /**
     * 查询网站可用性中打文件分类
     */
    public function getBigFileGroup(){
        $result = http_post(C('STORM_CENTER_PATH')."/screencenter/webSurveyOfScreen/groupMonitorSiteCount",null,"json");
        $resultArray = array("code"=>0, "items"=>array());
        if($result['code']){
            $resultArray["code"]=1;
            $resultArray["items"]=$result['items'];
        }
        $this->ajaxReturn($resultArray);
    }

    /**
     * 查询网站可用性中大文件group
     */
    public function getBigFileLevelGroup(){
        $result = http_post(C('STORM_CENTER_PATH')."/screencenter/webSurveyOfScreen/queryBigFileLevelCount",null,"json");
        $resultArray = array("code"=>0, "items"=>array());
        if($result['code']){
            $resultArray["code"]=1;
            $resultArray["items"]=$result['items'];
        }
        $this->ajaxReturn($resultArray);
    }

}