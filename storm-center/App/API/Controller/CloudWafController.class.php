<?php
namespace API\Controller;
use Home\Globals\Constants;
use Think\Controller\RestController;

/**
 * Class WebSurveyController
 * @package API\Controller
 * 网站普查的一些接口
 */
class CloudWafController extends RestController {

    public function listTask(){
        $result = https_post(C('CLOUD_WAF_PATH')."/webapp/list", null, 'json');
        if($result){
            $data['code']=1;
            $data['total'] =0;
            $data['rows'] = array();
            foreach($result as $key=>$value){
                $data['rows'][]=$value;
                $data['total']=$data['total']+1;
            }
        }
        $this->ajaxReturn($data);
    }
    public function defenseCount(){
        $result = https_post(C('CLOUD_WAF_PATH')."/webapp/list", null, 'json');
        $data['total'] = 0;
        $data['defenseTotal'] = 0;
        if($result){
            foreach($result as $key=>$value){
                $data['total']=$data['total']+count($result[$key]['domain']);
                if($result[$key]['bypass'] == 0){
                    $data['defenseTotal'] = $data['defenseTotal']+count($result[$key]['domain']);
                }
            }
        }
        $this->ajaxReturn($data);
    }



    /**
     * 批量添加
     * @return array|mixed
     */
    public function addTask(){
        $ajaxResult = array("code"=>1,"list"=>array());
        $domainlist = explode(",", I('domain'));
        $waflist =  urldecode(I('domainList'));
        $waflist = str_replace("&quot;", '"', $waflist);
        $waflist = json_decode($waflist);
        $result = array();
        for($i = 0; $i < count($waflist); $i++){
            $tmpJson = https_post(C('CLOUD_WAF_PATH')."/webapp/create", $waflist[$i], 'json');
            if(!$tmpJson["error"][0]){
                $result[] = array("domain"=>$domainlist[$i], "webapp_id"=>$tmpJson['webapp_id']);
            }else{
                if($tmpJson["error"][0] == 4355){
                    $result[] = array("domain"=>$domainlist[$i], "webapp_id"=>$tmpJson['webapp_id']);
                }else{
                    $ajaxResult['code'] = 0;
                    $ajaxResult['srcError'] = $tmpJson;
                    break;
                }
            }
        }
        $ajaxResult['list'] = $result;
        $this->ajaxReturn($ajaxResult);
    }

    public function deleteTask(){
        $result = array("code"=>1);
        $wafidlist = explode(",", I("wafidlist"));
        for($i = 0; $i < count($wafidlist); $i++){
            $tmpJson = https_post(C('CLOUD_WAF_PATH')."/webapp/delete", array("id"=>$wafidlist[$i]), 'json');
            if($tmpJson["error"][0]){
                $result['code'] = 0;
            }
        }
        $this->ajaxReturn($result);
    }

}