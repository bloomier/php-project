<?php
/**
 * Created by PhpStorm.
 * User: jianghaifeng
 * Date: 2016/3/1
 * Time: 14:25
 */

namespace Home\Controller;
use Admin\Controller\BaseController;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;
use Common\Vendor\WafConsole;
use Common\Vendor\AliYun;
use Think\Hook;

class SitesController extends BaseController {

    /** 测试读取Excel文件 */
    private function readExcel(){
        header("Content-Type: text/html; charset=utf-8");
        $path = "test.xlsx";
        $excelUtil = new ExcelUtil();
        $data = $excelUtil->readFile($path,100);
        dump($data);
//        dump("dddd");
    }



    /** 跳转到新增站点页面 */
    public function addSite(){
        $this->listUser();
        if(I('contract_id')){
            $this->assign("contract_id",I('contract_id'));
        }
        if(I('client_id')){
            $this->assign("client_id",I('client_id'));
        }
        $this->display("addSite");
    }



    /**
     * 查询所有系统角色的用户，以及该站点关注的用户
     * 目前直接查询所有用户，避免未关注的时候不能选择
     */
    private function listUser(){
        //header("Content-Type: text/html; charset=utf-8");
        $model=new AutoIncrementModel(Constants::$DB_AUTH_USER);
        $map['username'] = array('$exists'=>true, '$not'=>array('$in'=>array("dbapp")) );
        $users = $model->field("_id,username,name,email")->where($map)->select();
        $list = array();
        foreach($users as $k=>$row){
            $list[]=$row;
        }
        $this->assign("listUser", urlencode(json_encode($list)));
    }

    /** 进入修改页面时，获取当前修改站点 */
    private function getCurrentUpdateSite(){
        $_id = I('_id');
        $md = new StringModel(Constants::$DB_ASSET_NEW);
        $row = $md->where(array(_id=>$_id))->find();
        return $row;
    }

    public function testD(){
        $md = new AutoIncrementModel(Constants::$DB_CONTRACT_LIST);
        $where = array();
        $where['state'] = 1;
        $where['end_date'] = array('$gte'=>date("Y-m-d H:i:s"));
        $rows = $md->field("_id,no,name,client")->where(array(state=>1))->select();
        dump($rows);
    }


    public function getContractList(){
        $md = new AutoIncrementModel(Constants::$DB_CONTRACT_LIST);
        $where = array();
        $where['state'] = 1;
        $where['end_date'] = array('$gte'=>date("Y-m-d"));
        $rows = $md->field("_id,no,name,client")->where($where)->select();
        $list = array();
        foreach($rows as $k=>$row){
            $list[] = $row;
        }
        $this->ajaxReturn(array(code=>1,items=>$list));
    }

