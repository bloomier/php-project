<?php
namespace Service\Controller;
use Home\Controller\BaseController;
use Think\Controller;

class WebSiteController extends BaseController {


    public function index(){

        $this->display();
    }

    public function siteManage(){

        $this->display("siteManage");
    }
    public function siteFault(){

        $this->display("siteFault");
    }
    public function sitePaper(){

        $this->display("sitePaper");
    }
    public function siteView(){

        $this->display("site-view");
    }

    public function querySite(){
        $result=array("code"=>0,"total"=>0,"rows"=>array());
//        $param=I('param');
        $start = (I('currentpage') - 1) * I('limit');
        $limit = I('limit');
        $param['start'] = $start;
        $param['limit'] = $limit;
        $param['param'] = I('param');
        $data = http_post(C('STORM_CENTER_PATH')."/service/querySite", $param,'json');
        if($data['code']){
            $result['code']=1;
            $result['total'] = $data['other'];
            $result['rows'] = $data['items'];
        }
        $this->ajaxReturn($result);
    }








}