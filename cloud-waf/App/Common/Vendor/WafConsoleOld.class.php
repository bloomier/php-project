<?php
namespace Common\Vendor;
class WafConsoleOld  {
    public static   $API_HOST="https://183.131.19.19:8080";
    public static  $API_LIST="/webapp/list";
    public static   $API_CREATE="/webapp/create";
    public static   $API_EDIT="/webapp/edit";
    public static   $API_DELETE="/webapp/delete";
    public static   $API_FIND="/webapp/find";
    public static  $ERROR_MAPPER=array(
        0=>"正常",
        4097=>"请求接口无效",
        4098=>"请求数据格式无效",
        4353=>"保护站点配置项缺失",
        4354=>"保护站点配置格式有误",
        4355=>"保护站点重复",
        4356=>"保护站点不存在"
    );

    public function _list(){
        $result = $this->request(WafConsole::$API_HOST.WafConsole::$API_LIST, null);
        return $result;

    }

    /**
     * @param $config array(
            ip=>"",port=>"",domain=>array()
     * )
     * @return mixed
     */
    public function _create($config){
        $result=$this->request(WafConsole::$API_HOST.WafConsole::$API_CREATE,$config);
        return $result;


    }
    public function _delete($id){
        $result=$this->request(WafConsole::$API_HOST.WafConsole::$API_DELETE,array(id=>$id));
        return $result;
    }
    /**
     * @param $config array(
         ip=>"",port=>"",domain=>array(),id=>""
     * )
     * @return mixed
     */
    public function _edit($config){
        $result=$this->request(WafConsole::$API_HOST.WafConsole::$API_EDIT,$config);
        return $result;
    }
    public function _find($config){
        $result=$this->request(WafConsole::$API_HOST.WafConsole::$API_FIND,$config);
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
        $error=$ret['error'];

        $code=$error[0];
        if($code==0){//添加成功
            $data=$this->_find(array(id=>$ret['webapp_id']));
            return array(code=>1,data=>$data);
        }else if($code==4355){//已经存在
            $exits=$error[1];
            $domains=$exits['domain'];
            $ret_code=3;
            if(!in_array($config['domain'],$domains)){//如果不在列表内 需要调用edit方法
                $exits['domain'][]=$config['domain'];
                $this->_edit($exits);
                $ret_code=2;
            }
            $data=$this->_find(array(id=>$exits['id']));
            return array(code=>$ret_code,data=>$data);
        }else{
            return array(code=>0,data=>WafConsole::$ERROR_MAPPER[$code]);
        }
    }
    public function _deleteOrEdit($id,$domain){
        $ret=$this->_find(array(id=>$id));
        if($ret){
            $vaule_array=array_values($ret);
            $conf=$vaule_array[0];
            $domains=$conf['domain'];
            if(in_array($domain,$domains)){
                $new_domains=array();
                foreach($domains as $d){
                    if($d!=$domain){
                        $new_domains[]=$d;
                    }
                }
                if(count($new_domains)==0){//删除操作
                    $ret=$this->_delete($id);
                    $error=$ret['error'];
                    $code=$error[0];
                    if($code==0) {//添加成功
                        return array(code=>1,msg=>"delete");
                    }else{
                        return array(code=>0,data=>WafConsole::$ERROR_MAPPER[$code]);
                    }
                }else{//更新操作
                    $conf['domain']=$new_domains;
                    $conf["id"]=$id;
                    $ret=$this->_edit($conf);
                    $error=$ret['error'];
                    $code=$error[0];
                    if($code==0) {//添加成功
                        return array(code=>1,msg=>"edit");
                    }else{
                        return array(code=>0,data=>WafConsole::$ERROR_MAPPER[$code]);
                    }

                }

            }

        }
        return array(code=>1,msg=>"do nothing");

    }


    private function request($url,$data){
        $_curl = curl_init($url);
        curl_setopt($_curl, CURLOPT_FOLLOWLOCATION, 1); // 使用自动跳转
        curl_setopt($_curl, CURLOPT_SSL_VERIFYHOST, 2); // 从证书中检查SSL加密算法是否存在
        curl_setopt($_curl, CURLOPT_SSLCERT, getcwd()."/Public/cer/client.crt");
        curl_setopt($_curl, CURLOPT_SSLCERTPASSWD, "000000");
        curl_setopt($_curl, CURLOPT_SSLKEY,getcwd()."/Public/cer/client.key");

        curl_setopt($_curl, CURLOPT_SSL_VERIFYPEER, false); // 信任任何证书，不是CA机构颁布的也没关系
        curl_setopt($_curl, CURLOPT_SSL_VERIFYHOST, 0); // 检查证书中是否设置域名，如果不想验证也可设为0
        curl_setopt($_curl, CURLOPT_VERBOSE, '1'); //debug模式，方便出错调试

        curl_setopt($_curl, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($_curl, CURLOPT_POST,1);
        curl_setopt( $_curl, CURLOPT_POSTFIELDS,json_encode($data));
        curl_setopt($_curl, CURLOPT_RETURNTRANSFER,true);
        curl_setopt($_curl,CURLOPT_TIMEOUT,15);
        curl_setopt($_curl, CURLOPT_HTTPHEADER, array(
                'Content-Type:application/x-www-form-urlencoded',
                'User-Agent : Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)',
                'charset=UTF-8','Expect:')
        );

        $result = curl_exec($_curl);
//        if(!curl_errno($_curl)){
//            $info = curl_getinfo($_curl);
//            dump($info);
//        } else {
//            echo 'Curl error: ' . curl_error($_curl);
//        }
        $result=str_replace("null:","\"null\":",$result);
        return json_decode($result,true);

    }



}