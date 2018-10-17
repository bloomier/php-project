<?php
namespace API\Controller;
use Think\Controller\RestController;
class CensusController extends RestController {


    // 获取安全事件省份排名top N
    public function getSecurityEventTop(){
        $data = array(
            code=>1,
            msg=>'获取成功',
            data=>array(
                array(
                    name=>'浙江',
                    count=>48386,
                ),
                array(
                    name=>'香港',
                    count=>16489,
                ),
                array(
                    name=>'北京',
                    count=>11283,
                ),
                array(
                    name=>'广东',
                    count=>6324,
                ),
                array(
                    name=>'上海',
                    count=>4915,
                ),
                array(
                    name=>'江苏',
                    count=>4460,
                ),
            )
        );
        $this->ajaxReturn($data);
    }

    // 获取高、中、低、信息总数
    public function vulsCensus(){
        $data = array(
            code=>1,
            msg=>'获取成功',
            data=>array()
        );
        $result = getVulsCensus();

        $listMap = $result['items'];

        for($i = 0; $i  < count($listMap) ; $i++){
            $data['data'][] = array(name=>$listMap[$i]['name'], count=>$listMap[$i]['value']);

        }

        $this->ajaxReturn($data);
    }

    // 获取扫描网站数，发现漏洞数
    public function webCountAll(){
        $result = getCountCensus();
        $data = array(
            code=>1,
            msg=>'获取成功',
            data=>array(
                array(name=>'网站总数', count=>$result['count']['other']),
                array(name=>'漏洞总数', count=>$result['danger']['other'])
            )
        );
       $this->ajaxReturn($data);
    }

    // 按漏洞类型获取TOP N
    public function vulsTopN(){
        $result = getVulsTopN();
        $data = array(
            code=>1,
            msg=>'获取成功',
            data=>array(
            )
        );
        $listItem = $result['items'];
        for($i = 0; $i  < count($listItem) ; $i++){
            $data['data'][] = array(name=>$listItem[$i]['name'], count=>$listItem[$i]['value']);
        }
        $this->ajaxReturn($data);
    }
}
