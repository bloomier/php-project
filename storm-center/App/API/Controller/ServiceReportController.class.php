<?php
namespace API\Controller;
use Think\Controller\RestController;

class ServiceReportController extends RestController {

    /**
     * 生成报告的接口
     */
    public function createDailyReport(){
        $res=array("code"=>1);
        $dir=$fileName="/tmp/report/service_daily/".I('time');
        $domain=I('domain');
        $domain=str_replace("/","_",$domain);
        $domain=str_replace(':',"_",$domain);
        //$domain=str_replace('.',"_",$domain);

        $fileName=$dir."/".$domain.".html";
        mkDirs($dir);
        if(!is_file($fileName)){
            $content=R("Service/Report/generateDailyReport");
            if(!$content){
                $res['code']=0;
            }else{
                $res['desc']='new';
            }
            file_put_contents($fileName,$content);

        }

        $res['fileName']=$fileName;

        $this->ajaxReturn($res);


    }



}