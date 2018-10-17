<?php
namespace ScreenCenter\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;


class SecurityEventController extends BaseController {



    public function index(){
        $this->display("./security-event");

    }

    //该方法已废弃  原先一次性获取所有数据
    public function getSecurityEventValue(){
        $json = http_post(C('STORM_CENTER_PATH')."/getSecurityEventOfScreen",null,"json");
        $result['code']=1;
        $result['msg']=C('IMAGE_SERVER');
        $result['data']=$json[data];
        $this->ajaxReturn($result);
    }

    //获取安全事件地图数据
    public function getSecurityEventMapdata(){
        $json = http_post(C('STORM_CENTER_PATH')."/screencenter/SecurityEvent/getEventOfScreenValue",null,"json");

        $result['code']=1;
        $result['msg']=$json[msg];
        $result['data']=$json[data];
        $this->ajaxReturn($result);
    }

    //获取密信通报记录
    public function getReportList(){
        $json = http_post(C('STORM_CENTER_PATH')."/screencenter/securityEvent/getSecurityEventMixinHis",null,"json");

        $result['code']=1;
        $result['msg']=$json[msg];
        $result['data']=$json[items];
        $this->ajaxReturn($result);
    }

    //获取安全事件图片
    public function getEventPics(){
        $json = http_post(C('STORM_CENTER_PATH')."/screencenter/securityEvent/getSecurityEventPic",array("count"=>3),"json");
        $result['code']=1;
        $result['data']=$json[items];
        $result['msg']=C('IMAGE_SERVER');
        $this->ajaxReturn($result);
    }

    //获取通报率
    public function getReportRate(){
        $json = http_post(C('STORM_CENTER_PATH')."/screencenter/securityEvent/getAuditRate",null,"json");

        $result['code']=1;
        $result['msg']=$json[msg];
        $result['data']=$json[other];
        $this->ajaxReturn($result);
    }

    //获取安全事件总数
    public function getAllNum(){
        $json = http_post(C('STORM_CENTER_PATH')."/screencenter/securityEvent/getAllAuditNum",null,"json");

        $result['code']=1;
        $result['msg']=$json[msg];
        $result['data']=$json[total];
        $this->ajaxReturn($result);
    }

    //获取省份安全事件数top5
    public function getProvinceEventNumTop5(){
        $json = http_post(C('STORM_CENTER_PATH')."/screencenter/securityEvent/getSecurityEventProvinceGroup",null,"json");

        $result['code']=1;
        $result['msg']=$json[msg];
        $result['data']=$json[items];
        $this->ajaxReturn($result);
    }

    // 获取安全事件类型分布饼图
    public function getSecurityEventTypes(){
        $eventTypeArr = C('EVENT_TYPE');
        $json = http_post(C('STORM_CENTER_PATH')."/screencenter/securityEvent/getSecurityEventTypes",null,"json");

        $items = $json[items];
        //将通过事件类型修改时间类型描述
        for($i = 0;$i < count($items);$i++){
            $curEventType = $items[$i][event_type];
            foreach($eventTypeArr as $k=>$v){
                if($v == $curEventType){
                    $items[$i][event_type_cn] = $k;
                }
            }
        }
        $result['code']=1;
        $result['msg']=$json[msg];
        $result['data']=$items;

        $this->ajaxReturn($result);
    }

    // 获取所有审核数据
    public function getAllAuditNum(){
    }

}