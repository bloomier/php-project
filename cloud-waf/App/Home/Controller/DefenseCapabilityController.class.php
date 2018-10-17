<?php
namespace Home\Controller;
use Think\Controller;
use Admin\Controller\BaseController;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;
use Common\Vendor\WafConsole;

class DefenseCapabilityController extends BaseController {

    public function index(){
        $this->assign("attackTypeId",C("POLICY_NAMEE"));
        $this->getDomainTitol();
        $this->display("DefenseCapability");
    }

    public function getDefense(){
        $accessParams = I();
        $start = I('start');
        $limit = I('length')-2;
        $md = new StringModel(Constants::$DB_DEFENSE_ATTACK);
        if(strlen($accessParams[$limit]['url'])>0 || $accessParams[$limit+1]['handleState']){
            strlen($accessParams[$limit]['url'])>0&&$condition['url'] = array('like',$accessParams[$limit]['url']);
            $accessParams[$limit+1]['handleState'] == '1'&&$condition['handleState'] = (int)$accessParams[$limit+1]['handleState'];
            $accessParams[$limit+1]['handleState']&&$accessParams[$limit+1]['handleState'] != '1'&&$condition['handleState'] = array('$ne'=>1);
            $rows = $md->where($condition)->order('timestamp desc')->limit($start,$limit)->select();
            $count = $md->where($condition)->count();
        }else{
            $rows = $md->order('timestamp desc')->limit($start,$limit)->select();
            $count = $md->count();
        }
        foreach($rows as $k=>$v){
            $items[] = $v;
        }
        $result['code'] = 1;
        $result['recordsTotal'] = $count;
        $result['recordsFiltered'] = $count;
        $result['data'] = $items!=null?$items:"";
        $this->ajaxReturn($result);
    }

    public function updateHandleState(){
        $md = new StringModel(Constants::$DB_DEFENSE_ATTACK);
        $condition['_id'] = I("event_id");
        $data['handleState'] = (int)I('handleState');
        $md->where($condition)->save($data);
    }


//    public function testOrder(){
//        $md = new StringModel(Constants::$DB_DEFENSE_ATTACK);
//        $rows = $md->order('timestamp desc')->limit(150000,10)->select();
//        $this->ajaxReturn($rows);
//    }

    public function getSiteTitleMsg(){
        $data=http_post(C(Constants::$PATH_API)."/api/cloudwaf/siteVuls/getSiteVulsMsg",null,'json');
        $result = array();
        //return $data['items'];
        foreach($data['items'] as $k=>$value){
            $result[$value['_id']] = $value['title'];
        }
//        dump($result);
        return $result;
    }

    /** 获取域名站点名对照表 */
    public function getDomainTitol(){
        $siteTitle   = $this->getSiteTitleMsg();
        $md = new StringModel(Constants::$DB_ASSET);
        $rows = $md->field("title")->select();
        foreach($rows as $value){
            $result[$value['_id']]=$value['title']==""&&$siteTitle[$value['_id']]?$siteTitle[$value['_id']]:$value['title'];
        }
        $this->assign("domainTitle",$result);
//        return $result;

    }

}