<?php
namespace IAPI\Controller;
use Common\Model\StringModel;
use Common\Vendor\Constants;
use Common\Vendor\WafConsole;
class LockIPController extends IpAuthController {

    private function testKey(){
        $arr = C('ALI_SOURCE_IP');
        dump(array_keys($arr));
    }

    private function testCondition(){
        $md = new StringModel(Constants::$DB_ACCESS_LIST);
        $where = array();
        //$where['ip'] = $ip;
        $where['expire'] = array('$ne'=>0);
        $rows = $md->where($where)->select();
        dump($rows);
    }

    private function testWhiteIp(){
        dump($this->isWhiteIp("116.211.163.24"));
    }

    private function isWhiteIp($ip){
        $sourceIp = C('ALI_SOURCE_IP');
        //ip是白名单中的key
        if(array_key_exists($ip,$sourceIp)){
            return true;
        }

        $keys = explode('.', $ip);
        if(count($keys) == 4) {
            $prifix = $keys[0] . '.' . $keys[1] . '.' . $keys[2];
            //ip前三个的组合是白名单中的key
            if (array_key_exists($prifix, $sourceIp)) {
                $value = $sourceIp[$prifix];
                //value等于all，限定所有
                if($value == "all"){
                    return true;
                } else {
                    $lastIp = intval($keys[3]);
                    $lastIpArr = explode('/',$value);
                    //ip最后一位在此范围内
                    if(count($lastIpArr) == 2 && $lastIp >=intval($lastIpArr[0])
                        && $lastIp <=intval($lastIpArr[1])){
                        return true;
                    }
                    return false;
                }
            } else {
                return false;
            }
        }
        //不合法的ip，也应该过滤掉，在此返回true
        return true;
    }

    public function lockIP(){
        if(!I('ips')){
            $this->ajaxReturn(array("code"=>0,"msg"=>"参数错误"));
        }
        $md = new StringModel(Constants::$DB_ACCESS_LIST);
        $ips = explode(',', I('ips'));
        $sourceIp = C('ALI_SOURCE_IP');
        foreach($ips as $k=>$v){
            $uuid = uuid();
            $ip = $v;
            //ip不在白名单内，则封ip
            if(!$this->isWhiteIp($ip)){
                $where = array();
                $where['ip'] = $ip;
                $where['expire'] = 0;
                //$where['expire'] = array('$ne'=>0);
                //$where['type'] = "自动";
                //先判断该ip是否已经存在,不存在才会添加
                $rows = $md->where($where)->select();
                if(!$rows){
                    $config = $this->createConfig($uuid, true, $ip);
                    $params = $this->createConfig($uuid, false, $ip);
                    //加入云waf策略
                    $console=new WafConsole();
                    $result = $console->_ac_create($config);

                    $error = $result['error'];
                    $code=$error[0];
                    if($code != 0){
                        //dump($error);
                        //$msg = WafConsole::$ERROR_MAPPER[$code];
                        //$this->ajaxReturn(array(msg=>$msg, code=>0));
                    } else {
                        //入库
                        $md->save($params,array(upsert=>true));
                    }


                }
            }

//            $keys = explode('.', $ip);
//            if(count($keys) == 4){
//                $prifix =  $keys[0].'.'.$keys[1].'.'.$keys[2];
//                if(array_key_exists($prifix,$sourceIp)){
//                    //此处还需判断最后一位ip大小
//                } else {
//                    $where = array();
//                    $where['ip'] = $ip;
//                    $where['expire'] = 0;
//                    //$where['expire'] = array('$ne'=>0);
//                    //$where['type'] = "自动";
//                    //先判断该ip是否已经存在,不存在才会添加
//                    $rows = $md->where($where)->select();
//                    if(!$rows){
//                        $config = $this->createConfig($uuid, true, $ip);
//                        $params = $this->createConfig($uuid, false, $ip);
//                        //加入云waf策略
//                        $console=new WafConsole();
//                        $result = $console->_ac_create($config);
//
//                        $error = $result['error'];
//                        $code=$error[0];
//                        if($code != 0){
//                            //dump($error);
//                            //$msg = WafConsole::$ERROR_MAPPER[$code];
//                            //$this->ajaxReturn(array(msg=>$msg, code=>0));
//                        } else {
//                            //入库
//                            $md->save($params,array(upsert=>true));
//                        }
//
//
//                    }
//                }
//            }

        }
        $this->ajaxReturn(array(msg=>'操作成功', code=>1));


    }


    /** 组装数据 */
    private function createConfig($uuid, $isEncode,$ip){
        $level = 'ip';
        $config = array();
        $config['action'] = 'block';
        $config['expire'] = 0;
        $config['uuid'] = $uuid;
        $sip = array();
        $sip[] = array($ip,'');
        $sip[] = array($ip,'X-Forwarded-For,-1');

        $match = array();
        $match["sip"] = $sip;

        if($isEncode){
            $config['match'] = $match;
        } else {
            $count = 0;
            $config['domainCount'] = $count;
            $config['level'] = $level;
            $config['match'] = $match;
            $config['desc'] = '自动';
            $config['ip'] = $ip;
            $config['createModifyTime'] = date("Y-m-d H:i:s");
            $config['type'] = '自动';

            $config['_id'] = $uuid;
        }

        return $config;
    }



}