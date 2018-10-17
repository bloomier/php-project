<?php
namespace Common\Vendor;
class WafConsole  {
    public static $API_HOST="https://183.131.19.19:8080";
    //public static $API_HOST="https://172.16.7.71:8080";
    public static $API_LIST="/webapp/list";
    public static $API_CREATE="/webapp/create";
    public static $API_EDIT="/webapp/edit";
    public static $API_DELETE="/webapp/delete";
    public static $API_FIND="/webapp/find";
    public static $API_CLEAR="/webapp/clear";



    /** 以下为访问控制规则相关配置  */
    public static $API_AC_LIST="/acl/list";
    public static $API_AC_CREATE="/acl/create";
    public static $API_AC_EDIT="/acl/edit";
    public static $API_AC_DELETE="/acl/delete";

    /** 全局控制配置 */
    public static $API_GLOBAL_LIST = "/platform/list";
    public static $API_GLOBAL_CONFIG = "/platform/config";
    //public static $API_GLOBAL_CONFIG = "global/config";

    public static  $ERROR_MAPPER=array(
        0=>"正常",
        113=>"未知参数项",
        114=>"缺少参数项",
        115=>"错误参数项",
        4097=>"请求接口无效",
        4098=>"请求数据格式无效",
        4353=>"对象不存在",
        4354=>"对象已存在",
        4355=>"保护站点重复",
        4356=>"保护站点不存在",
        4609=>"访问控制配置项缺失",
        4610=>"访问控制配置项格式有误",
        4611=>"访问控制重复",
        4612=>"访问控制不存在",
        4865=>"消息订阅配置项缺失",
        4866=>"消息订阅配置项格式有误",
        4867=>"消息订阅重复",
        4868=>"消息订阅不存在",
    );

    /** 获取云waf防护站点列表 */
    public function _list(){
        //$result = $this->request(WafConsole::$API_HOST.WafConsole::$API_LIST, null);
        $result = $this->request(C('YUN_WAF_PATH').WafConsole::$API_LIST, null, false);
        return $result;

    }


    /**
     * @param $config array(
            ip=>"",port=>"",domain=>array()
     * )
     * @return mixed
     */
    public function _create($config){
        $result=$this->request(C('YUN_WAF_PATH').WafConsole::$API_CREATE,$config, false);
        return $result;


    }
    public function _delete($id){
        $result=$this->request(C('YUN_WAF_PATH').WafConsole::$API_DELETE,array(id=>$id), false);
        return $result;
    }

    public function _clear(){
        $result=$this->request(C('YUN_WAF_PATH').WafConsole::$API_CLEAR, null, false);
        return $result;
    }
    /**
     * @param $config array(
         ip=>"",port=>"",domain=>array(),id=>""
     * )
     * @return mixed
     */
    public function _edit($config){
        $result=$this->request(C('YUN_WAF_PATH').WafConsole::$API_EDIT,$config, false);
        return $result;
    }

    public function _find($config){
        $result=$this->request(C('YUN_WAF_PATH').WafConsole::$API_FIND,$config, false);
        return $result;
    }

    /**
     * @param $config
     * @return array(
            code: 1/2/3/0 1:添加成功 2:以修改方式添加成功 3:站点已经在保护列表中了 0:添加失败
     * )
     */
    public function _createOrEdit($config){
        $ret=$this->_create($config);
        //如果已经存在
        //$error=$ret['code'];
        $code=$ret['code'];
        if($code==0){//添加成功
            //$data=$this->_find(array(id=>$ret['webapp_id']));
            return array(code=>1,data=>$ret['items']);
        }else if($code==4355){//已经存在
            $exits = $ret['items'];
            $id = $exits['id'];
            $domains = $exits['domain'];
            $ret_code=3;
            if(!in_array($config['domain'],$domains)){//如果不在列表内 需要调用edit方法
                $exits['domain'][]=$config['domain'];
                $ret=$this->_edit($exits);
                $ret_code=2;
            }
            //$data=$this->_find(array(id=>$exits['id']));
            if($ret['code'] == 0){
                return array(code=>$ret_code,data=>$ret['items']);
            } else {
                $data=$this->_find(array(id=>$id));
                return array(code=>$ret_code,data=>$data);
            }

        }else{
            return array(code=>0,data=>WafConsole::$ERROR_MAPPER[$code]);
        }
    }