    /** 批量添加站点 */
    public function batchAddSite(){
        //Hook::listen("action_begin","ddddd");
        Hook::listen('action_begin',I());
        $md = new StringModel(Constants::$DB_ASSET_NEW);
        $umd = new StringModel(Constants::$DB_USER_2_ASSET_NEW);
        $uid = current_user_id();
        $sites = I('siteList');

        $users = I('userAddList');
        $userNameId = $this->getUsersIdByName($users);
        $oneUser = array();
        $wafConsole = new WafConsole();

        // 站点规则定制
        $zone_rule = array();
        $aliyun = new AliYun();

        foreach($sites as $k=>$v){
            $id = uuid();
            $param = array();
            //新增时生存id，同时需要将此id传给云waf，云waf不在自己生存id
            $param['id'] = $id;
            $param['bypass'] = 0;
            $param['dos'] = 0;    //关停站点 0：开 1：关，添加的时候默认是开的
            $param['rule'] = 1;
            $domain = $v['domain'];
            $param['ip'] = $v['ip'];
            $param['port'] = $v['port'];
            $param['domain'] = array($domain);
            $zone_rule['rule_engine'] = I('protect_mode');
            $param['zone_rule'] = $zone_rule;
            $result = $wafConsole->_create($param);
            //dump($result);
            //云waf那边新增成功的话，然后进行入库相关操作
            if($result && $result['code'] == 0){
                $param['_id'] = $id;
                $param['name'] = $v['name'];
                $param['domain'] = $domain;
                //$param['id'] = $result['error'][1];

                // 添加关注人信息
                $oneUser['_id'] = $uid.$v['domain'];
                $oneUser['uid'] = $uid;
                //$oneUser['name'] = $v['name'];
                $oneUser['domain'] = $v['domain'];
                //$oneUser['ip'] = $v['ip'];
                $oneUser['relation_type'] = 1;
                $umd->save($oneUser, array(upsert=>true));

                foreach($users as $uk=>$uv){
                    //避免添加自己为关注人，出现该站点不能删除的情况
                    if($uid != $userNameId[$uv['telephone']]){
                        $oneUser['_id'] = $userNameId[$uv['telephone']].$v['domain'];
                        $oneUser['uid'] = $userNameId[$uv['telephone']];
                        //$oneUser['name'] = $v['name'];
                        $oneUser['domain'] = $v['domain'];
                        //$oneUser['ip'] = $v['ip'];
                        $oneUser['relation_type'] = 2;
                        $umd->save($oneUser, array(upsert=>true));
                    }
                }

                $param['contract_id'] = I('contract_id');
                $param['client_id'] = I('client_id');
                $param['is_waf_warning'] = I('is_waf_warning');
                $param['warnContacts'] = $users;
                $param['is_http'] = I('is_http');
                $param['cert_public'] = I('cert_public');
                $param['cert_private'] = I('cert_private');
                $param['cert_ca_link'] = I('cert_ca_link');
                $is_ddos = I('is_ddos');
                //如果启用DDoS，则需要调用高防ip接口创建DDoS防护
                if (!C('WAF_DEBUG')){
                    if($is_ddos == 1){
                        $config = array();
                        $config['InstanceId'] = I('InstanceId');//高防实例ID
                        $config['Domain'] = $domain;//域名
                        $config['Protocols'] = json_encode(array("http"));//协议，http、https，JSON数组格式
                        $config['SourceIps'] = json_encode(array($v['ip']));//源站IP列表，JSON数组格式
                        $config['WafEnable'] = 0;//是否开启waf 防护，0：否，1：是，默认是
                        $config['CcEnable'] = 0;//是否开启cc防护，0：否，1：是，默认是
                        // TODO 为了避免测试时，高防中出现脏数据，在此将高防注释掉
                        //$result = $aliyun->CreateDomain($config);
                        //if($result && count($result) == 1){//表示成功
                        //表示成功
                        //} else {

                        //}
                    }
                }

                $param['is_ddos'] = $is_ddos;
                $param['InstanceId'] = I('InstanceId');
                $param['is_loophole_scan'] = I('is_loophole_scan');
                $param['loophole_warning'] = I('loophole_warning');
                $param['is_available'] = I('is_available');
                $param['available_warning'] = I('available_warning');

                $param['userId'] = $uid;
                $param['create_time'] = date("Y-m-d H:i:s");
                $md->save($param, array(upsert=>true));
            } else {//若掉用云waf接口失败，则直接返回
                if($result &&  $result['code']){
                    $this->ajaxReturn(array(msg=>WafConsole::$ERROR_MAPPER[$result['code']], code=>0));
                } else {
                    $this->ajaxReturn(array(msg=>"云waf接口异常", code=>0));
                }
            }

        }
        $this->ajaxReturn(array(msg=>'操作成功', code=>1));
    }



