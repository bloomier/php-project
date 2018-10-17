<?php
namespace Admin\Controller;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;
use Think\Controller;
use Think\Db\Driver\Mongo;
use Think\Model\MongoModel;

class InitController extends Controller {

    public function init(){
        header("Content-type: text/html; charset=utf-8");
        echo "======初始化开始======<br>";
        $this->initUser();
        echo "修复用户完毕...<br>";
        $this->initAction();
        echo "修复权限列表完毕...<br>";


        $this->initLogRule();
        echo "校验日志记录规则完毕...<br>";

        echo "======初始化结束======<br>";


    }
    private function initUser(){
        $md=new AutoIncrementModel(Constants::$DB_AUTH_USER);
        $array=array(
            array(_id=>1,username=>'dbapp',password=>md5('1qazxsw23edc!@#'),name=>"超级管理员")
        );
        foreach($array as $u){
            $md->save($u,array(upsert=>true));
        }


    }

    public function initAction(){
        $md=new StringModel(Constants::$DB_AUTH_ACTION);
        $actions=array(
            array(
                _id=>1000,name=>"",title=>"系统管理",is_menu=>1,pid=>0,seq=>9000,status=>1
            ),
            array(
                _id=>1001,name=>"Admin/User/index",title=>"用户管理",is_menu=>1,pid=>1000,seq=>9001,status=>1,
                child_actions=>array(
                    array(name=>"Admin/User/addOrUpdate",title=>"添加/删除用户" ),
                    array(name=>"Admin/User/listAll",title=>"查询用户"),
                    array(name=>"Admin/User/delete",title=>"删除用户"),
                    array(name=>"Admin/Role/listAll",title=>"查询角色树"),
                    array(name=>"Admin/Role/listAll",title=>"查询角色树"),
                )
            ),
            array(
                _id=>1002,name=>"Admin/Role/index",title=>"角色管理",is_menu=>1,pid=>1000,seq=>9002,status=>1,
                child_actions=>array(
                    array(name=>"Admin/Role/addOrUpdate",title=>"添加/修改角色" ),
                    array(name=>"Admin/Role/listAll",title=>"查询角色"),
                    array(name=>"Admin/Role/delete",title=>"删除角色"),
                    array(name=>"Admin/Role/listActions",title=>"查询权限树"),
                    array(name=>"Admin/User/lockUser",title=>"用户解锁"),
                )
            ),
            array(
                _id=>1003,name=>"Admin/BlackIp/index",title=>"IP黑名单",is_menu=>1,pid=>1000,seq=>9003,status=>1,
                child_actions=>array(
                    array(name=>"Admin/BlackIp/listAll",title=>"查询IP黑名单" ),
                    array(name=>"Admin/BlackIp/delete",title=>"删除IP黑名单"),
                )
            ),
            array(
                _id=>1004,name=>"Home/LogSearch/index",title=>"日志查询",is_menu=>1,pid=>1000,seq=>9004,status=>1,
                child_actions=>array(
                    array(name=>"Home/LogSearch/search_result",title=>"查询日志列表" ),
                    array(name=>"Home/LogSearch/detail",title=>"日志详情页面"),
                    array(name=>"Home/LogSearch/search_one",title=>"查询一条日志记录"),
                )
            ),
            array(
                _id=>2000,name=>"",title=>"基础数据",is_menu=>1,pid=>0,seq=>2000,status=>1
            ),
            array(
                _id=>2001,name=>"Home/WafSite/index",title=>"站点列表",is_menu=>1,pid=>2000,seq=>2001,status=>1,
                child_actions=>array(
                    array(name=>"Home/WafSite/delete",title=>"删除站点" ),
                    array(name=>"Home/WafSite/listAttentions",title=>"查询关注人"),
                    array(name=>"Home/WafSite/updateAttentions",title=>"添加/修改关注人" ),
                    array(name=>"Home/WafSite/pageSite", title=>"站点查询" ),
                    array(name=>"Home/WafSite/listAll", title=>"站点查询列表" ),
                    array(name=>"Home/WafSite/getAllKindsOfCount",title=>"获取站点数量"),
                    array(name=>"Home/WafSite/byPassSite",title=>"修改防护状态" ),
                    array(name=>"Home/WafSite/batchDelete",title=>"站点批量删除"),
                    array(name=>"Admin/User/listAll",title=>"关注人用户详情"),
                    array(name=>"Admin/Role/listAll",title=>"关注人角色详情" ),
                    array(name=>"Home/DailyReport/index",title=>"查看站点日报"),
                    array(name=>"Home/DailyReport/exportReport",title=>"导出报告"),
                    array(name=>"Home/DailyReport/cloudwafData",title=>"获取云waf数据"),
                    array(name=>"Home/DailyReport/monitorData",title=>"获取服务质量数据"),
                    array(name=>"Home/DailyReport/getVulsData",title=>"获取漏扫数据"),
                    array(name=>"Home/DailyReport/attackWarn",title=>"获取攻击告警信息"),
                    array(name=>"Home/Screen/index",title=>"网站实时监控" ),
                    array(name=>"Home/Screen/visitAreaTopN",title=>"实时监控-访问地区排行"),
                    array(name=>"Home/Screen/attackIpTopN",title=>"实时监控-攻击IP排行" ),
                    array(name=>"Home/Screen/attackUrlTopN",title=>"实时监控-攻击URL排行"),
                    array(name=>"Home/Screen/visitIpTopN",title=>"实时监控-访问IP排行" ),
                    array(name=>"Home/Screen/todayVisitsAndAttacks",title=>"实时监控-当天数据总量" ),
                    array(name=>"Home/Screen/visitAndAttackCount",title=>"实时监控-攻击访问时序"),
                    array(name=>"Home/Screen/flowInAndOutCount",title=>"实时监控-流量时序" ),
                    array(name=>"Home/Screen/visitAndattackReal",title=>"实时监控-攻击态势图"),
                    array(name=>"Home/Screen/sitaAvail",title=>"实时监控-网站可用性"),

                ),
            ),
            array(
                _id=>2002, name=>"Home/Sites/addSite",title=>"新增站点",is_menu=>1,pid=>2000,seq=>2002,status=>1,
                child_actions=>array(
                    array(name=>"Home/WafSite/delete",title=>"删除站点" ),
                    array(name=>"Home/WafSite/listAttentions",title=>"查询关注人"),
                    array(name=>"Home/WafSite/updateAttentions",title=>"添加/修改关注人" ),
                    array(name=>"Home/WafSite/pageSite", title=>"站点查询" ),
                    array(name=>"Home/WafSite/listAll", title=>"站点查询列表" ),
                    array(name=>"Home/WafSite/getAllKindsOfCount",title=>"获取站点数量"),
                    array(name=>"Home/WafSite/byPassSite",title=>"修改防护状态" ),
                ),
            ),
            array(
                _id=>2003,name=>"Home/PolicyList/index",title=>"策略列表",is_menu=>1,pid=>2000,seq=>2003,status=>1,
                child_actions=>array(
                    array(name=>"Home/WafSite/delete",title=>"删除站点" ),
                    array(name=>"Home/WafSite/listAttentions",title=>"查询关注人"),
                    array(name=>"Home/WafSite/updateAttentions",title=>"添加/修改关注人" ),
                    array(name=>"Home/WafSite/pageSite", title=>"站点查询" ),
                    array(name=>"Home/WafSite/listAll", title=>"站点查询列表" ),
                    array(name=>"Home/WafSite/getAllKindsOfCount",title=>"获取站点数量"),
                    array(name=>"Home/WafSite/byPassSite",title=>"修改防护状态" ),
                ),
            ),
            array(
                _id=>3000,name=>"",title=>"监测中心",is_menu=>1,pid=>0,seq=>3000,status=>1
            ),
            array(
                _id=>3001,name=>"Home/VulsAndValidate/index",title=>"漏洞与服务", blank=>1, target=>"_blank", is_menu=>1,pid=>3000,seq=>3001,status=>1,
                child_actions=>array(
                    array(name=>"Home/VulsAndValidate/getSiteTitleMsg",title=>"获取域名站点名对照表" ),
                    array(name=>"Home/VulsAndValidate/getDomainTitol",title=>"获取域名站点名对照表for页面"),
                    array(name=>"Home/VulsAndValidate/getAllSiteValidate",title=>"获取服务质量下降站点对应地图可用性数据"),
                    array(name=>"Home/VulsAndValidate/getAllSiteFault",title=>"获取持续故障站点地图数据"),
                    array(name=>"Home/VulsAndValidate/getImportanSite",title=>"获取重要站点地图数据"),
                    array(name=>"Home/VulsAndValidate/getAllSitesStr",title=>"获取所有站点的字符串" ),
                    array(name=>"Home/VulsAndValidate/getDomainServiceDown",title=>"获取服务质量下降站点"),
                    array(name=>"Home/VulsAndValidate/getVulsMsg",title=>"获取漏洞信息"),
                    array(name=>"Home/VulsAndValidate/getSiteFault",title=>"获取站点故障统计列表"),
                    array(name=>"Home/VulsAndValidate/userMainSites",title=>"获取用户重点监测站点"),
                    array(name=>"Home/VulsAndValidate/addOrUpdateSites",title=>"添加或修改用户监测站点" ),
                    array(name=>"Home/VulsAndValidate/getRiskPort",title=>"获取端口信息"),
                    array(name=>"Home/VulsAndValidate/getFingerprint",title=>"获取指纹信息"),
                )
            ),
            array(
                _id=>3002,name=>"Home/AttackSituation/index",title=>"攻击与访问", blank=>1, is_menu=>1,pid=>3000,seq=>3002,status=>1,
                child_actions=>array(
                    array(name=>"Home/AttackSituation/getCc",title=>"获取CC信息列表" ),
                    array(name=>"Home/AttackSituation/getDefense",title=>"获取防御能力列表"),
                    array(name=>"Home/AttackSituation/getPolicy",title=>"获取策略信息列表"),
                    array(name=>"Home/AttackSituation/getVisitAndAttackTopN",title=>"获取访问和攻击TopN"),
                    array(name=>"Home/AttackSituation/visitCountRank",title=>"获取站点访问量排行"),
                    array(name=>"Home/AttackSituation/attackCountRank",title=>"获取站点攻击量排行"),
                    array(name=>"Home/AttackSituation/visitAttackCounterList",title=>"waf集群访问和攻击趋势图数据"),
                )
            ),
            array(
                _id=>3003,name=>"Home/ColonyNode/index",title=>"WAF集群", blank=>1, is_menu=>1,pid=>3000,seq=>3003,status=>1,
                child_actions=>array(
                    array(name=>"Home/ColonyNode/DDOSAttackRecord",title=>"DDoS攻击记录" ),
                    array(name=>"Home/ColonyNode/DDOSAttackSource",title=>"DDOS攻击源分布"),
                    array(name=>"Home/ColonyNode/DDOSAttackGoal",title=>"DDoS攻击目标分布"),
                    array(name=>"Home/ColonyNode/untreatedHighWarn",title=>"未处理高级别告警"),
                    array(name=>"Home/ColonyNode/getZabbix24Count",title=>"24小时内告警统计"),
                )
            ),
            array(
                _id=>3004,name=>"Home/Waf/index",title=>"玄武盾云防护", blank=>1, is_menu=>1,pid=>3000,seq=>3004,status=>1,
                child_actions=>array(
                    array(name=>"Home/Waf/flowRank",title=>"站点流量排行" ),
                    array(name=>"Home/Waf/visitCountRank",title=>"站点访问量排行"),
                    array(name=>"Home/Waf/attackCountRank",title=>"站点攻击量排行"),
                    array(name=>"Home/Waf/ipCountRank",title=>"IP排行"),
                    array(name=>"Home/Waf/visitAttackCounterList",title=>"waf集群访问趋势访问次数-攻击次数"),
                    array(name=>"Home/Waf/flowNormalCounterList",title=>"waf集群流量趋势->正常访问量 和非正常访问量"),
                    array(name=>"Home/Waf/mainState",title=>"引擎IP"),
                    array(name=>"Home/Waf/domainCount",title=>"站点总数"),
                    array(name=>"Home/Waf/attackTimes",title=>"当天攻击次数"),
                    array(name=>"Home/Waf/attackTimes",title=>"当天攻击次数"),

                )
            ),
            array(
                _id=>4000,name=>"",title=>"安全运营",is_menu=>1,pid=>0,seq=>4000,status=>1
            ),
            array(
                _id=>4001,name=>"Home/Access/index",title=>"访问控制", is_menu=>1,pid=>4000,seq=>4001,status=>1,
                child_actions=>array(
                    array(name=>"Home/Access/addAccess",title=>"进入新增或修改页面" ),
                    array(name=>"Home/Access/getAllSites",title=>"获取所有站点用于选择"),
                    array(name=>"Home/Access/addOrUpdateAccess",title=>"新增或修改访问控制列表"),
                    array(name=>"Home/Access/deleteAccess",title=>"删除访问控制列表"),
                    array(name=>"Home/Access/getAccessList",title=>"获取访问控制列表"),

                )
            ),
//            用的获取站点数量getAllKindsOfCount
//            array(
//                _id=>200022,name=>"Home/WafSite/showCount",title=>"展现站点数量",is_menu=>0,pid=>2000,seq=>200022,status=>1
//            ),


        );
        $md->getCollection()->drop();
        foreach($actions as $ac){
            $md->save($ac,array(upsert=>true));
        }

        $md->getCollection()->ensureIndex(array("status"=>1));



    }




    private function initLogRule(){
        $rules=array(
            array(_id=>"Admin/Login/login",log_code=>1,name=>"用户登录"),
            array(_id=>"Admin/Login/logout",log_code=>1,name=>"用户退出")
        );
        $md=new StringModel(Constants::$DB_RULE_LOG_OPT);
        foreach($rules as $r){
            $md->save($r,array(upsert=>true));
        }
    }


}