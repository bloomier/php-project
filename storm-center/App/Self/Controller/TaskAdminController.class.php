<?php
namespace Self\Controller;
use Home\Controller\BaseController;
use Think\Controller;

class TaskAdminController extends BaseController {


    public function index(){
        if(I("srcState")){
            $this->assign("srcState", I("srcState"));
        }
        $this->display("index");
    }

    /**
     * 查询申请记录[待处理的]
     */
    public function queryApplyForm(){
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        if(I("auditState")){
            $state = I("auditState");
            if($state == 1){
                $param["audit_state"] = 0;
            }else if($state == 2){
                $param["audit_state"] = -2;
            }else if($state == 3){
                $param["audit_state"] = 1;
            }else if($state == 4){
                $param["audit_state"] = -1;
            }else if($state == 5){
                $param["audit_state"] = 1;
                $param["form_report_status"] = 0;
            }else if($state == 6){
                $param["audit_state"] = 1;
                $param["form_report_status"] = 1;
            }
        }
        $param['form_id'] = I("form_id");
        if(I("apply_name")){
            $param['apply_name']=I("apply_name");
        }
        $start = (I('currentpage') - 1) * I('limit');
        $limit = I('limit');
        $param['start'] = $start;
        $param['limit'] = $limit;
        $data = http_post(C('STORM_CENTER_PATH')."/selfreport/queryApplyForm", $param,'json');
        if($data['code']){
            $result['code']=1;
            $result['total'] = $data['other']['count'];
            $result['rows'] = $data['other']['list'];
        }
        $this->ajaxReturn($result);
    }

    /**
     * 查看已完成-未完成的任务详情
     */
    public function showDetail(){
        $formId = I('formId');
        $this->assign("formId", $formId);
        $this->display('show-detail');
    }

    /**
     * 进入审核任务页面
     */
    public function toAuditDetail(){
        $formId = I('formId');
        $this->assign("formId", $formId);
        $this->display('audit-detail');
    }

    /**
     * 审核任务
     */
    public function updateApplyForm(){
        $result=array("code"=>0,"msg"=>"");
        $param['form_id']=I('formId');
        $user=session("user");
        $param['audit_state']=I('auditState');
        $param['audit_opition']=I('auditOpition');
        $param['audit_user'] = $user['username'];
        $data = http_post(C('STORM_CENTER_PATH')."/selfreport/updateApplyForm", $param,'json');
        if($data['code']){
            $result['code']=1;
            $result['msg']="操作成功！";
        }
        $this->ajaxReturn($result);
    }

    /**
     * 查询下载记录
     */
    public function queryDownloadInfo(){
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        $param['form_id']=I('form_id');
        $data = http_post(C('STORM_CENTER_PATH')."/selfreport/queryDownloadLog", $param,'json');
        if($data['code']){
            $result['code']=1;
            $result['total'] = $data['other']['count'];
            $result['rows'] = $data['other']['list'];
        }
        $this->ajaxReturn($result);
    }

}