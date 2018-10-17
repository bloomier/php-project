<?php
namespace API\Controller;
use Think\Controller\RestController;

class ReportCreateController extends RestController {

    private function getContent($domain){
        $result= array();
        $result['websiteInfo'] = initWebSiteInfo($domain);
        $vulsInfo = array();
        $vulsInfo['security'] = initSecurityInfo($domain);
        $vulsInfo['vuls'] = initVulsInfo($domain);
        $vulsInfo['web_rank']=initCensusInfo($vulsInfo);
        $vulsInfo['safe_status'] = initSafeStateInfo($domain, $result['websiteInfo']['domain_ip']);
        $result['vulsInfo'] = $vulsInfo;
        return $result;
    }

    /**
     * 生成报告的接口
     */
    public function create(){
        $result=array("code"=>0,"path"=>0);
        $content = $this->getContent(I('url'));
        $this->assign("vuls_info_content_src", urlencode(json_encode($content)));
        $content = $this->fetch("vuls-report");
        $content = str_replace(__ROOT__."/Public", "http://api.websaas.cn/Public", $content);
        $content = str_replace("http://api.websaas.cn/Public/css/font-awesome.min.css", "http://cdn.bootcss.com/font-awesome/4.3.0/css/font-awesome.css", $content);
        $timeMillis = getSystemMillis();
        $htmlFile = C('GENERATE_PATH').I('url').$timeMillis.".html";// 报告生成目录
        file_put_contents($htmlFile,$content);
        $result['code'] = 1;
        $result['path'] = I('url').$timeMillis.".html";
        $this->ajaxReturn($result);
    }

    /**
     * 生成压缩包的接口
     */
    public function createZip(){
        $result=array("code"=>0,"path"=>0);
        $list = explode(",", I('reportPath'));

        $templateFile=C('GENERATE_PATH').C('ZIP_TEMPLATE_SELF-REPORT');
        $time = date('y-m-d',time());
        $zipPath = C("GENERATE_ZIP_PATH").$time;
        if(!file_exists($zipPath)){
            mkdir($zipPath);
        }
        $prefix = "self-report";
        $zipName = $prefix.date('y-m-d_H-i-s', time()).".zip";
        $zipFile=$zipPath."/".$zipName;
        if(file_exists($zipFile)){
            unlink($zipFile);
        }
        //cp 模板文件
        copy($templateFile,$zipFile);
        //往里面放入html文件
        $zipArchive=new \ZipArchive();

        if($zipArchive->open($zipFile)=== TRUE){
            foreach($list as $tmp){
                if($tmp){
                    $htmlFile=C('GENERATE_PATH').$tmp;
                    $zipArchive->addFile($htmlFile,$tmp);//添加新的文件
                }
            }
            $zipArchive->close();
            $result['code'] = 1;
            $result['path'] = $time."/".$zipName;
        }
        $this->ajaxReturn($result);
    }

}