    /** 修改站点信息 */
    public function updateSite(){
        $md = new StringModel(Constants::$DB_ASSET_NEW);
        $umd = new StringModel(Constants::$DB_USER_2_ASSET_NEW);
        $row = $md->where(array(_id=>I('_id')))->find();
        if(!$row){
            $this->ajaxReturn(array(msg=>'不存在的记录', code=>0));
        }
        $domain = I('domains');
        $row = $md->where(array(domain=>$domain,_id=>array('$ne'=>I('_id'))))->find();
        if($row){
            $this->ajaxReturn(array(msg=>'该站点已存在，不能重复添加', code=>0));
        }
        Hook::listen('action_begin',I());
        //此处uid用户插入关注人的表中记录该站点的添加人，第一次谁添加后面都是保持一致
        if($row['userId']){//一般都存在，避免以前已经添加的站点不存在
            $uid = $row['userId'];
        } else {
            $uid = current_user_id();
        }

        $param = array();
        $users = I('userAddList');
        $userNameId = $this->getUsersIdByName($users);
        $oneUser = array();

        $wafConsole = new WafConsole();


        $param['ip'] = I('ip');
        $param['port'] = intval(I('port'));
        $param['domain'] = array($domain);
        $param['id'] = I('id');
        $zone_rule = array();
        $zone_rule['rule_engine'] = I('protect_mode');
        $param['zone_rule'] = $zone_rule;
        //dump($param);
        $result = $wafConsole->_edit($param);
        //云waf那边新增成功的话，然后进行入库相关操作
        if($result && $result['code'] == 0){
            $param['_id'] = I('_id');
            $param['name'] = I('siteName');
            $param['warnContacts'] = $users;
            //"_id" : NumberLong(1), "uid" : NumberLong(1), "domain" : "test.websaas.cn", "relation_type" : NumberLong(1)
            // 添加关注人信息
            // 先删除该域名的所有关注人,保留添加人信息，此处需要过滤掉所有超级管理员，暂未过滤
            $umd->where(array(domain=>I('oldDomain')))->delete();

            $oneUser['_id'] = $uid.I('domains');
            $oneUser['uid'] = $uid;
            $oneUser['domain'] = I('domains');
            //$oneUser['name'] = I('siteName');
            $oneUser['domain'] = I('domains');
            //$oneUser['ip'] = I('ip');
            $oneUser['relation_type'] = 1;
            $umd->save($oneUser, array(upsert=>true));

            foreach($users as $uk=>$uv){
                //避免添加自己为关注人，出现该站点不能删除的情况
                if($uid != $userNameId[$uv['telephone']]) {
                    $oneUser['_id'] = $userNameId[$uv['telephone']] . I('domains');
                    $oneUser['uid'] = $userNameId[$uv['telephone']];
                    //$oneUser['name'] = I('siteName');
                    $oneUser['domain'] = I('domains');
                    //$oneUser['ip'] = I('ip');
                    $oneUser['relation_type'] = 2;
                    $umd->save($oneUser, array(upsert => true));
                }
            }
            $aliyun = new AliYun();
            $config = array();
            if (!C('WAF_DEBUG')) {
                if(I('old_is_ddos') == 1){//如果之前就添加了DDoS防护，先把之前的删除
                    $config['InstanceId'] = I('oldInstanceId');//高防实例ID
                    $config['Domain'] = I('oldDomain');//域名
                    $result = $aliyun->DeleteDomain($config);
                    if($result && count($result) == 1){//表示成功
                        //表示成功
                    }
                }
                if(I('is_ddos') == 1){//添加DDoS防护
                    $config = array();
                    $config['InstanceId'] = I('InstanceId');//高防实例ID
                    $config['Domain'] = $domain;//域名
                    $config['Protocols'] = json_encode(array("http"));//协议，http、https，JSON数组格式
                    $config['SourceIps'] = json_encode(array(I('ip')));//源站IP列表，JSON数组格式
                    $config['WafEnable'] = 0;//是否开启waf 防护，0：否，1：是，默认是
                    $config['CcEnable'] = 0;//是否开启cc防护，0：否，1：是，默认是

                    $result = $aliyun->CreateDomain($config);
                    if($result && count($result) == 1){//表示成功
                        //表示成功
                    }
                }
            }


            $param['contract_id'] = I('contract_id');
            $param['client_id'] = I('client_id');
            $param['domain'] = $domain;
            $param['is_waf_warning'] = I('is_waf_warning');
            $param['is_http'] = I('is_http');
            $param['cert_public'] = I('cert_public');
            $param['cert_private'] = I('cert_private');
            $param['cert_ca_link'] = I('cert_ca_link');
            $param['is_ddos'] = I('is_ddos');
            $param['InstanceId'] = I('InstanceId');
            $param['is_loophole_scan'] = I('is_loophole_scan');
            $param['loophole_warning'] = I('loophole_warning');
            $param['is_available'] = I('is_available');
            $param['available_warning'] = I('available_warning');

            $param['userId'] = $uid;
            $param['modify_time'] = date("Y-m-d H:i:s");
            $md->save($param, array(upsert=>true));
        } else {//此处改为云waf对应错误信息
            //var_dump($result);
            //dump(array(msg=>WafConsole::$ERROR_MAPPER[$result['code']], code=>0));
            //$this->ajaxReturn(array(msg=>WafConsole::$ERROR_MAPPER[$result['code']], code=>0));
            if($result &&  $result['code']){
                $this->ajaxReturn(array(msg=>WafConsole::$ERROR_MAPPER[$result['code']], code=>0));
            } else {
                $this->ajaxReturn(array(msg=>"云waf接口异常", code=>0));
            }
        }


        $this->ajaxReturn(array(msg=>'操作成功', code=>1));
    }

    /** 进入修改站点页面 */
    public function updateSitePage(){
        $this->listUser();
        if(I('contract_id')){
            $this->assign("contract_id",I('contract_id'));
        }
        if(I('client_id')){
            $this->assign("client_id",I('client_id'));
        }
        $currentSite = $this->getCurrentUpdateSite();
        $this->assign("currentSite", urlencode(json_encode($currentSite)));
        $this->display('updateSite');
    }

    /** 获取所有用户id对应用户名称的数组，供通过id获取用户名称使用 */
    public function getUsersIdByName($users){

        if(!$users){
            return array();
        }
        $usernames = array();
        foreach($users as $k=>$v){
            $usernames[] = $v['telephone'];
        }
        $where = array();
        $where["username"] = array("in",$usernames);
        $md=new AutoIncrementModel(Constants::$DB_AUTH_USER);
        $rows = $md->field('_id,username')->where($where)->select();
        $result = array();
        foreach($rows as $k=>$v){
            $result[$v['username']] = $v['_id'];
        }
        return $result;
    }


