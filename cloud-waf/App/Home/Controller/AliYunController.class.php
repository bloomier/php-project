<?php
/**
 * Created by PhpStorm.
 * User: jianghaifeng
 * Date: 2016/3/1
 * Time: 14:25
 */

namespace Home\Controller;
use Think\Controller;
use Admin\Controller\BaseController;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;

class AliYunController extends Controller {

    // 218.60.114.145&orderNum=361332008
    // frontIp=120.55.238.176&orderNum=361352030
    // frontIp=180.97.162.80&orderNum=361312003
    /** */
    public function index(){
        $this->display("aliyun");
    }

    private function testUtc(){
        //echo (new DateTime('2014-06-13 14:30:00'))->format('Y-m-d\TH:i:s\Z');
        $dateKey = date("Y-m-d\TH:i:s\Z",time() - 8*3600);
        echo $dateKey."";
    }

    /** 计算签名  */
    private function computeSignature($parameters){
        $accessKeySecret = "YpPmqxBrXSVpmlMbSoQZNi4ScyKpbV";
        ksort($parameters);//第一步：排序
        $canonicalizedQueryString = '';
        foreach($parameters as $key => $value){//第二步：参数编码  第三部：将参数名后参数链接起来
            $canonicalizedQueryString .= '&' . $this->percentEncode($key). '=' . $this->percentEncode($value);
        }
        $stringToSign = 'POST'.'&%2F&' . $this->percentEncode(substr($canonicalizedQueryString, 1));
        $signature = $this->signString($stringToSign, $accessKeySecret."&");

        return $signature;
    }

    /** 计算待签名字符串 */
    public function signString($source, $accessSecret){
        return	base64_encode(hash_hmac('sha1', $source, $accessSecret, true));
    }

    /** 参数和参数值编码,并将特殊字符串替换  */
    protected function percentEncode($str){
        $res = urlencode($str);
        $res = preg_replace('/\+/', '%20', $res);
        $res = preg_replace('/\*/', '%2A', $res);
        $res = preg_replace('/%7E/', '~', $res);
        return $res;
    }

    /** 1、 查询高防实例4层转发规则列表  DescribeLay4Rules */
    public function DescribeLay4Rules(){
        $params = array();
        $params = $this->createCommomParams($params);

        $params['PageNumber'] = "1";
        $params['PageSize'] = "10";
        $params['InstanceId'] = "361312003";
        $params['Action'] = "DescribeLay4Rules";
        $Signature = $this->computeSignature($params);
        $params['Signature'] = $Signature;//签名结果串，关于签名的计算方法
        //echo $Signature;
        //$param['RegionId'] = "cn-hangzhou";
        $json=http_post(C('A_LI_YUN_PATH'),$params,'json');
        dump($json);
    }

    /** 2、新增高防实例4层转发规则 CreateLay4Rule */
    public function CreateLay4Rule(){
        $params = array();
        $params = $this->createCommomParams($params);


        $params['Action'] = "CreateLay4Rule";
        $params['InstanceId'] = "361312003";//高防实例ID
        $params['ProtocolType'] = "tcp"; //协议（源站和vip相同）,tcp/udp
        $params['VipPort'] = "10";//高防IP端口
        $params['SourcePort'] = "";//源站端口
        $params['SourceIps'] = "";//源站ip列表

        $Signature = $this->computeSignature($params);
        $params['Signature'] = $Signature;//签名结果串，关于签名的计算方法

        //$param['RegionId'] = "cn-hangzhou";
        $json=http_post(C('A_LI_YUN_PATH'),$params,'json');
        dump($json);
    }

    /** 3、删除高防实例4层转发规则 DeleteLay4Rule */
    public function  DeleteLay4Rule(){
        $params = array();
        $params = $this->createCommomParams($params);

        $params['Action'] = "DeleteLay4Rule";
        $params['InstanceId'] = "361312003";//高防实例ID
        $params['VipPort'] = "10";  //高防IP端口

        $Signature = $this->computeSignature($params);
        $params['Signature'] = $Signature;//签名结果串，关于签名的计算方法

        //$param['RegionId'] = "cn-hangzhou";
        $json=http_post(C('A_LI_YUN_PATH'),$params,'json');
        dump($json);
    }

