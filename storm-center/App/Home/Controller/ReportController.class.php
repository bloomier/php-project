<?php
namespace Home\Controller;
use Home\Globals\Constants;
use Think\Controller;
use Think\Crypt\Driver\Base64;
use Think\Model;
use Com\VulsContent;

class ReportController extends BaseController {

    /**
     * 感知网站安全
     */
    public function safeWeb(){
        $url = I("url");
        $this->assign("url", $url);
        $this->assign("ip", I('ip'));
        $this->display("safe-web");
    }

    /**
     * 获取邮件列表
     */
    public function getAutoEmailList(){
        $model=new  Model();
        $emails=$model->table(array(
            C('DB_PREFIX').'email'=>'email',
            C('DB_PREFIX').'email_group'=>'group'
        ))->where(array("email.group_id =group.id"))
            ->field("email.*,group.name gname")->select();
        $this->ajaxReturn($emails);
    }

    /**
     *  报告展示
     */
    public function domainReport(){
        $content = $this->getContent(decodeApiKey(I('url')));
        $this->assign("vuls_src_url", I('url'));
        $this->assign("vuls_info_content_src", urlencode(json_encode($content)));
        $this->display("vuls-report");
    }


    /**
     * 导出单个域名报告
     */
    public function exportReport(){
        $content = $this->exportContent(decodeApiKey(I('url')));
        $reportFileName="";
        if(!$reportFileName){
            $reportFileName=getSystemMillis()."domainreport.html";
        }
        $htmlFile=C('TEMPLATE_PATH').$reportFileName;
        file_put_contents($htmlFile,$content);
        if($htmlFile){
            download($htmlFile);
        }else{
            echo '生成报告文件失败';
        }
    }

    /**
     * 单个域名报告邮件发送
     */
    public function emailDomainReport(){
        $content = $this->exportContent(decodeApiKey(I('url')));
        $reportFileName="";
        if(!$reportFileName){
            $reportFileName=getSystemMillis()."domainreport.html";
        }
        $htmlFile=C('TEMPLATE_PATH').$reportFileName;
        file_put_contents($htmlFile,$content);
        $list=$this->getEmailSendList();
        if($htmlFile){
            $emailResult = sendMail($list, I("title"), I("content"), $htmlFile);
            if($emailResult){
                $this->ajaxReturn(array("code"=>1,"msg"=>"发送成功"));
            }else{
                $this->ajaxReturn(array("code"=>0,"msg"=>"发送失败"));
            }
        }else{
            $this->ajaxReturn(array("code"=>0,"msg"=>"附件生成失败"));
        }
    }

    /**
     * @param null $url
     * @return mixed
     */
    private function exportContent($domain){
        $content = $this->getContent($domain);
        $this->assign("vuls_info_content_src", urlencode(json_encode($content)));
        $content = $this->fetch("vuls-report");
        $content = str_replace(__ROOT__."/Public", "http://api.websaas.cn/Public", $content);
        $content = str_replace("http://api.websaas.cn/Public/css/font-awesome.min.css", "http://cdn.bootcss.com/font-awesome/4.3.0/css/font-awesome.css", $content);
        return $content;
    }


    private function getContent($domain){
        $vuls = new VulsContent();
        $result= array();
        $result['websiteInfo'] = $vuls->initWebSiteInfo($domain);
        $vulsInfo = array();
        $vulsInfo['security'] = $vuls->initSecurityInfo($domain);
        $vulsInfo['vuls'] = $vuls->initVulsInfo($domain);
        $vulsInfo['web_rank']= $vuls->initCensusInfo($vulsInfo);
        $vulsInfo['safe_status'] = $vuls->initSafeStateInfo($domain, $result['websiteInfo']['domain_ip']);
        $result['vulsInfo'] = $vulsInfo;
        return $result;
    }

    /**
     * 获取poc信息
     */
    public function getPocInfo(){
        $param['rowkey'] = I('rowkey');
        $pocinfo = http_post(C('STORM_CENTER_PATH')."/webvuls/vulsByRowkey", $param, 'json');
        $this->ajaxReturn($pocinfo['other']);
    }