    /**
     * 文件上传
     * 获取上传文档
     */
    public function upload(){
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        $rows = array();
        //$fileName = $_FILES['file_data']['name'];
        $content =file_get_contents($_FILES['file_data']['tmp_name']);
        $array = explode("\n", $content);
//        var_dump($array);
        for($i=0; $i < count($array); $i++){
            $rows[] = $array[$i];
        }
        $result['code'] = 1;
        $result['rows'] = $rows;
        $this->ajaxReturn($result);
    }

    /** 判断站点是否存在，前端调用接口 */
    public function hadExist(){
        $domain = I('domain');
        if($this->isExistByDomain($domain)){
            $this->ajaxReturn(array(code=>1,msg=>'站点已存在'));
        } else {
            $this->ajaxReturn(array(code=>0,msg=>'站点不存在'));
        }
    }

    /** 通过域名来判断站点是否存在，公共方法 */
    private function isExistByDomain($domain){
        $md = new StringModel(Constants::$DB_ASSET_NEW);
        $row = $md->where(array(domain=>$domain))->find();
        if($row){
            return true;
        } else {
            return false;
        }
    }

    /** 新增用户 */
    public function addUser(){
        if($this->userHadExist()){
            $this->ajaxReturn(array(code=>0,msg=>'用户已存在'));
        } else {
            Hook::listen('action_begin',I());
            $param=array(username=>I('telephone'),name=>I('username'),
                roles=>array(4),phone=>I('telephone'),remark=>'添加站点时附加',
                password=>md5("dbapp@123"), warnType=>I('warnType'),
                beginTime=>I('beginTime'), endTime=>I('endTime'));
            $md=new AutoIncrementModel(Constants::$DB_AUTH_USER);
            $param["_id"]=$md->getMongoNextId();
            $md->save($param,array(upsert=>true));
            $this->ajaxReturn(array(code=>1,msg=>'新增成功'));
        }

    }

    /** 判断用户是否存在，前端调用接口 */
    private function userHadExist(){
        //合同用户  _id = 4  /roles = array(4)
        $username = I('telephone');
        $md = new AutoIncrementModel(Constants::$DB_AUTH_USER);
        $exist = $md->where(array(username=>$username))->find();
        if($exist){
            return true;
        } else {
            return false;
        }
    }


    /**
     * 导入站点信息，返回站点数组
     */
    public function importExcel(){
        $path = $_FILES['file_data']['tmp_name'];
        $excelUtil = new ExcelUtil();
        $data = $excelUtil->readFile($path,C('IMPORT_MAX_COUNT'));
        $items = array();
        $hadExistDomains = "";
        $errorDomains = "";
        $msg = "";
        //此处需要验证每一个域名是否已经存在
        if($data['code'] == 1){
            $rows = $data['items'];
            foreach($rows as $k=>$v){
                $domain =  $v['B'];

                $flag = true;
                if($this->isExistByDomain($domain)){
                    $hadExistDomains .= $domain."\n";
                    $flag = false;
                }
                if(strpos($domain, "*")){
                    $errorDomains .= $domain."中包含*号"."\n";
                    $flag = false;
                }
                if(strlen($domain) > 64){
                    $errorDomains .= $domain."过长"."\n";
                    $flag = false;
                }
                if($flag){
                    $items[] = $v;
                }
            }
            $msg = $hadExistDomains.$errorDomains;
            if($msg != ''){
                $data['code'] = 2;
                $data['msg'] = $msg;
                $data['items'] = $items;
                $data['count'] = count($items);
            }

        }
        $this->ajaxReturn($data);
    }


    /**  进入列表 */
    public function index(){

        $uid = current_user_id();
        $this->assign("useId", $uid);
        $addAction = check_action("home/wafsite/add");
        //$deleteAction = check_action("home/wafsite/delete");

        $this->assign("addAction", $addAction);
        $user=session("user");
        //dump($user);
        $this->assign("isSystemRole", $user['isSystemRole']);
        //$this->showCount();
        $this->display("sites");
    }

