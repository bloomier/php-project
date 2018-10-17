<?php
namespace API\Controller;

use Think\Controller\RestController;
use Think\Controller;

class BigdataTaskController extends Controller {

//APIBaseController
    public function queryOneSlice(){
        $nodeId=I("nodeId");
        if(!$nodeId){
            $this->ajaxReturn(array("code"=>0,"msg"=>"nodeId不能为空"));
        }else{
            $json=http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataTask/queryOneSlice",array("nodeId"=>$nodeId),'json');
            $result=array();
            if($json['code']==1){
                $result['code']=1;
                if($json['other']&&$json['other']!='null'){
                    $result['slice']=$json['other'];
                }
            }else{
                $result['code']=0;
                $result['msg']=$json['msg'];

            }
            $this->ajaxReturn($result);
        }
    }

    public function startOneSlice(){
        $sliceId=I("sliceId");
        if(!$sliceId){
            $this->ajaxReturn(array("code"=>0,"msg"=>"切片ID不能为空"));
        }else{

            $json=http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataTask/startOneSlice",
                array("sliceId"=>$sliceId),'json');
            $result=array();
            $result['msg']=$json['msg'];
            $result['code']=$json['code'];
            //dump($result);
            $this->ajaxReturn($result);
        }
    }
    public function finishOneSlice(){

        $sliceId=I("sliceId");
        if(!$sliceId){
            $this->ajaxReturn(array("code"=>0,"msg"=>"切片ID不能为空"));
        }else{
           // echo I('fileName');
            $fileName=I("fileName");
            $fileName=str_replace("/", "__", $fileName);
            $json=http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataTask/finishOneSlice",
                array("sliceId"=>$sliceId,"fileName"=>$fileName),'json');
            $result=array();
            $result['msg']=$json['msg'];
            $result['code']=$json['code'];
            $this->ajaxReturn($result);
        }

    }
    public function queryOneSliceHostry(){
        $nodeId=I("nodeId");
        if(!$nodeId){
            $this->ajaxReturn(array("code"=>0,"msg"=>"nodeId不能为空"));
        }else{
            $json=http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataTask/queryOneSliceHistory",array("nodeId"=>$nodeId),'json');
            $result=array();
            if($json['code']==1){
                $result['code']=1;
                if($json['other']&&$json['other']!='null'){
                    $result['slice']=$json['other'];
                }
            }else{
                $result['code']=0;
                $result['msg']=$json['msg'];

            }
            $this->ajaxReturn($result);
        }


    }

    public function startSyncOneSlice(){
        $sliceId=I("sliceId");
        if(!$sliceId){
            $this->ajaxReturn(array("code"=>0,"msg"=>"切片ID不能为空"));
        }else{
            // echo I('fileName');
            $json=http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataTask/startSyncOneSliceHistory",
                array("sliceId"=>$sliceId),'json');
            $result=array();
            $result['msg']=$json['msg'];
            $result['code']=$json['code'];
            $this->ajaxReturn($result);
        }
    }
    public function finishSyncOneSlice(){
        $sliceId=I("sliceId");
        if(!$sliceId){
            $this->ajaxReturn(array("code"=>0,"msg"=>"切片ID不能为空"));
        }else{
            // echo I('fileName');
            $json=http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataTask/finishSyncOneSliceHistory",
                array("sliceId"=>$sliceId),'json');
            $result=array();
            $result['msg']=$json['msg'];
            $result['code']=$json['code'];
            $this->ajaxReturn($result);
        }
    }

    public function resetSliceByNode(){
        $nodeId = I("nodeId");
        if(!$nodeId){
            $this->ajaxReturn(array("code"=>0,"msg"=>"节点ID不能为空"));
        }else{
            $json=http_post(C("STORM_CENTER_PATH")."/optcenter/bigdataTask/resetSliceByNode", array("nodeId"=>$nodeId), 'json');
            $result=array();
            $result['msg'] = $json['msg'];
            $result['code'] = $json['code'];
            $this->ajaxReturn($result);
        }
    }

    public function queryOneVerificationSlice(){
        $nodeId=I("nodeId");
        if(!$nodeId){
            $this->ajaxReturn(array("code"=>0,"msg"=>"nodeId不能为空"));
        }else{
            $json=http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataTask/queryOneVerficationSlice",array("nodeId"=>$nodeId),'json');
            $result=array();
            if($json['code']==1){
                $result['code']=1;
                if($json['other']&&$json['other']!='null'){
                    $result['slice']=$json['other'];
                }
            }else{
                $result['code']=0;
                $result['msg']=$json['msg'];

            }
            $this->ajaxReturn($result);
        }
    }

    public function queryOneVulsDetail(){
        $rowKey = I("rowKey");
        if(!$rowKey){
            $this->ajaxReturn(array("code"=>0, "msg"=>"rowKey不能为空"));
        }else{
            $json=http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataTask/queryOneVulsDetail",array("rowKey"=>$rowKey),'json');
            $result=array();
            if($json['code']==1){
                $result['code']=1;
                if($json['other']&&$json['other']!='null'){
                    $result['detail']=$json['other'];
                }
            }else{
                $result['code']=0;
                $result['msg']=$json['msg'];

            }
            $this->ajaxReturn($result);
        }
    }

    public function finishOneVulsSlice(){
        $sliceId=I("sliceId");
        if(!$sliceId){
            $this->ajaxReturn(array("code"=>0,"msg"=>"切片ID不能为空"));
        }else{
            // echo I('fileName');
            $json=http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataTask/finishOneVerficationSlice",  array("sliceId"=>$sliceId),'json');
            $result=array();
            $result['msg']=$json['msg'];
            $result['code']=$json['code'];
            $this->ajaxReturn($result);
        }
    }


}