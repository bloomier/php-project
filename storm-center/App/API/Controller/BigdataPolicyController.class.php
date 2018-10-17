<?php
namespace API\Controller;

use Think\Controller\RestController;
use Think\Controller;

class BigdataPolicyController extends Controller {

    public function queryAllPolicy(){
        $result = array("code"=>0, "rows"=>array());
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataPolicy/query", array(),'json');
        if($data['code']){
            $result['code']=1;
            $result['rows'] = $data['items'];
        }
        $this->ajaxReturn($result);
    }

    public function addOnePolicy(){
        $result = array("code"=>0, "msg"=>"");
        if(!I('id') || !I('name') || !I('level')){
            $result['msg'] = "信息不完整，无法添加";
            $this->ajaxReturn($result);
        }else{
            $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataPolicy/insertOrUpdate", array("id"=>I("id"), "name"=>I("name"), "level"=>I("level")),'json');
            if($data['code']){
                $result['code']=1;
                $result['msg'] = "添加成功";
            }else{
                $result['msg'] = "添加失败";
            }
        }
        $this->ajaxReturn($result);
    }


}