    public function _deleteOrEdit($id,$domain){
        $ret=$this->_find(array(id=>$id));
        if($ret && $ret['code'] == 0){
            //$vaule_array=array_values($ret);
            $conf = $ret['items'][$id];
            $domains = $conf['domain'];
            if(in_array($domain,$domains)){
                $new_domains=array();
                foreach($domains as $d){
                    if($d!=$domain){
                        $new_domains[]=$d;
                    }
                }
                if(count($new_domains)==0){//删除操作
                    $ret=$this->_delete($id);
                    if($ret && $ret['code'] == 0) {//直接删除成功
                        return array(code=>1,msg=>"delete");
                    }else{
                        return array(code=>0,data=>WafConsole::$ERROR_MAPPER[$ret['code']]);
                    }
                }else{//更新操作
                    $conf['domain']=$new_domains;
                    $conf["id"]=$id;
                    $ret=$this->_edit($conf);
                    if($ret && $ret['code'] == 0) {// 已edit方式删除成功
                        return array(code=>1,msg=>"edit");
                    }else{
                        return array(code=>0,data=>WafConsole::$ERROR_MAPPER[$ret['code']]);
                    }

                }

            } else {//云waf不存在
                $ret=$this->_delete($id);
                if($ret && ($ret['code'] == 0 || $ret['code'] == 4353)) {//直接删除成功
                    return array(code=>1,msg=>"delete");
                }else{
                    return array(code=>0,data=>WafConsole::$ERROR_MAPPER[$ret['code']]);
                }
            }

        }
        return array(code=>1,msg=>"do nothing");

    }


    /** 获取访问控制规则列表  */
    public function _ac_list(){
        $result = $this->request(C('YUN_WAF_PATH').WafConsole::$API_AC_LIST, null, false);
        return $result;
    }

    /** 创建访问控制规则 */
    public function _ac_create($config){
        // $config['uuid'] = uuid();
        $result=$this->request(C('YUN_WAF_PATH').WafConsole::$API_AC_CREATE,$config, false);
        return $result;
    }

    /** 删除访问控制规则 */
    public function _ac_delete($uuid){
        $result=$this->request(C('YUN_WAF_PATH').WafConsole::$API_AC_DELETE,array(uuid=>$uuid), false);
        return $result;
    }

    /** 编辑访问控制规则 */
    public function _ac_edit($config){
        $result=$this->request(C('YUN_WAF_PATH').WafConsole::$API_AC_EDIT,$config, false);
        return $result;
    }

    /** 获取全局策略配置 */
    public function _global_list(){
        $result = $this->request(C('YUN_WAF_PATH').'/platform/list', null, true);
        return $result;
    }


    public function _php_info(){
        $result = $this->request(C('YUN_WAF_PATH').WafConsole::$API_GLOBAL_LIST,null,true);
        return $result;
    }

    /** 编辑全局策略配置 */
    public function _global_edit($config){
        $result = $this->request(C('YUN_WAF_PATH').WafConsole::$API_GLOBAL_CONFIG, $config, false);
        return $result;
    }


    private function request($url,$data,$isGet){
        $_curl = curl_init($url);
        curl_setopt($_curl, CURLOPT_FOLLOWLOCATION, 1); // 使用自动跳转
        curl_setopt($_curl, CURLOPT_SSL_VERIFYHOST, 2); // 从证书中检查SSL加密算法是否存在
        curl_setopt($_curl, CURLOPT_SSLCERT, getcwd()."/Public/cer/client.crt");
        curl_setopt($_curl, CURLOPT_SSLCERTPASSWD, "000000");
        curl_setopt($_curl, CURLOPT_SSLKEY,getcwd()."/Public/cer/client.key");

        curl_setopt($_curl, CURLOPT_SSL_VERIFYPEER, false); // 信任任何证书，不是CA机构颁布的也没关系
        curl_setopt($_curl, CURLOPT_SSL_VERIFYHOST, 0); // 检查证书中是否设置域名，如果不想验证也可设为0
        curl_setopt($_curl, CURLOPT_VERBOSE, '1'); //debug模式，方便出错调试

        if($isGet){
            curl_setopt($_curl, CURLOPT_CUSTOMREQUEST, "GET");
            curl_setopt($_curl, CURLOPT_POST,0);
        } else {
            curl_setopt($_curl, CURLOPT_CUSTOMREQUEST, "POST");
            curl_setopt($_curl, CURLOPT_POST,1);
        }


        curl_setopt( $_curl, CURLOPT_POSTFIELDS,json_encode($data));
        curl_setopt($_curl, CURLOPT_RETURNTRANSFER,true);
        curl_setopt($_curl,CURLOPT_TIMEOUT,15);
        curl_setopt($_curl, CURLOPT_HTTPHEADER, array(
                'Content-Type:application/x-www-form-urlencoded',
                'User-Agent : Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)',
                'charset=UTF-8','Expect:')
        );

        $result = curl_exec($_curl);

        $result=str_replace("null:","\"null\":",$result);
        return json_decode($result,true);

    }



}