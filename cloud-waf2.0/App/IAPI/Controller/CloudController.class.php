<?php
namespace IAPI\Controller;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Cloud;
use Common\Vendor\Constants;
use Think\Controller;
class CloudController extends IpAuthController {
    public function queryRegions(){
         change_db_main();
         $md=new AutoIncrementModel(Constants::$DB_REGION);
         $rows=$md->field("_id,name_cn")->select();
         $this->ajaxReturn(array("code"=>1,"msg"=>"获取成功","items"=>array_values($rows)));
    }

    /**
     * 分页获取一个域中的所有网站
     *
     */
    public function queryRegionAssest(){
        $region_id=I("_id");
        if(!$region_id){
            $this->ajaxReturn(array("code"=>0,"msg"=>"参数错误"));
        }
        $region_id=intval($region_id);
        change_db($region_id);
        $ret=array();
        $md = new StringModel(Constants::$DB_ASSET);
        $rows = $md->field("_id")->limit(easyLimit())->select();
        $total = $md->count();
        $ret['items'] = array_values($rows);
        $ret['total']=$total;
        $ret['code']=1;
        $this->ajaxReturn($ret);
    }
    public function queryRegionByDomain(){
        $domain=I("domain");
        if(!$domain){
            $this->ajaxReturn(array("code"=>0,"msg"=>"参数错误,domain不能为空"));
        }
        change_db_main();
        $md=new StringModel(Constants::$DB_ASSET_MAPPER);
        $row=$md->where(array(_id=>$domain))->find();

        $reflect=$row['reflect'];

        $md=new AutoIncrementModel(Constants::$DB_REGION);
        $where=array();
        $where['init']=3;
        $rows=array_values($md->where($where)->field("_id,name_cn")->select());

        $ret=array();
        $innerRet=array();
        foreach($rows as $row){
            $regionId=$row['_id'];
            if($reflect["region_".$regionId]&&$reflect["region_".$regionId]==1&&$regionId!=1){
                $ret[]=array(_id=>$regionId,name_cn=>$row['name_cn']);
            }
            if($regionId==1){
                $innerRet[]=array(_id=>$regionId,name_cn=>$row['name_cn']);
            }
        }
        $this->ajaxReturn(array(code=>1,"items"=>$ret,"innerItems"=>$innerRet));
    }
    public function pushEvent(){
        $item=I("items");
        $_ids=I("region_ids");
//        file_put_contents
//        file_put_contents("D:/aa.txt",json_encode(I(),true));
        if(!$_ids){
            $this->ajaxReturn(array("code"=>0,"msg"=>"参数错误,region_ids不能为空"));
        }
        if(!$item){
            $this->ajaxReturn(array("code"=>0,"msg"=>"参数错误,items不能为空"));
        }
        //首先放到临时库中待处理
        $items=I("items");
        if(!$items){
            $this->ajaxReturn(array("code"=>0,"msg"=>"参数错误,items不能为空"));
        }
        if(is_string($_ids)){
            $_ids = json_decode($_ids);
        }
        if(is_string($items)){//为了支持java代码导入
            $items=str_replace("&quot;",'"',$item);
            $items=json_decode($items,true);
//            file_put_contents("D:/aa.txt",json_encode(I(),true));
        }
        foreach($_ids as $region_id){
            change_db(intval($region_id));
            foreach($items as $item){


                unset($item['event_status']);
                $md=new StringModel(Constants::$DB_ASSET);
                $row=$md->where(array(_id=>$item['domain']))->find();
                if(intval($item['type'])==1){
                    $assetUpdate=array("security.".$item['event_type'].".".$item['_id']=>1);
                    //后续可以顺便把行政归属更新掉
                    $md->where(array(_id=>$item['domain']))->save($assetUpdate);
                }
                $md=new StringModel(Constants::$DB_EVENT);
                if($row){
                    $item["event_status"] = 1;
                    $item["type"] = intval($item["type"]);
                    $item["event_type"] = intval($item["event_type"]);
                    $md->save($item,array(upsert=>true));
                }
            }

        }
        $this->ajaxReturn(array(code=>1,"msg"=>"推送成功"));

    }

    public function testPost(){
       change_db(1);
        $md=new StringModel(Constants::$DB_ASSET);


        $query = array( '$or'=>array(array("finger.server" =>new \MongoRegex('/apache 2.2/'))));
        $query['admin_location.province']="浙江";
//        dump($query);
        $total=$md->getCollection()->count($query);
        dump($total);
        $cursor=$md->getCollection()->find($query,array("_id"=>true,'title'=>true,'finger.server'=>true))->skip(0)->limit(1000);
//        while($cursor->hasNext()){
//            $r = $cursor->getNext();
//            var_dump($r);
//        }

//        $total=$md->where($where)->count();
//        dump($total);



    }

}