    /** 获取站点总数、防护中站点数、无法访问站点数、高危漏洞站点数和受攻击站点数 */
    public function getAllKindsOfCount(){
        $result = array();
        //获取所有站点的漏洞等级信息
        $siteVuls = $this->getSiteVulsMsg();
        $attackCount = $this->attackCount();
        $siteVail = $this->getSiteVail();
        $uid = current_user_id();
        $md = new AutoIncrementModel(Constants::$DB_USER_2_ASSET_NEW);
        $condition = array();

        //如果是系统管理员角色
        $user=session("user");
        //如果是系统管理员角色,先查询出自己的，然后在查询出系统管理角色非自己添加的所有其他的，并将relation_type置为2
        $condition['uid'] = $uid;
        $rows = $md->field('domain,relation_type')->where($condition)->select();
        $domains=array();
        $domain_relation=array();
        foreach($rows as $k=>$row){
            $domains[]=$row['domain'];
            $domain_relation[$row['domain']]=$row['relation_type'];
        }
        if($user['isSystemRole']){
            $condition['relation_type'] = 1;
            $condition['uid'] = array('ne',$uid) ;
            $rows2=$md->field('domain,relation_type')->where($condition)->select();
            foreach($rows2 as $k=>$row){
                //已经存在的过滤掉
                if(!in_array($row['domain'],$domains)){
                    $domains[]=$row['domain'];
                    $domain_relation[$row['domain']] = 2;
                }
            }
        }

        $md=new StringModel(Constants::$DB_ASSET_NEW);
        $where["domain"]=array("in",$domains);
        $total = $md->where($where)->count();
        $rows=$md->field("domain,zone_rule.rule_engine")->where($where)->select();
        $saveCount = 0;
        $highVulsCount = 0;
        $midVulsCount = 0;
        $_attackCount = 0;
        $noAccessCount = 0;


        $saveSites = array();
        $highVulsSites = array();
        $midVulsSites = array();
        $_attackSites = array();
        $noAccessSites = array();
        foreach($rows as $k=>$row){
            if($siteVuls[$row["domain"]] && $siteVuls[$row["domain"]] == "高危"){
                $highVulsCount += 1;
                $highVulsSites[] = $row["domain"];
            }

            if($siteVuls[$row["domain"]] && $siteVuls[$row["domain"]] == "中危"){
                $midVulsCount += 1;
                $midVulsSites[] = $row["domain"];
            }

            if($row["zone_rule"] && $row["zone_rule"]['rule_engine'] == 'on'){
                $saveCount += 1;
                $saveSites[] = $row["domain"];
            }

            if($attackCount[$row["domain"]]){
                $_attackCount += 1;
                $_attackSites[] = $row["domain"];
            }

            if($siteVail[$row["domain"]] && $siteVail[$row["domain"]] == "无法访问"){
                $noAccessCount += $siteVail[$row["domain"]] && $siteVail[$row["domain"]] == "无法访问" ? 1 : 0;
                $noAccessSites[] = $row["domain"];
            }
            //$highVulsCount += $siteVuls[$row["domain"]] && $siteVuls[$row["domain"]] == "高危" ? 1 : 0;
            //$midVulsCount += $siteVuls[$row["domain"]] && $siteVuls[$row["domain"]] == "中危" ? 1 : 0;
            //$saveCount += $row["zone_rule"] && $row["zone_rule"]['rule_engine'] == 'on' ? 1 : 0;
            //$_attackCount += $attackCount[$row["domain"]] ? 1 : 0;
            //$noAccessCount += $siteVail[$row["domain"]] && $siteVail[$row["domain"]] == "无法访问" ? 1 : 0;
        }
        $result["allCount"] = $total;
        $result["saveCount"] = $saveCount;
        $result["noAccessCount"] = $noAccessCount;
        $result["highVulsCount"] = $highVulsCount;
        $result["midVulsCount"] = $midVulsCount;
        $result["attackCount"] = $_attackCount;

        $result["saveSites"] = implode(',',$saveSites);
        $result["noAccessSites"] = implode(',',$noAccessSites);
        $result["highVulsSites"] = implode(',',$highVulsSites);
        $result["midVulsSites"] = implode(',',$midVulsSites);
        $result["attackSites"] = implode(',',$_attackSites);

        $this->ajaxReturn($result);
    }


    /** 修改关注人 */
    public function updateAttentions(){
        $domain=I("domain");
        if(!$domain){
            $this->ajaxReturn(array(code=>0,msg=>"参数错误"));
        }
        $uid=current_user_id();
        $md=new AutoIncrementModel(Constants::$DB_USER_2_ASSET);
        $row=$md->where(array(domain=>$domain,relation_type=>1))->find();

        $user=session("user");
        if(!$user['isSystemRole']){//如果不是系统管理员角色，若不为自己的添加的站点，不允许添加关注人
            if(!$row||$row['uid']!=$uid){//如不是网站所有者
                $this->ajaxReturn(array(code=>0,msg=>"对不起，您不是该网站的所有者,不能添加关注人"));
            }
        }

        $owner=0;
        if($row){
            $owner=$row['uid'];
        }



        $md->where(array(domain=>$domain,relation_type=>2))->delete();
        //先移除所有add_by 当前用户的 列表
        $attentions=I("attentions");
        if(!$attentions){//管理员必须添加上
            $attentions='1';
        }
        $success=array();
        $fail=array();

        $md=new AutoIncrementModel(Constants::$DB_USER_2_ASSET);
        $attentions=explode(",",$attentions);
        $attentions[]=1;//把admin添加为关注人
        foreach($attentions as $at){
            $addId=intval($at);
            $tmp=$md->where(array(uid=>$addId,domain=>$domain))->find();
            if(!$tmp){
                if($owner!=$addId){
                    $md->data(array(uid=>$addId,domain=>$domain,relation_type=>2))->add();
                }
                $success[]=$addId;
            }else{
                $fail[]=$addId;
            }
        }

        $this->ajaxReturn(array(code=>1,success=>$success,fail=>$fail));
    }


