<?php
/**
 * Created by PhpStorm.
 * User: jianghaifeng
 * Date: 2016/3/1
 * Time: 14:25
 */

namespace Home\Controller;
use Think\Controller;
use Admin\Controller\BaseController;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;
use Common\Vendor\WafConsole;

class ColonyNodeController extends BaseController {

    /** */
    public function index(){
        $this->display("colonyNode");
    }
    //DDOS攻击记录
    public function DDOSAttackRecord(){
        $rows=http_post(C(Constants::$PATH_SITE_POINT)."/api/getDdosRecord24Hour",null,'json');

        $this->ajaxReturn($rows);
    }

    //DDOS攻击源分布
    public function DDOSAttackSource(){
        $rows=http_post(C(Constants::$PATH_SITE_POINT)."/api/getDdosAttackIp",null,'json');
        $rows['totalCount']=0;
        foreach($rows['rows'] as $k=>$v){
            $rows['totalCount']+=$v['count'];
        }
        $this->ajaxReturn($rows);
    }

    //DDOS攻击目标分布
    public function DDOSAttackGoal(){
        $rows=http_post(C(Constants::$PATH_SITE_POINT)."/api/getDdosCount",null,'json');
        $rows['totalCount']=0;
        foreach($rows['rows'] as $k=>$v){
            $rows['totalCount']+=$v['count'];
        }
        $this->ajaxReturn($rows);
    }
    //未处理高级别告警
    public function untreatedHighWarn(){
        $rows=http_post(C(Constants::$PATH_SITE_POINT)."/api/getZabbixWarn",null,'json');
        $this->ajaxReturn($rows);
    }

    //24小时内告警统计
    public function getZabbix24Count(){
        $rows=http_post(C(Constants::$PATH_SITE_POINT)."/api/getZabbix24Count",null,'json');
        $this->ajaxReturn($rows);
    }


}