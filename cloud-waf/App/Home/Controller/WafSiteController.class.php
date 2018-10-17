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

class WafSiteController extends BaseController {


    /**  进入列表 */
    public function index(){

        $uid = current_user_id();
        $this->assign("useId", $uid);
        $addAction = check_action("home/wafsite/add");
        //$deleteAction = check_action("home/wafsite/delete");
        $this->assign("addAction", $addAction);
        $user=session("user");
        $this->assign("isSystemRole", $user['isSystemRole']);
        //$this->showCount();
        $this->display("./page/waf_index");
    }

    /** 获取站点总数、防护中站点数、无法访问站点数、高危漏洞站点数和受攻击站点数 */
    public function getAllKindsOfCount(){
        $result = array();
        //获取所有站点的漏洞等级信息
        $siteVuls = $this->getSiteVulsMsg();
        $attackCount = $this->attackCount();
        $siteVail = $this->getSiteVail();
        $uid = current_user_id();
        $md = new AutoIncrementModel(Constants::$DB_USER_2_ASSET);
        $condition = array();

        $user=session("user");
        //如果是系统管理员角色
        if($user['isSystemRole']){
            //$condition['relation_type'] = 1;
            //$rows=$md->field('domain,relation_type')->where($condition)->select();
            $rows=$md->field('domain,relation_type')->select();
        } else {
            $condition['uid'] = $uid;
            $rows=$md->field('domain,relation_type')->where($condition)->select();
        }

        $domains=array();
        $tempDomains = array();
        foreach($rows as $k=>$row){
            $tempDomains[$row['domain']] = $row['domain'];
        }
        $domains = array_keys($tempDomains);
        $md=new StringModel(Constants::$DB_ASSET);
        $where["_id"]=array("in",$domains);
        $total = $md->where($where)->count();
        $rows=$md->field("_id,config.bypass")->where($where)->select();
        $saveCount = 0;
        $highVulsCount = 0;
        $_attackCount = 0;
        $noAccessCount = 0;
        foreach($rows as $k=>$row){
            $highVulsCount += $siteVuls[$row["_id"]] && $siteVuls[$row["_id"]] == "高危" ? 1 : 0;
            $saveCount += $row["config"] && $row["config"]['bypass'] == 0 ? 1 : 0;
            $_attackCount += $attackCount[$row["_id"]] ? 1 : 0;
            $noAccessCount += $siteVail[$row["_id"]] && $siteVail[$row["_id"]] == "无法访问" ? 1 : 0;
        }
        $result["allCount"] = $total;
        $result["saveCount"] = $saveCount;
        $result["noAccessCount"] = $noAccessCount;
        $result["highVulsCount"] = $highVulsCount;
        $result["attackCount"] = $_attackCount;
        $this->ajaxReturn($result);
    }

