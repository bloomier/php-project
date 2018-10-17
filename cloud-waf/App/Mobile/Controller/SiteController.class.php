<?php
/**
 * Created by PhpStorm.
 * User: jianghaifeng
 * Date: 2016/3/1
 * Time: 14:25
 */

namespace Mobile\Controller;
use Admin\Controller\BaseController;
use Think\Controller;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;

class SiteController extends Controller {

    public function index(){
        $md=new StringModel(Constants::$DB_ASSET);
        $this->assign('title','云防护站点');
        $this->display("index");
    }
    public function detail(){
        $domain=I('domain');
        $this->assign("domain",$domain);
        $this->assign('title','云防护站点详情');
        $this->display("detail");
    }
    public function monitor(){
        $this->assign('title','实时监控');
        $this->display("monitor");
    }



    public function pageSite(){
        $siteVail    = $this->getSiteVail();
        $visitCount  = $this->visitCount();
        $attackCount = $this->attackCount();
        $param = I('param');
        if(!I('curPage')){
            $start = 0;
        }else{
            $start = (I('curPage')-1)*10;
        }
        $uid=current_user_id();
        $user = session('user');
        $md = new AutoIncrementModel(Constants::$DB_USER_2_ASSET);
        $condition['uid'] = $uid;
        $user_2_asset = $md->field('domain')->where($condition)->select();
        $domains = array();
        foreach($user_2_asset as $k=>$v){
            $domains[] = $v['domain'];
        }
        if($user['isSystemRole']){
            $condition['relation_type'] = 1;
            $condition['uid'] = array('ne',$uid) ;
            $rows2=$md->field('domain')->where($condition)->select();
            foreach($rows2 as $k=>$row){
                $domains[]=$row['domain'];
            }
        }
        $md=new StringModel(Constants::$DB_ASSET);
        $where["_id"]=array("in",$domains);
        if($param){
            $map['_complex'] = $where;
            $map['_logic'] = 'or';
            $map['_id'] = array('like',$param);
            $map['title'] = array('like',$param);

        }
        $asset = $md->field('_id,title,siteVail,visitCount,attackCount')->where($map)->limit($start,10)->select();
        $total = $md->where($map)->count();
        $result = array();
        foreach($asset as $k=>$v){
            $one['site'] = $v['title']?:$v['_id'];
            $one['domain'] = $v['_id'];
            $one['siteVail'] = $siteVail[$v["_id"]] ? $siteVail[$v["_id"]] : "访问正常";
            $one['visitCount'] = $visitCount[$v["_id"]] ? $visitCount[$v["_id"]] : 0;
            $one['attackCount'] = $attackCount[$v["_id"]] ? $attackCount[$v["_id"]] : 0;
            $one['total'] = $total;
            $result[] = $one;
        }
        $this->ajaxReturn($result);


    }

    public function getAssetMsg(){
        $siteVuls    = $this->getSiteVulsMsg();
        $siteTitle   = $this->getSiteTitleMsg();
        $siteFlow    = $this->getFlowOut();
        $visitCount  = $this->visitCount();
        $attackCount = $this->attackCount();
        $siteVail    = $this->getSiteVail();
        $domain = I('domain');
        $md = new StringModel(Constants::$DB_ASSET);
        $condition['_id'] = $domain;
        $row = $md->where($condition)->find();

        $row['vulsLevel'] = $siteVuls[$row["_id"]] ? $siteVuls[$row["_id"]] : "安全";
        $row['bypass'] = $row["config"] && $row["config"]['bypass'] == 0 ? $row["config"]['bypass'] : 1;
        $row['flow'] = $siteFlow[$row["_id"]] ? $siteFlow[$row["_id"]] : 0;
        $row['visitCount'] = $visitCount[$row["_id"]] ? $visitCount[$row["_id"]] : 0;
        $row['attackCount'] = $attackCount[$row["_id"]] ? $attackCount[$row["_id"]] : 0;
        $row['siteVail'] = $siteVail[$row["_id"]] ? $siteVail[$row["_id"]] : "访问正常";
        $row['title'] = $row['title']?:$row['_id'];
        $this->ajaxReturn($row);

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



}