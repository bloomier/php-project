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
use Common\Vendor\WafConsole;

class AccessController extends BaseController {


    /**
     * 查询所有系统角色的用户，以及该站点关注的用户
     * 目前直接查询所有用户，避免未关注的时候不能选择
     */
    private function test(){
        //header("Content-Type: text/html; charset=utf-8");
    }

    /**  进入列表 */
    public function index(){
        $this->display("accessList");
    }

    /** 进入新增或者修改页面 */
    public function addAccess(){
        $this->getAllSites();
        $this->assign("ip",I('ip'));
        $this->display("addAccess");
    }

    /** 获取所有站点用户选择 */
    public function getAllSites(){
        $_id = I('uuid');

        $titleArr = array();
        $m = new StringModel(Constants::$DB_ASSET);
        $rows = $m->field('_id,title')->select();
        foreach($rows as $k=>$v){
            $titleArr[$v['_id']] = $v['title'] ? $v['title'] : $v['_id'];
        }

        $selectedSites = array();
        $hadExsitArr = array();
        if($_id){
            $md = new StringModel(Constants::$DB_ACCESS_LIST);
            $row = $md->where(array(_id=>$_id))->find();
            if($row && $row['match']){
                $match = $row['match'];
                if($match['domain']){
                    foreach($match['domain'] as $k=>$v){
                        $hadExsitArr[$v] = $v;
                        $one['value'] = $v;
                        $one['name'] = $titleArr[$v]."-".$v;
                        $one['id'] = 2 + $k++;
                        $one['pId'] = 1;
                        $selectedSites[] = $one;
                    }
                }
            }
            $this->assign("currentObject", urlencode(json_encode($row)));
        }


        $items = array();
        $i = 2;
        foreach($rows as $k=>$v){
            if(!array_key_exists($v['_id'],$hadExsitArr)){
                $name = $v['title'] ? $v['title'] : $v['_id'];
                $one['value'] = $v['_id'];
                $one['name'] = $name."-".$v['_id'];
                $one['id'] = $i++;
                $one['pId'] = 1;
                $items[] = $one;
            }
        }
        $this->assign("canSelectSites", urlencode(json_encode($items)));
        $this->assign("selectedSites", urlencode(json_encode($selectedSites)));
        //$this->ajaxReturn($items);
    }

    /** 添加或者修改访问控制列表  */
    public function addOrUpdateAccess(){
        $md = new StringModel(Constants::$DB_ACCESS_LIST);
        if(I('_id')){
            $uuid = I('_id');
        } else {
            $uuid = uuid();
        }

        $config = $this->createConfig($uuid,true);
        $params = $this->createConfig($uuid,false);;
        if(!I("ip")){
            $this->ajaxReturn(array(msg=>'操作失败,请传入ip', code=>0));
        }
        $where = array();
        $where['ip'] = I('ip');
        $where['_logic'] = 'and';
        $where['_id'] = array('$exists'=>true, '$not'=>array('$in'=>array($uuid)) );
        //先判断该ip是否已经存在
        $rows = $md->where($where)->select();
        if($rows){
            $this->ajaxReturn(array(msg=>'操作失败,IP已存在', code=>0));
        }

        //加入云waf策略
        $console=new WafConsole();
        if(I('_id')){
            $result = $console->_ac_edit($config);
        } else {
            $result = $console->_ac_create($config);
        }

        $error = $result['error'];
        $code=$error[0];
        if($code != 0){
            //dump($error);
            $msg = WafConsole::$ERROR_MAPPER[$code];
            $this->ajaxReturn(array(msg=>$msg, code=>0));
        }
        //入库
        $md->save($params,array(upsert=>true));
        $this->ajaxReturn(array(msg=>'操作成功', code=>1));
    }