    /** 添加站点 */
    public function add(){
        $domain=I("domain");
        $ip=I("ip");
        $port=I("port");
        $title=I("title");
        if(!$domain||!$ip||!$port||!$title){
            $this->ajaxReturn(array(code=>0,msg=>"参数错误"));
        }
        // 测试时将bypass设置为1，正式环境设置为0
        $config=array(domain=>$domain, ip=>$ip, port=>$port, rule=>1, bypass=>0 );
        $console=new WafConsole();

        if(C("WAF_DEBUG")){
            $data = array(domain=>array($domain), ip=>$ip, port=>$port, rule=>1, bypass=>1);
            $result = array(code=>1,data=>$data);
        } else {
            $result=$console->_createOrEdit($config);
        }

        // 如果code=1 表示添加成功
        // 如果code=2 表示通过修改的方式添加成功
        // 如果code=3表示已经在保护中了，只能成为其关注人
        // 如果code=0表示操作失败
        $code=$result['code'];
        if($code==0){//失败
            $this->ajaxReturn(array(code=>0,msg=>$result['data']));
        }
        //添加或更新asset表
        $data=$result['data'];
        $array_keys=array_keys($data);
        $asset=array(_id=>$domain, ip=>$ip, port=>$port, title=>$title, waf_id=>$array_keys[0],config=>$data[$array_keys[0]]);
        $md=new StringModel(Constants::$DB_ASSET);
        $md->save($asset,array(upsert=>true));
        $user_2_domain=array(uid=>current_user_id(),domain=>$domain);
        $ret_msg="添加成功";
        if($code==1||$code==2){//成功
            $user_2_domain['relation_type']=1;
            if($code==2){//当以修改的方式添加时，修改已存在ip和port对应的记录的config
                $this->updateSiteByIpAndPort($ip,$port,$data[$array_keys[0]]);
            }
        }else{
            $user_2_domain['relation_type']=2;
            $ret_msg="该网站已在保护列表中,您将以关注人的身份对该网站进行关注!";
        }
        $md=new AutoIncrementModel(Constants::$DB_USER_2_ASSET);


        $row=$md->where(array(uid=>current_user_id(),domain=>$domain))->find();
        if(!$row){
            $md->data($user_2_domain)->add();
            $asset['relation_type']= $user_2_domain['relation_type'];
            if(!is_manager()){
                //添加一条manager关注人
                $row=$md->where(array(domain=>$domain,uid=>1))->find();
                if(!$row){
                    $md->data(array(uid=>1,domain=>$domain,relation_type=>2))->add();
                }
            }
            $this->ajaxReturn(array(code=>1,msg=>$ret_msg,item=>$asset));
        }else{
            $this->ajaxReturn(array(code=>0,msg=>"添加失败,请不要重复添加"));
        }

    }