    /** 4、 查询高防实例配置的域名防护列表 DescribeDomains */
    public  function DescribeDomains(){
        $params = array();
        $params = $this->createCommomParams($params);

        $params['PageNumber'] = "1";
        $params['PageSize'] = "10";
        $params['InstanceId'] = "361312003";
        $params['Action'] = "DescribeDomains";

        $Signature = $this->computeSignature($params);
        $params['Signature'] = $Signature;//签名结果串，关于签名的计算方法

        //$param['RegionId'] = "cn-hangzhou";
        $json=http_post(C('A_LI_YUN_PATH'),$params,'json');
        var_dump($json);
    }

    /** 5、 配置高防实例域名防护配置 */
    public function  CreateDomain(){
        $params = array();
        $params = $this->createCommomParams($params);

        $params['Action'] = "CreateDomain";
        $params['InstanceId'] = "361312003";//高防实例ID
        $params['Domain'] = "10";//域名
        $params['Protocols'] = "1";//协议，http、https，JSON数组格式
        $params['SourceIps'] = "10";//源站IP列表，JSON数组格式
        $params['WafEnable'] = 1;//是否开启waf 防护，0：否，1：是，默认是
        $params['CcEnable'] = 1;//是否开启cc防护，0：否，1：是，默认是

        $Signature = $this->computeSignature($params);
        $params['Signature'] = $Signature;//签名结果串，关于签名的计算方法

        //$param['RegionId'] = "cn-hangzhou";
        $json=http_post(C('A_LI_YUN_PATH'),$params,'json');
        dump($json);
    }

    /** 6、 删除高防实例域名防护配置 */
    public function DeleteDomain(){
        $params = array();
        $params = $this->createCommomParams($params);

        $params['Action'] = "DeleteDomain";
        $params['InstanceId'] = "361312003";//高防实例ID
        $params['Domain'] = "10";//域名

        $Signature = $this->computeSignature($params);
        $params['Signature'] = $Signature;//签名结果串，关于签名的计算方法

        //$param['RegionId'] = "cn-hangzhou";
        $json=http_post(C('A_LI_YUN_PATH'),$params,'json');
        dump($json);
    }

    /** 7、 设置域名cc防护配置 ModifyCcConfig */
    public function  ModifyCcConfig(){
        $params = array();
        $params = $this->createCommomParams($params);

        $params['Action'] = "ModifyCcConfig";
        $params['InstanceId'] = "361312003";//高防实例ID
        $params['Domain'] = "10";//域名
        $params['Enable'] = 1;//0:关，1：开

        $Signature = $this->computeSignature($params);
        $params['Signature'] = $Signature;//签名结果串，关于签名的计算方法

        //$param['RegionId'] = "cn-hangzhou";
        $json=http_post(C('A_LI_YUN_PATH'),$params,'json');
        dump($json);
    }

    /** 8、设置域名waf 防护开关  */
    public function ModifyWafConfig(){
        $params = array();
        $params = $this->createCommomParams($params);

        $params['Action'] = "ModifyWafConfig";
        $params['InstanceId'] = "361312003";//高防实例ID
        $params['Domain'] = "10";//域名
        $params['Enable'] = 1;   //0:关，1：开

        $Signature = $this->computeSignature($params);
        $params['Signature'] = $Signature;//签名结果串，关于签名的计算方法


        //$param['RegionId'] = "cn-hangzhou";
        $json=http_post(C('A_LI_YUN_PATH'),$params,'json');
        dump($json);
    }

    /** 11、查询ddos防护事件列表, 目前只支持最近1个月的数据 */
    public function DescribeDdosEvents(){
        $params = array();
        $params = $this->createCommomParams($params);

        $params['Action'] = "DescribeDdosEvents";
        $params['InstanceId'] = "361312003";//高防实例ID
        $params['BeginTime'] = time() * 1000 - 29 * 24 * 60 * 60 * 1000;  //开始时间，毫秒
        $params['EndTime'] = time() * 1000;    //结束时间，毫秒
        $params['PageSize'] = "1";    //当前页，默认为1
        $params['PageNumber'] = "10"; //页大小，默认为20，最大50

        $Signature = $this->computeSignature($params);
        $params['Signature'] = $Signature;//签名结果串，关于签名的计算方法


        //$param['RegionId'] = "cn-hangzhou";
        $json=http_post(C('A_LI_YUN_PATH'),$params,'json');
        dump($json);
    }

