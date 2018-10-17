<?php
namespace Home\Controller;
use Home\Globals\Constants;
use Think\Model\MongoModel;
use Think\Controller;
use Think\Model;


class IndexController extends Controller {


	/**
	 * 转到用户登录界面
	 */
    public function index(){
        $admin=I('admin');
        if($admin == "admin"){
            $this->redirect("Login/viewModels?admin=".$admin);
        } else {
            $this->redirect("Login/viewModels");
        }
    }

    public function toTest(){
        $this->display("test");
    }

    public function test(){
        var_dump(encodeApiKey("lycredit.gov.cn").' : '.decodeApiKey('TyQeIqC8Gt0PWtVBaiv+Iw=='));
        var_dump(encodeApiKey("lycredit.gov.cn").' : '.'TyQeIqC8Gt0PWtVBaiv+Iw==');
    }


    public function testSoap(){
        $soap=new \SoapClient('https://www.ip866.com/DbAppSecurity/WebService.asmx?wsdl');
        $param['userkey']='https://stldxh@dbappsecur&67@dbappSecurity.com.cn';
        $param['reverseText']='115.236.148.160';
        $param['reverseText']='115.236.148.1/24';

        $result2 = $soap->__soapCall("ReverseIP",array('parameters'=> $param));
        var_dump($result2);
    }
    
    /**
     * 用户登录
     */
    public function login(){
    	$userName = $_POST['userName'];
    	$passwd =  $_POST['userPassword'];
    	if($userName == 'admin' && $passwd == 'passwd'){
    		$this->assign("aa","assad");
    		$this->display("index");
    	}else{
    		$this->display("login");
    	}
    }


    public function clearApiKeyCache(){
        $apiKeys=M("api_key")->select();
        if($apiKeys){
            foreach($apiKeys as $ak){
                S($ak['key'],null);
            }

        }
    }

    public function about(){
        $version="未知";
        if(is_file("SVN_Build_REV")){
            $version=file_get_contents("SVN_Build_REV");
        }
        $this->show("version:".$version, 'utf-8', 'text/html');
    }

    public function warnsms(){
        $domains=I("domains");

        $json=http_post("http://172.16.2.88:8089/warnapp/api/contract/accessinfos/list?domains=".$domains,null,'json');
        $this->ajaxReturn($json);
    }

    public function testMongodb(){
        $model =  new MongoModel("user");
        $a = $model->getPk();
        var_dump($a);

        $model1 =  D("user");
        var_dump($model1->where(array('username'=>"admin"))->select());

    }

}