    /**
     * 直接下载导出excel
     */
    public function showReport(){
        $param["area"] = I('area');
        $param["query_param"] = I("query-param");
        $param["start"]=0;
        $param["limit"]=20;
        if($param["area"] == "全国" || $param["area"] == "china"){
            $param["area"] = "";
        }
        $resultList=array();

        $result = http_post(C('STORM_CENTER_PATH')."/webdomain/query", $param,'json');

        if($result["code"]){
            $resultList = $result['other']['value'];
        }

        vendor("PHPExcel.PHPExcel");

        // Create new PHPExcel object
        $objPHPExcel = new \PHPExcel();
        // Set properties
        $objPHPExcel->getProperties()->setCreator("ctos")
            ->setLastModifiedBy("ctos")
            ->setTitle("Office 2007 XLSX Test Document")
            ->setSubject("Office 2007 XLSX Test Document")
            ->setDescription("Test document for Office 2007 XLSX, generated using PHP classes.")
            ->setKeywords("office 2007 openxml php")
            ->setCategory("Test result file");

        //set width
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(8);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(40);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(25);
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(30);
        $objPHPExcel->getActiveSheet()->getColumnDimension('I')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('J')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('K')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('L')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('M')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('N')->setWidth(15);


        //设置行高度
        $objPHPExcel->getActiveSheet()->getRowDimension('1')->setRowHeight(22);

        $objPHPExcel->getActiveSheet()->getRowDimension('2')->setRowHeight(20);

        //合并cell
        $objPHPExcel->getActiveSheet()->mergeCells('A1:N1');

        // set table header content
        $objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue('A1', '查询结果  时间:'.date('Y-m-d H:i:s'))
            ->setCellValue('A2', '编号')
            ->setCellValue('B2', '标题')
            ->setCellValue('C2', '域名')
            ->setCellValue('D2', '危险等级')
            ->setCellValue('E2', 'ip')
            ->setCellValue('F2', '类型')
            ->setCellValue('G2', '归属地')
            ->setCellValue('H2', '收录时间')
            ->setCellValue('I2', '漏洞总数')
            ->setCellValue('J2', '安全事件总数')
            ->setCellValue('K2', '高危漏洞数')
            ->setCellValue('L2', '中危漏洞数')
            ->setCellValue('M2', '低危漏洞数')
            ->setCellValue('N2', '信息数');

        // Miscellaneous glyphs, UTF-8
        for($i=0;$i< count($resultList);$i++){
            $tmp = $resultList[$i];
            $vulsInfo = $tmp['vulsinfo'];
            $level = '未知';
            if($vulsInfo['high'] || $vulsInfo['security']){
                $level = '高危';
            }else if($vulsInfo['mid']){
                $level = '中危';
            }else if($vulsInfo['low']){
                $level = '低危';
            }else if($vulsInfo['info']){
                $level = '信息';
            }
            $count = $vulsInfo['high'] + $vulsInfo['low'] + $vulsInfo['mid'] + $vulsInfo['info'];
            $objPHPExcel->getActiveSheet(0)->setCellValue('A'.($i+3), $i + 1);// 编号
            $objPHPExcel->getActiveSheet(0)->setCellValue('B'.($i+3), $tmp['title']);// 标题
            $objPHPExcel->getActiveSheet(0)->setCellValue('C'.($i+3), $tmp['domain']);// 域名
            $objPHPExcel->getActiveSheet(0)->setCellValue('D'.($i+3), $level); // 危险等级
            $objPHPExcel->getActiveSheet(0)->setCellValue('E'.($i+3), $tmp['ip']);// ip
            $objPHPExcel->getActiveSheet(0)->setCellValue('F'.($i+3), $tmp['type']);// 类型
            $objPHPExcel->getActiveSheet(0)->setCellValue('G'.($i+3), $tmp['province'].$tmp['city']);// 归属地
            $objPHPExcel->getActiveSheet(0)->setCellValue('H'.($i+3), $tmp['timestamp']);// 收录时间
            $objPHPExcel->getActiveSheet(0)->setCellValue('I'.($i+3), $count);// 漏洞数目
            $objPHPExcel->getActiveSheet(0)->setCellValue('J'.($i+3), $vulsInfo['security']);
            $objPHPExcel->getActiveSheet(0)->setCellValue('K'.($i+3), $vulsInfo['high']);
            $objPHPExcel->getActiveSheet(0)->setCellValue('L'.($i+3), $vulsInfo['mid']);
            $objPHPExcel->getActiveSheet(0)->setCellValue('M'.($i+3), $vulsInfo['low']);
            $objPHPExcel->getActiveSheet(0)->setCellValue('N'.($i+3), $vulsInfo['info']);
        }


        //  sheet命名
        $objPHPExcel->getActiveSheet()->setTitle('查询结果');


        // Set active sheet index to the first sheet, so Excel opens this as the first sheet
        $objPHPExcel->setActiveSheetIndex(0);


        // excel头参数
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="查询结果('.date('Ymd-His').').xls"');  //日期为文件名后缀
        header('Cache-Control: max-age=0');

        $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');  //excel5为xls格式，excel2007为xlsx格式
        $objWriter->save('php://output');
    }

    /**
     * 对发送邮件联系人列表进行处理
     * @return array
     */
    private function getEmailSendList(){
        $to = I("to");
        $list = array();
        if($to){
            $toList = explode(";", $to);
            foreach($toList as $t){
                $t = trim($t);

                preg_match_all("/(?:\[)(.*)(?:\])/i",$t, $result);
                $address = $result[1][0];
                if($address && !in_array($address, $list)){
                    $list[] = $address;
                }
            }
            if(!count($list)){
                $toList = explode(";", $to);
                foreach($toList as $t){
                    $t = trim($t);
                    $list[] = $t;
                }
            }
        }

        $cp = I("cp");

        if($cp){
            $cpList = explode(";", $cp);
            $cpAdList = array();
            foreach($cpList as $t2){
                preg_match_all("/(?:\[)(.*)(?:\])/i",$t2, $result2);
                $address2 = $result2[1][0];
                if($address2 && !in_array($address2, $list)){
                    $cpAdList[] = $address2;
                    $list[] = $address2;
                }
            }
            if(!count($cpAdList)){
                $cpList = explode(";", $cp);
                foreach($cpList as $t2){
                    $t2 = trim($t2);
                    $list[] = $t2;
                }
            }
        }
        return $list;
    }

}