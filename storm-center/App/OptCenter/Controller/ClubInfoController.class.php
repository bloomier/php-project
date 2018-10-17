<?php
namespace OptCenter\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;

/**
 * 策略组
 *
 * Class IndexController
 * @package OptCenter\Controller
 */
class ClubInfoController extends BaseController {


    public function index(){
       $this->display('index');
    }

    //查询物理地址信息
    public function queryPhysicalAddress(){
        if(I('ip_domain')){
            $param['ip'] = I('ip_domain');
        }
        $data = http_post(C('CLUBINFO_PATH')."/optCenter/clubInfo/queryPhysicalAddress", $param,'json');
        $this->ajaxReturn($data);
    }

    //查询端口信息
    public function queryPort(){
        $result = array("code"=>0,"total"=>0,"rows"=>array());
        $start = (I('currentpage') - 1) * I('limit');
        $limit = I('limit');
        $param['start'] = $start;
        $param['limit'] = $limit;
        if(I('ip_domain')){
            $param['ip'] = I('ip_domain');
        }
        $data = http_post(C('CLUBINFO_PATH')."/optCenter/clubInfo/queryPort", $param,'json');
        if($data['code']){
            $result['code'] = 1;
            $result['total'] = $data['total'];
            $result['rows'] = $data['rows'];
        }

        $this->ajaxReturn($result);
    }

    // 获取whois信息
    public function getWhoisInfo(){
        if(I('ip_domain')){
            $param['ip'] = I('ip_domain');
        }
        $data = http_post(C('CLUBINFO_PATH')."/optCenter/clubInfo/getWhoisInfo", $param,'json');
        $this->ajaxReturn($data);
    }

    // 查询域名/子域名
    public function querySubdomain(){
        $result = array("code"=>0,"total"=>0,"rows"=>array());
        $start = (I('currentpage') - 1) * I('limit');
        $limit = I('limit');
        $param['currentpage'] = I('currentpage');
        $param['start'] = $start;
        $param['limit'] = $limit;
        if(I('ip_domain')){
            $param['ip'] = I('ip_domain');
        }
        $data = http_post(C('CLUBINFO_PATH')."/optCenter/clubInfo/querySubdomain", $param,'json');
        if($data['code']){
            $result['code'] = 1;
            $result['total'] = $data['total'];
            $result['rows'] = $data['rows'];
        }
        $this->ajaxReturn($result);
    }

    //查询IP旁站
    public function querySameNetwork(){
        $result = array("code"=>0,"total"=>0,"rows"=>array());
        $start = (I('currentpage') - 1) * I('limit');
        $limit = I('limit');
        $param['currentpage'] = I('currentpage');
        $param['start'] = $start;
        $param['limit'] = $limit;
        if(I('ip_domain')){
            $param['ip'] = I('ip_domain');
        }
        $data = http_post(C('CLUBINFO_PATH')."/optCenter/clubInfo/querySameNetwork", $param,'json');
        if($data['code']){
            $result['code'] = 1;
            $result['total'] = $data['total'];
            $result['rows'] = $data['rows'];
        }
        $this->ajaxReturn($result);
    }

    // 获取whois原样输出信息
    public function getWhoisStrMsg(){
        if(I('ip')){
            $param['ip'] = I('ip');
        }
        $data = http_post(C('CLUBINFO_PATH')."/optCenter/clubInfo/getWhoisStrMsg", $param,'json');
        if($data['code']){
            $result['code'] = 1;
            $result['rows'] = $data['rows'];
        }
        $this->ajaxReturn($result);
    }

    // 查询攻击信息
    public function queryAttack(){
        $result = array("code"=>0,"total"=>0,"rows"=>array());
        $start = (I('currentpage') - 1) * I('limit');
        $limit = I('limit');
        $param['start'] = $start;
        $param['limit'] = $limit;
        if(I('ip_domain')){
            $param['sip'] = I('ip_domain');
        }
        $data = http_post(C('CLUBINFO_PATH')."/optCenter/clubInfo/queryAttack", $param,'json');
        if($data['code']){
            $result['code'] = 1;
            $result['total'] = $data['total'];
            $result['rows'] = $data['rows'];
        }
        $this->ajaxReturn($result);
    }

    // 查询被攻击信息
    public function queryAttacked(){
        $result = array("code"=>0,"total"=>0,"rows"=>array());
        $start = (I('currentpage') - 1) * I('limit');
        $limit = I('limit');
        $param['start'] = $start;
        $param['limit'] = $limit;
        if(I('ip_domain')){
            $param['dip'] = I('ip_domain');
        }
        $data = http_post(C('CLUBINFO_PATH')."/optCenter/clubInfo/queryAttacked", $param,'json');
        if($data['code']){
            $result['code'] = 1;
            $result['total'] = $data['total'];
            $result['rows'] = $data['rows'];
        }
        $this->ajaxReturn($result);
    }

    

}