    /** 修改数据库中ip和port的Config信息 */
    public function updateSiteByIpAndPort($ip,$port,$config){
        $asset=array(ip=>$config['ip'],port=>$config['port']);
        $md=new StringModel(Constants::$DB_ASSET);
        $rows = $md->where($asset)->select();
        if($rows && count($rows) > 0){
            foreach ($rows as $row){
                $row['config'] = $config;
                $md->save($row,array(upsert=>true));
            }
        }
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

    /**  */
    public function updateRelationSites(){

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
    public function getSiteVulsMsg(){
        $data=http_post(C(Constants::$PATH_API)."/api/cloudwaf/siteVuls/getSiteVulsMsg",null,'json');
        $result = array();
        //return $data['items'];
        foreach($data['items'] as $k=>$value){
            $result[$value['_id']] = $value['vulsLevel'];
        }
        return $result;
    }

    /** 获取站点标题信息 返回站点为key漏洞等级为value的数组 */
    public function getSiteTitleMsg(){
        $data=http_post(C(Constants::$PATH_API)."/api/cloudwaf/siteVuls/getSiteVulsMsg",null,'json');
        $result = array();
        //return $data['items'];
        foreach($data['items'] as $k=>$value){
            $result[$value['_id']] = $value['title'];
        }
        return $result;
    }

    /** 获取站点当日流量 返回站点为key站点，流量大小为value的数组 */
    public function getFlowOut(){
        $param = array("keys"=>"all");
        $json=http_post(C(Constants::$PATH_API)."/api/cloudwaf/domainflowout/list",$param,'json');
        $all=array();
        foreach($json['data']['all'] as $k=>$v){
            $all[$k]=$v;
        }
        return $all;
    }

    /** 站点访问量 返回站点为key站点，访问次数为value的数组 */
    public function visitCount(){
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
    public function attackCount(){
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
    public function getSiteVail(){
        $data=http_post(C(Constants::$PATH_WARNAPP)."/api/cloudwaf/allsite/state",null,'json');
        $arr = array();
        foreach($data['data'] as $k=>$v){
            $arr[$k] = $v ? "访问正常" : "无法访问";
        }
        return $arr;
    }

    /** 切换站点云waf防护状态 I("bypass") == 0 防护， I("bypass") == 1 不防护 */
    public function byPassSite(){
        $domain = I("domain");
        $bypass = I("bypass");

        if(!$domain){
            $this->ajaxReturn(array(code=>0,msg=>"参数错误"));
        }
        $md = new StringModel(Constants::$DB_ASSET);
        $asset = $md->where(array(_id=>$domain))->find();
        if(!$asset){
            $this->ajaxReturn(array(code=>0,msg=>"不存在的记录"));
        }
        //对云waf操作
        if(!C('WAF_DEBUG')){
            $console=new WafConsole();
//            if($bypass == 1){
//                //删除云waf记录, 不能直接删除记录，因为可能不止一个域名
////                $ret=$console->_deleteOrEdit($asset['waf_id'],$domain);
////                if($ret['code']==0){//接口调用失败了
////                    $this->ajaxReturn(array(code=>0,msg=>$ret['data']));
////                }
//            } else {
//                // 新增或者云waf记录
//                $config=array(domain=>$domain, ip=>$asset['ip'], port=>$asset['port'], rule=>1, bypass=>0 );
//                $console->_createOrEdit($config);
//            }
            $config=array(id=>$asset['waf_id'],domain=>$domain, ip=>$asset['ip'], port=>$asset['port'], rule=>1, bypass=>$bypass );
            $console->_edit($config);
        }
        //修改数据库中的bypass
        $asset['config']['bypass'] = $bypass;
        $md->save($asset,array(upsert=>true));
        $this->ajaxReturn(array(code=>1,msg=>"修改成功"));

    }

    /** 批量删除 */
    public function batchDelete(){
        $domains=I("domains");
        if(!$domains){
            $this->ajaxReturn(array(code=>0,msg=>"参数错误"));
        }
        $domains = explode(",",$domains);
        $uid=current_user_id();
        $md=new AutoIncrementModel(Constants::$DB_USER_2_ASSET);
        $where["_id"]=array("in",$domains);
        $rows=$md->where(array(uid=>$uid,domain=>array("in",$domains)))->select();
        $msg = "";
        $resultDomains = "";
        $console = new WafConsole();
        foreach($rows as $k=>$row) {
            $domain = $row['domain'];
            if ($row['relation_type'] == 1) {//如果是添加者
                $md = new StringModel(Constants::$DB_ASSET);
                $asset = $md->where(array(_id => $domain))->find();
                //删除云waf记录
                if (!C('WAF_DEBUG')) {
                    $ret = $console->_deleteOrEdit($asset['waf_id'], $domain);
                    if ($ret['code'] == 0) {//接口调用失败了
                        $this->ajaxReturn(array(code => 0, msg => $ret['data']));
                    }
                }

                //删除asset记录
                $md->where(array(_id => $domain))->delete();
                $md = new AutoIncrementModel(Constants::$DB_USER_2_ASSET);
                //删除所有的相关的user_2_domain的映射
                $md->where(array(domain => $domain))->delete();
            } else {//如果是关注人
                if (is_manager()) {
                    $resultDomains .= $domain.",";
                    //$msg .= "您是超级管理员,不能取消对网站的关注:";
                    //$this->ajaxReturn(array(code => 0, msg => "您是超级管理员,不能取消对网站的关注!"));
                }
                $md = new AutoIncrementModel(Constants::$DB_USER_2_ASSET);
                $md->where(array(domain => $domain, uid => $uid))->delete();
                $row = $md->where(array(domain => $domain))->find();
                if (!$row) {//如果本域中已经没有该网站映射了，说明是别的域的用户创建的，本域中的这条资产记录可以清掉了
                    $md = new StringModel(Constants::$DB_ASSET);
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
        $uid=current_user_id();
        $md=new AutoIncrementModel(Constants::$DB_USER_2_ASSET);
        $row=$md->where(array(uid=>$uid,domain=>$domain))->find();
        if($row['relation_type']==1){//如果是添加者
            $md=new StringModel(Constants::$DB_ASSET);
            $asset=$md->where(array(_id=>$domain))->find();
            if(!$asset){
                $this->ajaxReturn(array(code=>0,msg=>"不存在的记录"));
            }
            //删除云waf记录
            if(!C('WAF_DEBUG')){
                $console=new WafConsole();
                $ret=$console->_deleteOrEdit($asset['waf_id'],$domain);
                if($ret['code']==0){//接口调用失败了
                    $this->ajaxReturn(array(code=>0,msg=>$ret['data']));
                }
            }

            //删除asset记录
            $md->where(array(_id=>$domain))->delete();
            $md=new AutoIncrementModel(Constants::$DB_USER_2_ASSET);
            //删除所有的相关的user_2_domain的映射
            $md->where(array(domain=>$domain))->delete();
            $this->ajaxReturn(array(code=>1,msg=>"删除成功"));
        }else{//如果是关注人
            if(is_manager()){
                $this->ajaxReturn(array(code=>0,msg=>"您是超级管理员,不能取消对网站的关注!"));
            }
            $md=new AutoIncrementModel(Constants::$DB_USER_2_ASSET);
            $md->where(array(domain=>$domain,uid=>$uid))->delete();
            $row=$md->where(array(domain=>$domain))->find();
            if(!$row){//如果本域中已经没有该网站映射了，说明是别的域的用户创建的，本域中的这条资产记录可以清掉了
                $md=new StringModel(Constants::$DB_ASSET);
                $md->where(array(_id=>$domain))->delete();
            }
            $this->ajaxReturn(array(code=>1,msg=>"取消关注成功"));
        }


    }


    public function listAll(){
        $uid=current_user_id();
        $md=new AutoIncrementModel(Constants::$DB_USER_2_ASSET);
        $rows=$md->field('domain,relation_type')->where(array(uid=>$uid))->select();
        $domains=array();
        $domain_relation=array();
        foreach($rows as $k=>$row){
            $domains[]=$row['domain'];
            $domain_relation[$row['domain']]=$row['relation_type'];
        }

        $user=session("user");
        if($user['isSystemRole']){
            $condition['relation_type'] = 1;
            $condition['uid'] = array('ne',$uid) ;
            $rows2=$md->field('domain,relation_type')->where($condition)->select();
            foreach($rows2 as $k=>$row){
                $domains[]=$row['domain'];
                $domain_relation[$row['domain']] = 2;
            }
        }
        $md=new StringModel(Constants::$DB_ASSET);
        $where["_id"]=array("in",$domains);
        $rows=$md->field("_id,ip,port,waf_id")->where($where)->select();
        $ret=array();
        foreach($rows as $k=>$row){
            $row['relation_type']=$domain_relation[$row["_id"]];
            $ret[]=$row;
        }
        $this->ajaxReturn($ret);
    }

    //分页方式后去站点
    public function pageSite(){
        //获取所有站点的漏洞等级信息
        $siteVuls    = $this->getSiteVulsMsg();
        $siteTitle   = $this->getSiteTitleMsg();
        $siteFlow    = $this->getFlowOut();
        $visitCount  = $this->visitCount();
        $attackCount = $this->attackCount();
        $siteVail    = $this->getSiteVail();
        $uid=current_user_id();
        $md=new AutoIncrementModel(Constants::$DB_USER_2_ASSET);
        $condition = array();
        if(I("param")){
            $condition['domain']=array("like",I("param"));
        }
        $user=session("user");
        //如果是系统管理员角色,先查询出自己的，然后在查询出系统管理角色非自己添加的所有其他的，并将relation_type置为2
        $condition['uid'] = $uid;
        $rows=$md->field('domain,relation_type')->where($condition)->select();
        $domains=array();
        $domain_relation=array();
        foreach($rows as $k=>$row){
            $domains[]=$row['domain'];
            $domain_relation[$row['domain']]=$row['relation_type'];
        }
        if($user['isSystemRole']){
            //$condition['relation_type'] = 1;
            $condition['uid'] = array('ne',$uid) ;
            $rows2=$md->field('domain,relation_type')->where($condition)->select();
            foreach($rows2 as $k=>$row){
                $domains[]=$row['domain'];
                if(!$domain_relation[$row['domain']]){
                    $domain_relation[$row['domain']] = 2;
                }

            }
        }


        $md=new StringModel(Constants::$DB_ASSET);
        $where["_id"]=array("in",$domains);
        $total = $md->where($where)->count();
        $rows=$md->field("_id,ip,title,port,waf_id,config.bypass")->where($where)->select();
        //dump(count($domains));
        $ret=array();
        foreach($rows as $k=>$row){
            $rows[$k]['relation_type'] = $domain_relation[$row["_id"]];
            $rows[$k]['vulsLevel'] = $siteVuls[$row["_id"]] ? $siteVuls[$row["_id"]] : "安全";
            $rows[$k]['bypass'] = $row["config"] && $row["config"]['bypass'] == 0 ? $row["config"]['bypass'] : 1;
            $rows[$k]['flow'] = $siteFlow[$row["_id"]] ? $siteFlow[$row["_id"]] : 0;
            $rows[$k]['visitCount'] = $visitCount[$row["_id"]] ? $visitCount[$row["_id"]] : 0;
            $rows[$k]['attackCount'] = $attackCount[$row["_id"]] ? $attackCount[$row["_id"]] : 0;
            $rows[$k]['siteVail'] = $siteVail[$row["_id"]] ? $siteVail[$row["_id"]] : "访问正常";
            $rows[$k]['title'] = $rows[$k]['title'] == '' && $siteTitle[$row["_id"]] ? $siteTitle[$row["_id"]] : $rows[$k]['title'];
            //$ret[]=$row;
        }
        $ret['recordsTotal']=$total;
        $ret['recordsFiltered'] = $total;
        $ret['items'] = array_values($rows);
        $this->ajaxReturn($ret);
    }


    //获取站点总数、防护中站点数、无法访问站点数、高危漏洞站点数和受攻击站点数
    public function showCount(){
        //获取所有站点的漏洞等级信息
        $siteVuls = $this->getSiteVulsMsg();
        $attackCount = $this->attackCount();
        $siteVail = $this->getSiteVail();
        $uid = current_user_id();
        $md = new AutoIncrementModel(Constants::$DB_USER_2_ASSET);
        $condition = array();
        $condition['uid']=$uid;
        $rows=$md->field('domain')->where($condition)->select();
        $domains=array();
        foreach($rows as $k=>$row){
            $domains[]=$row['domain'];
        }
        $md=new StringModel(Constants::$DB_ASSET);
        $where["_id"]=array("in",$domains);
        $total = $md->where($where)->count();
        $rows=$md->field("_id,config.bypass")->where($where)->select();
        $saveCount = 0;
        $highVulsCount = 0;
        $_attackCount = 0;
        $noAccessCount = 0;
        foreach($rows as $k=>$row){
            $highVulsCount += $siteVuls[$row["_id"]] && $siteVuls[$row["_id"]] == "高危" ? 1 : 0;
            $saveCount += $row["config"] && $row["config"]['bypass'] == 0 ? 1 : 0;
            $_attackCount += $attackCount[$row["_id"]] ? 1 : 0;
            $noAccessCount += $siteVail[$row["_id"]] && $siteVail[$row["_id"]] == "无法访问" ? 1 : 0;
        }
        $this->assign("allCount", $total);
        $this->assign("saveCount", $saveCount);
        $this->assign("noAccessCount", $noAccessCount);
        $this->assign("highVulsCount", $highVulsCount);
        $this->assign("attackCount", $_attackCount);
    }


    public function getUserMsg(){
        $user=session("user");
        dump($user);
//        $md=new AutoIncrementModel(Constants::$DB_AUTH_ROLE);
//        $role_ids=$user['roles'];
//        $where=array();
//        $where["_id"]=array("in",$role_ids);
//        $roles=$md->where($where)->select();
    }

}