    /** 12、 查询ddos防护流量图, 目前只支持最近1个月的数据 DescribeDdosFlow */
    public function DescribeDdosFlow(){
        $params = array();
        $params = $this->createCommomParams($params);

        $params['Action'] = "DescribeDdosFlow";
        $params['InstanceId'] = "361312003";//高防实例ID
        $params['BeginTime'] = time() * 1000 - 29 * 24 * 60 * 60 * 1000;  //开始时间，毫秒
        $params['EndTime'] = time() * 1000;    //结束时间，毫秒
        //$params['Domains'] = "";      //域名列表，以逗号隔开，默认为全部
        $params['PageSize'] = "1";    //当前页，默认为1
        $params['PageNumber'] = "10"; //页大小，默认为20，最大50

        $Signature = $this->computeSignature($params);
        $params['Signature'] = $Signature;//签名结果串，关于签名的计算方法


        //$param['RegionId'] = "cn-hangzhou";
        $json=http_post(C('A_LI_YUN_PATH'),$params,'json');
        dump($json);
    }

    /** 13、 查询cc防护事件列表, 目前只支持最近1个月的数据 */
    public function DescribeCcEvents(){
        $params = array();
        $params = $this->createCommomParams($params);

        $params['Action'] = "DescribeCcEvents";
        $params['InstanceId'] = "361312003";//高防实例ID
        $params['BeginTime'] = time() * 1000 - 29 * 24 * 60 * 60 * 1000;  //开始时间，毫秒
        $params['EndTime'] = time() * 1000;    //结束时间，毫秒
        //$params['Domains'] = "";      //域名列表，以逗号隔开，默认为全部
        $params['PageSize'] = "1";    //当前页，默认为1
        $params['PageNumber'] = "10"; //页大小，默认为20，最大50

        $Signature = $this->computeSignature($params);
        $params['Signature'] = $Signature;//签名结果串，关于签名的计算方法


        //$param['RegionId'] = "cn-hangzhou";
        $json=http_post(C('A_LI_YUN_PATH'),$params,'json');
        dump($json['CcEvents']['CcEvent']);
    }

    /** 14、查询Cc防护流量图, 目前只支持最近1个月的数据 */
    public function DescribeCcFlow(){
        $params = array();
        $params = $this->createCommomParams($params);

        $params['Action'] = "DescribeCcFlow";
        $params['InstanceId'] = "361312003";//高防实例ID
        $params['BeginTime'] = time() * 1000 - 29 * 24 * 60 * 60 * 1000;  //开始时间，毫秒
        $params['EndTime'] = time() * 1000;    //结束时间，毫秒
        $params['Domains'] = "";      //域名列表，以逗号隔开，默认为全部

        $Signature = $this->computeSignature($params);
        $params['Signature'] = $Signature;//签名结果串，关于签名的计算方法


        //$param['RegionId'] = "cn-hangzhou";
        $json=http_post(C('A_LI_YUN_PATH'),$params,'json');
        dump($json);
    }



    /** 15、 查询waf防护事件列表, 目前只支持最近1个月的数据 */
    public function DescribeWafAttackEvents(){
        $params = array();
        $params = $this->createCommomParams($params);

        $params['Action'] = "DescribeWafAttackEvents";
        $params['InstanceId'] = "361312003";//高防实例ID
        $params['BeginTime'] = time() * 1000 - 29 * 24 * 60 * 60 * 1000;  //开始时间，毫秒
        $params['EndTime'] = time() * 1000;    //结束时间，毫秒
        //$params['Domains'] = "";      //域名列表，以逗号隔开，默认为全部
        $params['PageSize'] = "1";    //当前页，默认为1
        $params['PageNumber'] = "10"; //页大小，默认为20，最大50

        $Signature = $this->computeSignature($params);
        $params['Signature'] = $Signature;//签名结果串，关于签名的计算方法


        //$param['RegionId'] = "cn-hangzhou";
        $json=http_post(C('A_LI_YUN_PATH'),$params,'json');
        dump($json);
    }






