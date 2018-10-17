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

class G20Controller extends BaseController {

    /** */
    public function index(){
        $this->display("G20");
    }


    public function getTotalCount(){
        $json=http_post("http://172.16.7.46:8085/ArkHenryWebG20/reportG20/stat",null,'json');
        $this->ajaxReturn($json);
    }
    public function getTotalData(){
        $json=http_post(C("G20_PATH")."/reportG20/rank",null,'json');
        $this->ajaxReturn($json);

    }
    public function getRunningTime(){

        $json=http_post("http://172.16.7.46:8085/ArkHenryWebG20/reportG20/date", array("key"=>I("key")), 'json');
        $this->ajaxReturn($json);
    }

    // 世界攻击量
    public function attackByCountry(){
        $json=http_post(C("G20_PATH")."/reportG20/statAttackByCountry", null, 'json');
        $this->ajaxReturn($json);
    }
    // 中国攻击量
    public function attackByProvince(){
        $json=http_post(C("G20_PATH")."/reportG20/statAttackByProvince", null, 'json');
        $this->ajaxReturn($json);
    }
    // 世界访问量
    public function visitByCountry(){
        $json=http_post(C("G20_PATH")."/reportG20/statVisitByCountry", null, 'json');
        $this->ajaxReturn($json);
    }
    // 中国访问量
    public function visitByProvince(){
        $json=http_post(C("G20_PATH")."/reportG20/statVisitByProvince ", null,'json');
        $this->ajaxReturn($json);
    }
    // 攻击方式 TOP10
    public function attackType(){
        $json=http_post(C("G20_PATH")."/reportG20/attackType", null,'json');
        $this->ajaxReturn($json);
    }
    // 攻击源IP TOP5
    public function ipCount(){
        $json=http_post(C("G20_PATH")."/reportG20/ipCount", null,'json');
        $this->ajaxReturn($json);
    }
    // 每天攻击访问趋势分析
    public function statByDay(){
        $json=http_post(C("G20_PATH")."/reportG20/statByDay", null,'json');
        $this->ajaxReturn($json);
    }
    // 七大洲24小时攻击访问量
    public function statByHour(){
        $json=http_post(C("G20_PATH")."/reportG20/statByHour", null,'json');
        $this->ajaxReturn($json);
    }
    // 访问栏目
    public function title(){
        $json=http_post(C("G20_PATH")."/reportG20/title", null,'json');
        $this->ajaxReturn($json);
    }

}