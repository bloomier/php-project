<?php
/**
 * Created by PhpStorm.
 * User: jianghaifeng
 * Date: 2016/2/24
 * Time: 14:02
 */

namespace Security\Controller;


use Home\Controller\BaseController;

class VulsInfoController extends BaseController{

    public function index(){
        $this -> assign("image_path",C("IMAGE_SERVER"));
        $this->display("index");
    }

    public function queryGroup(){
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        $params['limit'] = I('limit');
        $params['start'] = (I('currentpage') - 1) * I('limit');
        $params['audit_state'] = 0;
        $params['deal_state'] = 0;
        if(I('param')){
            $params['param'] = I('param');
        }
        $data = http_post(C('STORM_CENTER_PATH')."/security/vulsInfo/queryGroup",$params,"json");
        if($data && $data['code'] == 1){
            $result['code']  = 1;
            $result['rows']  = $data["items"];
            $result['total'] = $data["total"];
        }
        $this->ajaxReturn($result);
    }

    public function queryList(){
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        $params['audit_state'] = I('audit_state');
        $params['deal_state'] = I('deal_state');
        $params['web_domain'] = I('web_domain');
        $data = http_post(C('STORM_CENTER_PATH')."/security/vulsInfo/queryList",$params,"json");
        if($data && $data['code'] == 1){
            $result['code']  = 1;
            $result['rows']  = $data["items"];
            $result['total'] = $data["total"];
        }
        $this->ajaxReturn($result);
    }

    public function noticeVuls(){
        $result = array("code"=>0, "array"=>array());
        $postResult = http_post(C('STORM_CENTER_PATH')."/security/vulsInfo/update", array("vulsList"=>json_encode(I("vulsList")),"contactList"=>I("contactList")), "json");
        $this->ajaxReturn($postResult);

    }


}