    /** 16、查询waf防护的攻击类型统计, 目前只支持最近1个月的数据,数量有限不需要pagesize和pageNumber */
    public function DescribeWafAttackTypeStats(){
        $params = array();
        $params = $this->createCommomParams($params);

        $params['Action'] = "DescribeWafAttackTypeStats";
        $params['InstanceId'] = "361312003";//高防实例ID
        $params['BeginTime'] = time() * 1000 - 29 * 24 * 60 * 60 * 1000;  //开始时间，毫秒
        $params['EndTime'] = time() * 1000;    //结束时间，毫秒
        $params['Domains'] = "";      //域名列表，以逗号隔开，默认为全部
//        $params['PageSize'] = "1";    //当前页，默认为1
//        $params['PageNumber'] = "10"; //页大小，默认为20，最大50

        $Signature = $this->computeSignature($params);
        $params['Signature'] = $Signature;//签名结果串，关于签名的计算方法


        //$param['RegionId'] = "cn-hangzhou";
        $json=http_post(C('A_LI_YUN_PATH'),$params,'json');
        dump($json);
    }

    /** 17、 查询waf防护的攻击来源统计, 目前只支持最近1个月的数据 */
    public function DescribeWafAttackSourceStats(){
        $params = array();
        $params = $this->createCommomParams($params);

        $params['Action'] = "DescribeWafAttackSourceStats";
        $params['InstanceId'] = "361312003";//高防实例ID
        $params['BeginTime'] = time() * 1000 - 29 * 24 * 60 * 60 * 1000;  //开始时间，毫秒
        $params['EndTime'] = time() * 1000;    //结束时间，毫秒
        //$params['Domains'] = "";      //域名列表，以逗号隔开，默认为全部
        $params['PageSize'] = "1";    //当前页，默认为1
        $params['PageNumber'] = "10"; //页大小，默认为20，最大50

        $Signature = $this->computeSignature($params);
        $params['Signature'] = $Signature;//签名结果串，关于签名的计算方法


        //$param['RegionId'] = "cn-hangzhou";
        $json=http_post(C('A_LI_YUN_PATH'),$params,'json');
        dump($json);
    }


    /** 18、查询waf防护的攻击url统计, 目前只支持最近1个月的数据 */
    public function DescribeWafAttackUrlStats(){
        $params = array();
        $params = $this->createCommomParams($params);

        $params['Action'] = "DescribeWafAttackUrlStats";
        $params['InstanceId'] = "361312003";//高防实例ID
        $params['BeginTime'] = time() * 1000 - 1 * 24 * 60 * 60 * 1000;  //开始时间，毫秒
        $params['EndTime'] = time() * 1000;    //结束时间，毫秒
        //$params['Domains'] = "";      //域名列表，以逗号隔开，默认为全部
        $params['PageSize'] = "1";    //当前页，默认为1
        $params['PageNumber'] = "10"; //页大小，默认为20，最大50

        $Signature = $this->computeSignature($params);
        $params['Signature'] = $Signature;//签名结果串，关于签名的计算方法


        //$param['RegionId'] = "cn-hangzhou";
        $json=http_post(C('A_LI_YUN_PATH'),$params,'json');
        dump($json);
    }

    public function testTime(){
        echo time() * 1000 - 1 * 24 * 60 * 60 * 1000;
    }

    /** 创建访问时的公共参数 */
    public function createCommomParams($params){
        $params['Format'] = "JSON";//返回值的类型，支持JSON与XML 。默认为XML
        $params['Version'] = "2016-04-10";//API 版本号
        $params['AccessKeyId'] = "32wcLIC9vYxhZ4eY";//阿里云颁发给用户的访问服务所用的密钥ID
        //$params['Signature'] = "YpPmqxBrXSVpmlMbSoQZNi4ScyKpbV";//签名结果串，关于签名的计算方法
        $params['SignatureMethod'] = "HMAC-SHA1";//签名方式，目前支持HMAC- SHA1
        $params['Timestamp'] = date("Y-m-d\TH:i:s\Z",time() - 8 * 3600);//请求的时间戳。 并需要使用UTC 时间。格式为：YYYY- MM- DDThh:mm:ssZ
        $params['SignatureVersion'] = "1.0";//签名算法版本，目前版本是1.0
        $params['SignatureNonce'] = $this->getRandNum();//唯一随机数

        return $params;
    }

    /** 生存9位的随机数 */
    private function getRandNum(){
        $arr=range(1,9);
        shuffle($arr);
        $result = "";
        foreach($arr as $values){
            $result .= $values;
        }
        //$result = substr($result,0,9);
        return $result;
    }


}