    /** 获取关注人 */
    public function listAttentions(){
        $domain=I("domain");
        if(!$domain){
            $this->ajaxReturn(array(code=>0,msg=>"参数错误"));
        }
        $md=new AutoIncrementModel(Constants::$DB_USER_2_ASSET);
        $rows=$md->field("uid")->where(array(domain=>$domain,relation_type=>2))->select();
        $this->ajaxReturn(array_values($rows));
    }


    /** 获取站点漏洞信息 返回站点为key漏洞等级为value的数组 */
    private function getSiteVulsMsg(){
        $data=http_post(C(Constants::$PATH_API)."/api/cloudwaf/siteVuls/getSiteVulsMsg",null,'json');
        $result = array();
        //return $data['items'];
        foreach($data['items'] as $k=>$value){
            $result[$value['_id']] = $value['vulsLevel'];
        }
        return $result;
    }

    /** 获取站点标题信息 返回站点为key漏洞等级为value的数组 */
    private function getSiteTitleMsg(){
        $data=http_post(C(Constants::$PATH_API)."/api/cloudwaf/siteVuls/getSiteVulsMsg",null,'json');
        $result = array();
        //return $data['items'];
        foreach($data['items'] as $k=>$value){
            $result[$value['_id']] = $value['title'];
        }
        return $result;
    }

    /** 获取站点当日流量 返回站点为key站点，流量大小为value的数组 */
    private function getFlowOut(){
        $param = array("keys"=>"all");
        $json=http_post(C(Constants::$PATH_API)."/api/cloudwaf/domainflowout/list",$param,'json');
        $all=array();
        foreach($json['data']['all'] as $k=>$v){
            $all[$k]=$v;
        }
        return $all;
    }

    /** 站点访问量 返回站点为key站点，访问次数为value的数组 */
    private function visitCount(){
        $param = array("keys"=>"all");
        $json=http_post(C(Constants::$PATH_API)."/api/cloudwaf/domainvisit/list",$param,'json');
        $lasest=array();
        $all=array();
        foreach($json['data']['all'] as $k=>$v){
            $all[$k]=$v;
        }
        return $all;
    }
    /** 站点攻击量 返回站点为key站点，攻击次数为value的数组 */
    private function attackCount(){
        $param = array("keys"=>"all");
        $json=http_post(C(Constants::$PATH_API)."/api/cloudwaf/domainattack/list",$param,'json');
        $lasest=array();
        $all=array();
        foreach($json['data']['all'] as $k=>$v){
            $all[$k]=$v;
        }
        return $all;

    }

    /** 获取服务质量 */
    private function getSiteVail(){
        $data=http_post(C(Constants::$PATH_WARNAPP)."/api/cloudwaf/allsite/state",null,'json');
        $arr = array();
        foreach($data['data'] as $k=>$v){
            $arr[$k] = $v ? "访问正常" : "无法访问";
        }
        return $arr;
    }

    /** 关停站点 */
    public function switchSite(){
        $domain = I("domain");
        $dos = I("dos");

        if(!$domain){
            $this->ajaxReturn(array(code=>0,msg=>"参数错误"));
        }
        Hook::listen('action_begin',I());
        $md = new StringModel(Constants::$DB_ASSET_NEW);
        $asset = $md->where(array(domain=>$domain))->find();
        if(!$asset){
            $this->ajaxReturn(array(code=>0,msg=>"不存在的记录"));
        }
        //对云waf操作,此处需要添加云waf关停站点
        if(!C('WAF_DEBUG')){
            $console=new WafConsole();
            $config = array();
            $config['id'] = $asset['id'];
            $config['dos'] = intval($dos);
            $ret=$console->_edit($config);
            $code = $ret['code'];
            if($code != 0){//接口调用失败了
                $this->ajaxReturn(array(code=>0,msg=>WafConsole::$ERROR_MAPPER[$code]));
            } else {
                //修改数据库中的dos
                $asset['dos'] = $dos;
                $md->save($asset,array(upsert=>true));
                $this->ajaxReturn(array(code=>1,msg=>"修改成功"));
            }
        }

    }

