<?php
namespace Home\Controller;
use Admin\Controller\BaseController;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Cloud;
use Common\Vendor\Constants;
use Common\Vendor\UserConfig;
use Think\Controller;
use Think\Hook;

class HomePageController extends BaseController {
    public function index(){

        $this->display("./page/home-page");
    }
    public function summary(){

        $md=new AutoIncrementModel(Constants::$DB_ASSET);
        //高危站点个数
        $high=$md->where(array("vuls.level"=>"high"))->count();
        $mid=$md->where(array("vuls.level"=>"mid"))->count();
        //无法访问
//        sleep(5);
        $unvisitable=$md->where(array("survey.visit_state"=>array("neq",1)))->count();
        //近7天安全事件
        $_7lastTime=strtotime('-7 day')*1000;//七天前的时间
        $md=new StringModel(Constants::$DB_EVENT);
        $where=array();
        $where['timestamp']=array("gt",$_7lastTime);
        $event=$md->where($where)->count();
        $ret=array("high"=>$high,"mid"=>$mid,"survey"=>$unvisitable,"security"=>$event);
        $this->ajaxReturn(array("code"=>1,data=>$ret));


    }
    /**获取每个子地区的高中级别漏洞个数**/
    public function vuls_summary(){
        $userConfig=new UserConfig();
        $userConfig->loadConfig();
        $mapType=$userConfig->type;
        $location_type=$userConfig->location_type;
        $rootValue=$userConfig->root_value;
        $match=array('$or'=>array());
        $match['$or'][]=array("vuls.level"=>"high");
        $match['$or'][]=array("vuls.level"=>"mid");
        $group=array( _id=>array("level"=>'$vuls.level'), total=>array('$sum'=>1 ));
        if($mapType=='china'){//入口全国
            $group['_id']['name']='$'.$location_type.'.province';
        }else if($mapType=='province'){//入口是省份
            $group['_id']['name']='$'.$location_type.'.city';
            $match[$location_type.'.province']=$rootValue;

        }else if($mapType=='city'){//入口是城市
            $group['_id']['name']='$'.$location_type.'.district';
            $tmp=explode("_",$rootValue);
            $match[$location_type.'.city']=$tmp[1];

        }
        $ops = array(
            array('$match' => $match),
            array( '$group' => $group )
        );
        $md=new StringModel(Constants::$DB_ASSET);
        $ret=$md->getCollection()->aggregate($ops);
        $ret=array_values($ret['result']);
        $ret=$this->deal($ret);
        $this->ajaxReturn(array(code=>1,"data"=>$ret));

    }
    private function deal($data){
        $arr=array();
        foreach($data as $d){
            $name=$d['_id']['name'];
            $level=$d['_id']['level'];
            $count=$d['total'];
//            if($name&&!$arr[$name]&&$name!="未知"){
//                $arr[$name]=array();
//            }
            if($name&&$name!="未知"){
                $arr[$name][$level]=$count;
                if(  !$arr[$name]['total']){
                    $arr[$name]['total']=0;
                }
                $arr[$name]['total']+=$count;
            }

        }
        return $arr;

    }

    /**
     * 网站普查的数据
     */
    public function survey_summary(){

        $group=array( _id=>array("visit_state"=>'$survey.visit_state'), total=>array('$sum'=>1 ));
        $ops = array(

            array( '$group' => $group )
        );
        $md=new StringModel(Constants::$DB_ASSET);
        $all=$md->count();
        $err=0;
        $ret=$md->getCollection()->aggregate($ops);
        $ret=array_values($ret['result']);
        $data=array();
        foreach($ret as $d){
            $count=$d['total'];
            if($d['_id']){//没经过普查的数据  ，默认认为可访问

                $visit_state=$d['_id']['visit_state'];
                if($visit_state==-1){
                    $data['请求无响应']=$count;
                    $err+=$count;
                }else if($visit_state==-2){
                    $data['资源找不到']=$count;
                    $err+=$count;
                }else if($visit_state==-3){
                    $data['服务器异常']=$count;
                    $err+=$count;
                }else if($visit_state==-4){
                    $data['僵尸网站']=$count;
                    $err+=$count;
                }

            }

        }
        $data['服务正常']=$all-$err;
        $this->ajaxReturn(array(code=>1,"category"=>$data,"summary"=>array("ok"=>$all-$err,"err"=>$err)));

    }

    public function event_summary(){
        $md=new StringModel(Constants::$DB_EVENT);
        $all=$md->count();
        $pass=$md->where(array("pass"=>1))->count();
        $this->ajaxReturn(array(code=>1,"all"=>$all,"pass"=>$pass));
    }

    /**
     * 时间维度为 往上减一年
     */
    public function event_monthline(){
        $timestamp=strtotime("-11 Month")*1000;
        $match=array(timestamp=>array('$gte'=>$timestamp),type=>1);
        $group=array( _id=>array("event_type"=>'$event_type',"time"=>'$happen_year_month'), total=>array('$sum'=>1 ));
        $ops = array(
            array('$match' => $match),
            array( '$group' => $group )
        );
        $md=new StringModel(Constants::$DB_EVENT);
        $ret=$md->getCollection()->aggregate($ops);
        $ret=array_values($ret['result']);
        $data=array();
        $cloud =new Cloud();
        $mapper=$cloud->security_event_mapper();
        $mapper=$mapper['event_type_name_mapper'];
        foreach($ret as $d){
            $data[]=array(event_type=>$mapper[$d["_id"]['event_type']],time=>$d['_id']['time'],count=>$d['total']);
        }
        $this->ajaxReturn(array(code=>1,data=>$data));

    }

    /**
     * 时间维度为所有  最近的10条安全事件
     */
    public function event_list(){
        $md=new StringModel(Constants::$DB_EVENT);
        $rows=$md->field("_id,domain,title,event_type,happen_time")->where(array(type=>1))->order("timestamp desc")->limit(10)->select();
        $rows=array_values($rows);
        $cloud =new Cloud();
        $mapper=$cloud->security_event_mapper();
        $mapper=$mapper['event_type_name_mapper'];
        $this->ajaxReturn(array(code=>1,data=>$rows,mapper=>$mapper));

    }

    /**
     * 安全资讯
     */
    public function safeinfo_list(){
        $cloud=new Cloud();
        $this->ajaxReturn(array(code=>1,data=>$cloud->safetyInfo(),mapper=>$cloud->safetyInfoType()));
    }
}