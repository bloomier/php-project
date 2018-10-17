<?php
/**
 * Created by PhpStorm.
 * User: ST
 * Date: 2015/6/19
 * Time: 15:13
 */

namespace Admin\Controller;
use Home\Controller\AuthController;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;

class VulsPolicyController extends BaseController {

    public function index(){
        //$this -> display("index");
        $this -> display("index");
    }

    public function getOneByVid(){
        $params = array(
            "vid"=>I('vid'),
            "start"=>0,
            "limit"=>1
        );
        $json = http_post(C('STORM_CENTER_PATH')."/queryVulsPolicy",$params,"json");
        $this->ajaxReturn($json[items][0]);
    }

    public function insertOrUpdate(){
        $result['code']=0;
        $id=I("id");
        $params = array(
            "vid"=>I("vid"),
            "vname"=>I("vname"),
            "vnameCn"=>I("vname"),
            "level"=>I("level")
        );

        if($id){//修改
            $json = http_post(C('STORM_CENTER_PATH')."/updateVulsPolicy",$params,"json");
            $result['code']= $json[code];
            $result['msg']= $json[msg];
            $this->ajaxReturn($result);
        }else{//添加
            $json2 = http_post(C('STORM_CENTER_PATH')."/insertVlusPolicy",$params,"json");
            $result['code']= $json2[code];
            $result['msg']= $json2[msg];
            $this->ajaxReturn($result);
        }
    }



    public function showlist(){
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        $elements = explode(",", easyPage());

        $params = array(
            "vname"=>I('param'),
            "level"=>I("level"),
            "start"=>($elements[0] - 1) * $elements[1],
            "limit"=>$elements[1]
        );
        $json = http_post(C('STORM_CENTER_PATH')."/queryVulsPolicy",$params,"json");
        $result['code']=1;
        $result['rows']=$json[items];
        $result['total']=$json[other];
        $this->ajaxReturn($result);
    }

    public function delete(){
        // $map["id"]=array("in",I("vids"));
        $params = array(
            "vid"=>I("vids")
        );
        $json = http_post(C('STORM_CENTER_PATH')."/deleteVulsPolicy",$params,"json");
        $result['code']= $json[code];
        $result['msg']= $json[msg];
        $this->ajaxReturn($result);
    }
} 