    /** 批量删除 */
    public function batchDelete(){
        $domains=I("domains");
        if(!$domains){
            $this->ajaxReturn(array(code=>0,msg=>"参数错误"));
        }
        //Hook::listen('action_begin',I());
        $domains = explode(",",$domains);
        $uid=current_user_id();
        $md=new AutoIncrementModel(Constants::$DB_USER_2_ASSET_NEW);
        $where["domain"]=array("in",$domains);
        $rows=$md->where(array(uid=>$uid,domain=>array("in",$domains)))->select();
        $msg = "";
        $resultDomains = "";
        $console = new WafConsole();
//        foreach($rows as $k=>$row) {
//            dump($row);
//        }

        $aliyun = new AliYun();
        $deleteConfig = array();
        foreach($rows as $k=>$row) {
            $_id = $row['_id'];
            $domain = $row['domain'];
            if ($row['relation_type'] == 1) {//如果是添加者
                $md = new StringModel(Constants::$DB_ASSET_NEW);
                $asset = $md->where(array(domain => $domain))->find();
                //删除云waf记录
                if (!C('WAF_DEBUG')) {
                    $ret = $console->_deleteOrEdit($asset['id'], $domain);
                    if ($ret['code'] == 0) {//接口调用失败了
                        $this->ajaxReturn(array(code => 0, msg =>WafConsole::$ERROR_MAPPER[$ret['code']]));
                    }
                }

                //删除asset记录
                $md->where(array(_id => $asset['_id']))->delete();
                $md = new AutoIncrementModel(Constants::$DB_USER_2_ASSET_NEW);
                //删除所有的相关的user_2_domain的映射
                $md->where(array(domain =>$domain))->delete();
                //是否需要删除高防ip
                if($asset['is_ddos'] == "1" && $asset['InstanceId']){
                    $deleteConfig['InstanceId'] = $asset['InstanceId'];//高防实例ID
                    $deleteConfig['Domain'] = $domain;//域名
                    $aliyun->DeleteDomain($deleteConfig);
                }
            } else {//如果是关注人
                if (is_manager()) {
                    $resultDomains .= $domain.",";
                    //$msg .= "您是超级管理员,不能取消对网站的关注:";
                    //$this->ajaxReturn(array(code => 0, msg => "您是超级管理员,不能取消对网站的关注!"));
                }
                $md = new AutoIncrementModel(Constants::$DB_USER_2_ASSET_NEW);
                $md->where(array(_id => $_id))->delete();
                $row = $md->where(array(domain => $domain))->find();
                if (!$row) {//如果本域中已经没有该网站映射了，说明是别的域的用户创建的，本域中的这条资产记录可以清掉了
                    $md = new StringModel(Constants::$DB_ASSET_NEW);
                    $md->where(array(_id => $domain))->delete();
                }
                // $this->ajaxReturn(array(code => 1, msg => "取消关注成功"));
            }
        }
        if($resultDomains != ""){
            $resultDomains = substr($resultDomains, 0, -1);
            $msg = "您是超级管理员,不能取消对网站的关注:".$resultDomains;
        } else {
            $msg = "删除成功";
        }
        $this->ajaxReturn(array(code => 1, msg => $msg));

    }

    // 单个删除
    public function delete(){
        $domain=I("domain");
        if(!$domain){
            $this->ajaxReturn(array(code=>0,msg=>"参数错误"));
        }
        //Hook::listen('action_begin',I());
        $uid=current_user_id();
        $md=new AutoIncrementModel(Constants::$DB_USER_2_ASSET_NEW);
        $row=$md->where(array(uid=>$uid,domain=>$domain))->find();
        if($row['relation_type']==1){//如果是添加者
            $md=new StringModel(Constants::$DB_ASSET_NEW);
            $asset=$md->where(array(domain=>$domain))->find();
            if(!$asset){
                $this->ajaxReturn(array(code=>0,msg=>"不存在的记录"));
            }
            //删除云waf记录
            if(!C('WAF_DEBUG')){
                $console=new WafConsole();
                $ret=$console->_deleteOrEdit($asset['id'],$domain);
                if($ret['code'] == 0 ){//接口调用失败了
                    $this->ajaxReturn(array(code=>0,msg=>WafConsole::$ERROR_MAPPER[$ret['code']]));
                }
            }

            //删除asset记录
            $md->where(array(_id=>$asset['_id']))->delete();
            //是否需要删除高防ip
            if($asset['is_ddos'] == "1" && $asset['InstanceId']){
                $aliyun = new AliYun();
                $deleteConfig = array();
                $deleteConfig['InstanceId'] = $asset['InstanceId'];//高防实例ID
                $deleteConfig['Domain'] = $domain;//域名
                $aliyun->DeleteDomain($deleteConfig);
            }
            $md=new AutoIncrementModel(Constants::$DB_USER_2_ASSET_NEW);
            //删除所有的相关的user_2_domain的映射
            $md->where(array(domain=>$domain))->delete();
            $this->ajaxReturn(array(code=>1,msg=>"删除成功"));
        }else{//如果是关注人
            if(is_manager()){
                $this->ajaxReturn(array(code=>0,msg=>"您是超级管理员,不能取消对网站的关注!"));
            }
            $md=new AutoIncrementModel(Constants::$DB_USER_2_ASSET_NEW);
            $md->where(array(domain=>$domain,uid=>$uid))->delete();
            $row=$md->where(array(domain=>$domain))->find();
            if(!$row){//如果本域中已经没有该网站映射了，说明是别的域的用户创建的，本域中的这条资产记录可以清掉了
                $md=new StringModel(Constants::$DB_ASSET_NEW);
                $md->where(array(domain=>$domain))->delete();
            }
            $this->ajaxReturn(array(code=>1,msg=>"取消关注成功"));
        }


    }


