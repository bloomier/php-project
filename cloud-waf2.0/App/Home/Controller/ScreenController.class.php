<?php
namespace Home\Controller;
use Admin\Controller\BaseController;
use Common\Vendor\Constants;
use Common\Vendor\Permission;
use Think\Controller;
use Common\Model\StringModel;

/**
 * Class DailyReportController
 * @package Home\Controller
 * 实时大屏的控制器
 */

class ScreenController extends BaseController {
    public function index(){
        $domain=I('domain');
        $permission=new Permission();
        $ret=$permission->check_domain_user($domain,current_user_id());
        if(!$ret){//无权限
            $this->error("对不起,您没有查看该网站报告的权限");
        }
        $md = new StringModel(Constants::$DB_ASSET);
        $row = $md->field('title,_id')->where(array(_id=>$domain))->find();
        if($row && $row['title'] && $row['title'] != ''){
            $this->assign("title",$row['title']);
        } else {
            $this->assign("title",$domain);
        }
        $this->assign("domain",$domain);
        $this->display("./page/screen");


    }

    public function visitAreaTopN(){

        $json=http_post(C(Constants::$PATH_API)."/api/topN/visit/area",array("keys"=>I('domain'), "point"=>I('point')),'json');
        $data=array();
        foreach($json['data'] as $k=>$v){
            $data[]=array("name"=>$k,"value"=>$v);
        }
        $json['dataList']=$data;
        $json['size']=$json['total'];
        $this->ajaxReturn($json);
    }

    public function sitaAvail(){
        $domain=I("domain");
        $json=http_post(C("WARN_FILTER_PATH")."/api/webAccessInfo",array("domain"=>$domain),'json');
        $data=$json['data'];
        $access=array();
        foreach ($data as $key=>$value) {
            $http_code=$value['other']['http_code'];
            if($http_code>=200 && $http_code<400){
                $access[$key]=$value['other']['response_time'];
            }else{
                $access[$key]=-1;
            }
        }
        $this->ajaxReturn($access);
    }

    public function attackIpTopN(){  //visitIpTopN
        $json=http_post(C(Constants::$PATH_API)."/api/topN/attack/ip",array("keys"=>I('domain'),"point"=>I('point')),'json');
        $json['dataList']=$json['items'];
        $json['size']=$json['total'];
        $this->ajaxReturn($json);
    }
    public function visitIpTopN(){  //attackIpTopN
        $json=http_post(C(Constants::$PATH_API)."/api/topN/visit/ip",array("keys"=>I('domain'),"point"=>I('point')),'json');
        $json['dataList']=$json['items'];
        $json['size']=$json['total'];
        $this->ajaxReturn($json);
    }

    public function attackUrlTopN(){
        $json=http_post(C(Constants::$PATH_API)."/api/topN/attack/url",array("keys"=>I('domain'), "point"=>I('point')),'json');
        $data=array();
        foreach($json['data'] as $k=>$v){
            $data[]=array("name"=>$k,"value"=>$v);
        }
        $json['dataList']=$data;

        $this->ajaxReturn($json);
    }

    public function getVulsMsg(){
        $vidName = array();
        if(S("vidName")){
            $vidName = S("vidName");
        } else {
            $jsonTemp = http_post(C(Constants::$PATH_STORM_CENTER)."/vuls/policyMapper", null, 'json');
            if(intval($jsonTemp['code']) == 1){
                foreach($jsonTemp['data'] as $k=>$v){
                    $vidName[$v['vid']] = $v['vname'];
                }
                //缓存一个小时
                S("vidName", $vidName, array('type'=>'file','expire'=>3600));
            }
        }


        $json=http_post(C(Constants::$STORM_CENTER_PATH)."/vuls/info/domain",array("domain"=>I('domain')),'json');
        //dump($json);
        $temp = array();
        if(intval($json['code']) == 1){

            if($json['detail'] && $json['detail']['high']){
                $high = $json['detail']['high']['vuls_detail'];
                foreach($high as $k=>$v){
                    $name = $vidName[$k] ? $vidName[$k] : $k;
                    $temp[] = array("name"=>$name,"value"=>count($v));
                }
            }
            if($json['detail'] && $json['detail']['mid']){
                $mid = $json['detail']['mid']['vuls_detail'];
                foreach($mid as $k=>$v){
                    $name = $vidName[$k] ? $vidName[$k] : $k;
                    $temp[] = array("name"=>$name,"value"=>count($v));
                }
            }
            if($json['detail'] && $json['detail']['low']){
                $low = $json['detail']['low']['vuls_detail'];
                foreach($low as $k=>$v){
                    $name = $vidName[$k] ? $vidName[$k] : $k;
                    $temp[] = array("name"=>$name,"value"=>count($v));
                }
            }
        }

        $result = array(code=>1,dataList=>$temp);
        $this->ajaxReturn($result);
    }

    public function todayVisitsAndAttacks(){
        $json=http_post(C(Constants::$PATH_API)."/api/lasest/total/counter",array("keys"=>I("domain")),'json');
        $this->ajaxReturn($json);
    }
    public function visitAndAttackCount(){
        $json=http_post(C(Constants::$PATH_API)."/api/lasest/visit_attack/countlist",array('keys'=>I('domain'),"point"=>I("point")),'json');
        $this->ajaxReturn(array("visit"=>$json['data']['visit'],"attack"=>$json['data']['attack']));
    }
    public function flowInAndOutCount(){
        $json=http_post(C(Constants::$PATH_API)."/api/lasest/flow/countlist",array('keys'=>I('domain'),"point"=>I("point")),'json');
        $this->ajaxReturn(array("flowIn"=>$json['data']['flowIn'],"flowOut"=>$json['data']['flowOut']));
    }
    public function visitAndattackReal(){
        $json=http_post(C(Constants::$PATH_API)."/api/lasest/worldMapData/list",array("keys"=>I("domain")),'json');
        $data=http_post(C(Constants::$PATH_API)."/api/lasest/item/list",array("keys"=>I("domain"),"point"=>120,"num"=>1000),'json');
        $json['data']['items']=$data['data']['attack'];
        $this->ajaxReturn($json['data']);

    }





}