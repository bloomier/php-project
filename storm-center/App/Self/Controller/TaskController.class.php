<?php
namespace Self\Controller;
use Home\Controller\BaseController;
use Think\Controller;

class TaskController extends BaseController {


    public function index(){
        $this->display();
    }
    public function all(){
        $this->display("all-task");
    }
    public function personal(){
        $this->display("personal-task");

    }
    public function apply(){
        $this->display("task-apply");
    }

    /**
     * 插入申请
     */
    public function insert(){
        $user=session("user");
        $params = array(
            "domain_list"=>I("domain_list"),
            "apply_reason"=>I("apply_reason"),
            "apply_userid"=>$user['id'],
            "apply_name"=>$user['name'],
            "apply_username"=>$user['username']
        );
        $json = http_post(C('STORM_CENTER_PATH')."/selfReport/insertTaskApply",$params,"json");
        $result['code']= $json[code];
        $result['msg']= $json[msg];
        $this->ajaxReturn($result);
    }


    /**
     * 查询个人申请记录
     */
    public function queryPersonalTask(){
        $user=session("user");
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        $apply_reason = I('groupName');
        if($apply_reason != ""){
            $param['apply_reason']= "%".$apply_reason."%";
        }

        $param['audit_state']=I('audit_state');
        $param['isDeleted'] = 0;
        $start = (I('currentpage') - 1) * I('limit');
        $limit = I('limit');
        $param['start'] = $start;
        $param['limit'] = $limit;
        $param['apply_userid'] = $user['id'];
        $json = http_post(C('STORM_CENTER_PATH')."/selfreport/queryApplyForm", $param,'json');
        if($json['code']){
            $result['code']=1;
            $result['total'] = $json['other']['count'];
            $result['rows'] = $json['other']['list'];
        }
        $this->ajaxReturn($result);
    }

    /**
     * 撤销申请
     */
    public function batchUndo(){
        $param['form_id']=I('ids');
        $json = http_post(C('STORM_CENTER_PATH')."/selfreport/undoTaskApply", $param,'json');
        if($json['code']){
            $result['code']=1;
            $result['msg'] = '任务撤销成功';
        }
        $this->ajaxReturn($result);
    }

    /**
     * 导出报告
     */
    public function exportReport(){
        $param['form_id']=I('form_id');
        $filePath = I('form_report_path');
        //此处写下载日志记录
        $json = http_post(C('STORM_CENTER_PATH')."/selfreport/downloadQueryApplyForm", $param,'json');
        //var_dump($json);
        //设置编码
        header("Content-Type:text/html;   charset=utf-8");
        $zipFile = C('GENERATE_ZIP_PATH').$filePath;
        if(!file_exists($zipFile)){
            echo '报告不存在';
        } else {
            download($zipFile);
        }
    }
    /**
     * 显示任务详情页面
     */
    public function showDetail(){
        $form_id = I('form_id');
        $param['form_id']=$form_id;
        $json = http_post(C('STORM_CENTER_PATH')."/selfreport/queryTaskApplyByFormId", $param,'json');
        //设置编码
        header("Content-Type:text/html;   charset=utf-8");

        $result_list = $json[other][list_list];
        $info["apply_reason"] = $json[other][apply_reason];

        $info["type"] = $json[other][task_type];
        $info["apply_time"] = $json[other][apply_time];
        $info["task_type_desc"] = $json[other][task_type_desc];
        if($json[other][audit_time] == null){
            $info["audit_time"] = "";
        } else {
            $info["audit_time"] = $json[other][audit_time];
        }
        if($json[other][audit_opition] == null){
            $info["audit_opition"] = "";
        } else {
            $info["audit_opition"] = $json[other][audit_opition];
        }
        if($json[other][downloadNum] == 0){
            $info["downloadNum"] = "共0次";
        } else {
            $info["downloadNum"] = "共".$json[other][downloadNum]."次";
        }
        if($json[other][cancel_time] == null){
            $info["cancel_time"] = "";
        } else {
            $info["cancel_time"] = $json[other][cancel_time];
        }
        if($json[other][downLoad_readme] == null){
            $info["downLoad_readme"] = "";
        } else {
            $info["downLoad_readme"] = $json[other][downLoad_readme];
        }
        if($json[other][form_report_path] == null){
            $info["form_report_path"] = "";
        } else {
            $info["form_report_path"] = $json[other][form_report_path];
        }
        $this->assign("form_id", $form_id);
        $this->assign("info",$info);
        $this->assign("result_list",$result_list);
        $this->display('task-detail');
    }

    public function queryTaskApplyByFormId(){
        $form_id = I('form_id');
    }
}