    //分页方式后去站点
    public function pageSite(){

        $siteIpOrNameOrDomain = I('name');

        //获取所有站点的漏洞等级信息
        $siteVuls    = $this->getSiteVulsMsg();
        $siteFlow    = $this->getFlowOut();
        $visitCount  = $this->visitCount();
        $attackCount = $this->attackCount();
        $siteVail    = $this->getSiteVail();
        $uid=current_user_id();
        $md=new AutoIncrementModel(Constants::$DB_USER_2_ASSET_NEW);
        $condition = array();
        if(I("param")){
            $condition['domain']=array("like",I("param"));
        }
        $conditionDomains = I('domains');
        if($conditionDomains){
            $condition["domain"] = array("in",explode(",",$conditionDomains));
        }
        $user=session("user");
        //如果是系统管理员角色,先查询出自己的，然后在查询出系统管理角色非自己添加的所有其他的，并将relation_type置为2
        $condition['uid'] = intval($uid);
        $rows = $md->field('domain,relation_type')->where($condition)->select();
        $domains=array();
        $domain_relation=array();
        foreach($rows as $k=>$row){
            $domains[]=$row['domain'];
            $domain_relation[$row['domain']]=$row['relation_type'];
        }
        if($user['isSystemRole']){
            $condition['relation_type'] = 1;
            $condition['uid'] = array('ne',$uid) ;
            $rows2=$md->field('domain,relation_type')->where($condition)->select();
            foreach($rows2 as $k=>$row){
                //已经存在的过滤掉
                if(!in_array($row['domain'],$domains)){
                    $domains[]=$row['domain'];
                    $domain_relation[$row['domain']] = 2;
                }
            }
        }


        $md=new StringModel(Constants::$DB_ASSET_NEW);
        $where["domain"]=array("in",$domains);
        //如果是通过合同id来查询
        if(I('contract_id')){
            //dump(I('contract_id'));
            $where["contract_id"] = I('contract_id');
        }
        //根据ip、标题或者域名查询
        if($siteIpOrNameOrDomain){
            $where['ip|name|domain']=array("like",$siteIpOrNameOrDomain);
        }
        if(I('protect_mode')){
            $where['zone_rule.rule_engine'] = I('protect_mode');
        }
        $total = $md->where($where)->count();
        $rows=$md->field("_id,name,domain,ip,port,isShuttingDown,zone_rule.rule_engine,dos,contract_id,client_id")->where($where)->limit(I('start'),I('length'))->select();
        $ret=array();
        foreach($rows as $k=>$row){
            $rows[$k]['relation_type'] = $domain_relation[$row["domain"]];
            $rows[$k]['vulsLevel'] = $siteVuls[$row["domain"]] ? $siteVuls[$row["domain"]] : "安全";
            $rows[$k]['bypass'] = $row["config"] && $row["config"]['bypass'] == 0 ? $row["config"]['bypass'] : 1;
            $rows[$k]['flow'] = $siteFlow[$row["domain"]] ? $siteFlow[$row["domain"]] : 0;
            $rows[$k]['visitCount'] = $visitCount[$row["domain"]] ? $visitCount[$row["domain"]] : 0;
            $rows[$k]['attackCount'] = $attackCount[$row["domain"]] ? $attackCount[$row["domain"]] : 0;
            $rows[$k]['siteVail'] = $siteVail[$row["domain"]] ? $siteVail[$row["domain"]] : "访问正常";
        }
        $ret['recordsTotal']=$total;
        $ret['recordsFiltered'] = $total;
        $ret['items'] = array_values($rows);
        $this->ajaxReturn($ret);
    }



}