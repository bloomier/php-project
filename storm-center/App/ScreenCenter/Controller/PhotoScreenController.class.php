<?php
namespace ScreenCenter\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;


class PhotoScreenController extends BaseController {



    public function index(){
        $this->display("./photo-screen");

    }


    public function getImgList(){
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        $param['count'] = I("limit");
        $data = http_post(C('STORM_CENTER_PATH')."/screencenter/securityEvent/getSecurityEventPic", $param,'json');
        if($data['code']){
            $result['code']=1;
//            $result['total'] = $data['other'];
            $result['rows'] = $data['items'];
            $result['imagePath'] = C('IMAGE_SERVER');
        }
        $this->ajaxReturn($result);
    }

}