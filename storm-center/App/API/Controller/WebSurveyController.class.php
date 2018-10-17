<?php
namespace API\Controller;
use Home\Globals\Constants;
use Think\Controller\RestController;

/**
 * Class WebSurveyController
 * @package API\Controller
 * 网站普查的一些接口
 */
class WebSurveyController extends RestController {
    
    protected $allowMethod    = array('get'); // REST允许的请求类型列表
    protected $allowType      = array('json'); // REST允许请求的资源类型列表

    /**
     * 加密算法认证
     */
    public function _initialize(){
        $apiMap=C('APIKEYS');
        $xBashTokid=I("X-BashTokid");
        if(!$xBashTokid){
            $this->ajaxReturn(array("code"=>0,"msg"=>"X-BashTokid empty"));
        }
        $apiKey=$apiMap[$xBashTokid];
        if(!$apiKey){
            $this->ajaxReturn(array("code"=>0,"msg"=>"X-BashTokid error"));
        }
        $apiKey=decodeApiKey($apiKey);
        $xBashToken=I("X-BashToken");
        if(!$xBashToken){
            $this->ajaxReturn(array("code"=>0,"msg"=>"X-BashToken error"));
        }
        $url="/".__INFO__;
       // echo $url.$apiKey;
        $xBashTokenCheck=md5($url.$apiKey);

        if($xBashToken!=$xBashTokenCheck){
           $this->ajaxReturn(array("code"=>0,"msg"=>"xBashTokid error"));
        }


    }
    public function webInfo(){
        $json=http_post(C('STORM_CENTER_PATH')."/webInfo",array("url"=>I("url")),'json');
        $this->_record($json);

        $this->ajaxReturn($json);
    }
    public function webScoreInfo(){
        $json=http_post(C('STORM_CENTER_PATH')."/webScoreInfo",array("url"=>I("url")),'json');
       // dump($json);
        $this->_record($json);

        $this->ajaxReturn($json);

    }
    public function webAvailStatistics(){
        $province=I("province");
        if($province=='0'){
            $province="china";
        }
        $json=http_post(C('STORM_CENTER_PATH')."/webAvailStatistics",array("province"=>$province),'json');
        $this->_record($json);

        $this->ajaxReturn($json);
    }
    public function webServerStatistics(){
        $json=http_post(C('STORM_CENTER_PATH')."/webServerStatistics",array(),'json');
        $this->_record($json);

        $this->ajaxReturn($json);
    }
    public function webServerVersionStatistics(){
        $json=http_post(C('STORM_CENTER_PATH')."/webServerVersionStatistics",array("serverName"=>I("serverName")),'json');
        $this->_record($json);
        $this->ajaxReturn($json);
    }
    private function _record($result){
        $log['data']=$result;
       // echo ACTION_NAME;
        $log['actionName']=ACTION_NAME;
        $log['user']=I("X-BashTokid");
       // dump($log);


       LOGNEW(Constants::$LOG_TYPE_WEBSURVEY,json_encode($log),1);
    }



}