    /** 组装数据 */
    private function createConfig($uuid, $isEncode){
        $level = I('level');
        $config = array();
        $config['action'] = I('action');
        $config['expire'] = intval(I('expire'));
        $config['uuid'] = $uuid;
        $sip = array();
        //www.hzsj.gov.cn 183.136.190.62
        $sip[] = array(I('ip'),'');
        $sip[] = array(I('ip'),'X-Forwarded-For,-1');//I('forwarded')


        $match = array();
        $match["sip"] = $sip;
        $domains = '';
        if($level == 'site'){
            $domains = I('domains');
            $domain = explode(',', I('domains'));
            $match["domain"] = $domain;
        } elseif ($level == 'url'){
            $domains = I('urlDomain');
            $domain = explode(',', I('urlDomain'));
            $match["domain"] = $domain;
            $url = explode(',', I('urls'));
            $match["url"] = $url;
        }

        if($isEncode){
            //$config['match'] = json_encode($match);
            $config['match'] = $match;
        } else {
            $config['domains'] = $domains;
            $count = 0;
            //避免出现没有域名时候，前端显示长度为1
            if($domains && $domains != ''){
                $count = count(explode(',', $domains));
            }
            $config['domainCount'] = $count;
            $config['level'] = I('level');
            $config['match'] = $match;
            $config['desc'] = I('desc');
            $config['ip'] = I('ip');
            if(I('_id')){
                //$config['modifyTime'] = date("Y-m-d H:i:s");
                $config['createModifyTime'] = date("Y-m-d H:i:s");
            } else {
                $config['createModifyTime'] = date("Y-m-d H:i:s");
                $config['type'] = '手动';
            }

            $config['_id'] = $uuid;
        }

        return $config;
    }

    /** 删除访问控制 */
    public function deleteAccess(){
        $uuid = I('uuid');
        if(!$uuid){
            $this->ajaxReturn(array(code=>0,msg=>"参数错误"));
        }
        $uuids = explode(",",$uuid);
        $md=new StringModel(Constants::$DB_ACCESS_LIST);
        //$md->where(array(_id=>array("in",$uuids)))->delete();

        $console=new WafConsole();
        foreach($uuids as $k=>$v){
            $ret = $console->_ac_delete($v);
            if ($ret['error'][0] == 0) {//云waf接口调用成功
                $md->where(array(_id=>$v))->delete();
            }
        }

        $this->ajaxReturn(array(code=>1,msg=>"删除成功"));
    }

    private function test2(){
        $console=new WafConsole();
        $result=$console->_ac_delete('778542E6-F3BE-41D1-9F9D-5207F99D3C0C');
        dump($result);
    }

    public function getAcList(){
        header("Content-Type: text/html; charset=utf-8");
        $console = new WafConsole();
        $list = $console->_ac_list();
        dump($list);
    }

    private function lock_ip(){
        $config = array();
        $config['action'] = 'block';
        $config['expire'] = 0;
        $config['uuid'] = '778542E6-F3BE-41D1-9F9D-5207F99D3C0C';
        $sip = array();
        //www.hzsj.gov.cn 183.136.190.62
        $sip[] = array("183.136.190.61","");
        $domain = array("test.baidu.com");
        $match = array();
        $match["sip"] = $sip;
        $match["domain"] = $domain;
        $config['match'] = json_encode($match);
        //$config=array(domain=>$domain, ip=>$ip, port=>$port, rule=>1, bypass=>0 );
        $console=new WafConsole();
        $result = $console->_ac_create($config);
        dump($result);
    }


    /** 获取访问控制列表直接（从本地库获取） */
    public function getAccessList(){
        $md = new StringModel(Constants::$DB_ACCESS_LIST);
        $list = $md->select();
        $items = array();
        foreach($list as $k=>$row){
            $items[]=$row;
        }
        //$this->ajaxReturn($result);

        $ret['recordsTotal']= count($items);
        $ret['recordsFiltered'] = count($items);
        $ret['items'] = array_values($items);
        $this->ajaxReturn($ret);
    }

    /** 获取访问控制列表直接（直接从云waf获取） */
    private function getAccessList1(){
        $console = new WafConsole();
        $list = $console->_ac_list();
        $items = array();
        foreach($list as $k=>$row){
            $items[]=$row;
        }
        //$this->ajaxReturn($result);

        $ret['recordsTotal']= count($items);
        $ret['recordsFiltered'] = count($items);
        $ret['items'] = array_values($items);
        $this->ajaxReturn($ret);
    }

}