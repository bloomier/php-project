<?php
namespace ScreenCenter\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;


/**
 * 智能节点大屏展示
 * Class BrainNodesController
 * @package InfoCenter\Controller
 */
class BrainNodesController extends BaseController {



    public function index(){
        $this->display("./storm-nodes");
       
    }

    public function getWebSafeLevelData(){
        // $result = getVulsCensus();
        $result = http_post(C('STORM_CENTER_PATH')."/queryVirusLevelCount", array(), 'json');
        $listMap = $result['items'];
        for($i = 0; $i  < count($listMap) ; $i++){
            $json['yAxis'][]=$listMap[$i]['name'];
            $json['values'][] = 0 - $listMap[$i]['value'];
        }
        $json['yAxis'] = array_reverse($json['yAxis']);
        $json['values'] = array_reverse($json['values']);
        $json['src'] = $listMap;
        $this->ajaxReturn($json);
    }

    public function getProvinceWebStatusData(){
        $result = http_post(C('STORM_CENTER_PATH')."/screencenter/brainNodesOfScrren/queryProvince", array(), 'json');

        $listMap = $result['items'];
        for($i = 0; $i  < count($listMap) ; $i++){
            $json['yAxis'][]=$listMap[$i]['name'];
            $json['values'][]=$listMap[$i]['value'];
        }
        $json['yAxis'] = array_reverse($json['yAxis']);
        $json['values'] = array_reverse($json['values']);
        $this->ajaxReturn($json);
    }

    // 统计数据
    public function getStatusCount(){

        $count=http_post(C('STORM_CENTER_PATH')."/screencenter/brainNodesOfScrren/queryUrlCount",array(),'json');
        $danger=http_post(C('STORM_CENTER_PATH')."/screencenter/brainNodesOfScrren/queryVirusCount",array(),'json');

        $json["count"]=(int)($count['other'] * 0.00599 + $danger['other'] * 0.00389);
        $json["danger"]=$danger['other'];
        $json["data"]=$count['other'];

        $this->ajaxReturn($json);
    }




}