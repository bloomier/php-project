<?php
namespace API\Controller;
use Think\Controller\RestController;

class ContractReportController extends RestController {

    /**
     * 生成报告的接口
     */
    public function createReport(){
        $result=array("code"=>0,"path"=>0);
        // 调用其他模块接口生成报告
        $content = R('MSSP/Report/getReportContent');
        $content = str_replace(__ROOT__."/Public", "http://api.websaas.cn/Public", $content);
        $content = str_replace("http://api.websaas.cn/Public/css/font-awesome.min.css", "http://cdn.bootcss.com/font-awesome/4.3.0/css/font-awesome.css", $content);
        $fileName = str_replace(array('.', '/',':'),'_',I('url')).'.html';
        $path = C('CONTACT_REPORT_PATH').date('Y').'/'.date('m').'/'.date('d').'/'.I('contractId').'/';
        if(!is_dir($path)){
            mkdir($path,0755, true);
        }
        $filePath = $path.$fileName;
        file_put_contents($filePath,$content);
        if(file_exists($path)){
            $result['code'] = 1;
            $result['path'] = $path;
        }
        $this->ajaxReturn($result);
    }

}