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
class MonitorNodesController extends BaseController {

    public function index(){
        $this->display("./monitor-nodes");
       
    }

    // 获取周期性任务、一次性任务和节点实时监测的数据
    public function getData(){
        $json=http_post(C("WARN_FILTER_PATH")."/api/node/status/list",null,'json');
        $this->ajaxReturn($json);

    }

    public function getPhysicalHostState(){
        $param = array();
        $param['ips'] = $this->getIpsStr();
        $json=http_post(C("ZBBIX_PATH")."/host-info/host/info",$param,'json');
        $result = array("code"=>0,"items"=>array());
        if($json['code'] == 0){
            $arrs = (array)$json['hostinfo'];
            // dump($arr);
            $result['code'] = 1;
            foreach($arrs as $key=>$value){
                //dump($value);
                $value['node'] = $this->getPrinceByIp($key);
                $result["items"][$value['node']] = $value;
            }
            // dump($result);
        }
        // die();
        $this->ajaxReturn($result);
    }

    public function getIpsStr(){
        $ipsArr = $this->getAllIps();
        $tmpArr = array_keys($ipsArr);
        return implode(',',$tmpArr);
    }

    public function getPrinceByIp($ip){
        $ipsArr = $this->getAllIps();
        return $ipsArr[$ip];
    }

    public function getAllIps(){
        return array(
            "119.97.178.200"=>"湖北",
            "222.211.83.18"=>"四川",
            "113.140.43.136"=>"陕西",
            "171.111.153.177"=>"广西",
            "14.152.106.130"=>"广东",
            "182.87.223.95"=>"江西",
            "117.27.142.61"=>"福建",
            "182.118.62.243"=>"河南",
            "222.87.128.49"=>"贵州",
            "103.6.223.246"=>"上海",
            "60.174.242.3"=>"安徽",
            "112.67.250.27"=>"海南",
            "218.75.153.26"=>"湖南",
            "60.221.255.69"=>"山西",
            "61.162.234.25"=>"山东",
            "112.117.216.163"=>"云南",
            "221.229.164.194"=>"江苏",
            "221.8.221.51"=>"吉林",
            "221.206.126.16"=>"黑龙江",
            "123.150.105.114"=>"天津",
            "120.131.67.219"=>"北京",
            "1.180.183.46"=>"内蒙古",
            "124.119.87.251"=>"新疆",
            "202.100.78.88"=>"甘肃",
            "124.31.219.234"=>"西藏",
            "172.16.3.117"=>"辽宁",
            "223.220.250.108"=>"青海",
            "172.16.2.70"=>"浙江",
            "218.95.142.220"=>"宁夏"
        );
    }


   /* public function getWebSafeLevelData(){
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
    }*/




}