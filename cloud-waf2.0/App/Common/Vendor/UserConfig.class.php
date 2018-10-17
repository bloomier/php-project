<?php
namespace Common\Vendor;
use Common\Model\AutoIncrementModel;

class UserConfig  {
    public $location_type;//先知页面的使用的归属类型
    public $deep_type;//先知页面使用的下钻深度
    public $type;//先知页面的初始入口类型  ""/"province"/"city"
    public $root_value;//先知页面的初始入口 example china/浙江/浙江_宁波
    public $user_power_type;//用户则产权限划分方式  0 不划分 1 按区域划分
    public $title_suffix;
    public function loadConfig(){
        $current_region_id=current_region_id();
        change_db_main();
        $md=new AutoIncrementModel(Constants::$DB_REGION);
        $row=$md->where(array(_id=>$current_region_id))->find();
        change_db(current_region_id());
        $this->type='china';
        $this->root_value="全国";

        if($row['view_config']){
            if($row['view_config']['district']){
                $this->type="district";
                $this->root_value=$row['view_config']['province']."_".$row['view_config']['city']."_".$row['view_config']['district'];
            }else if($row['view_config']['city']){
                $this->type="city";
                $this->root_value=$row['view_config']['province']."_".$row['view_config']['city'];
            }else if($row['view_config']['province']){
                $this->type="province";
                $this->root_value=$row['view_config']['province'];
            }
        }
        $this->deep_type="district";

        if($row['view_config']&&$row['view_config']['deep_type']){
            $this->deep_type=$row['view_config']['deep_type'];
        }
        if($row['view_config']&&$row['view_config']['title_suffix']){
            $this->title_suffix=$row['view_config']['title_suffix'];
        }
        $this->location_type='location';
        if($row['view_config']&&$row['view_config']['location_type']){
            $this->location_type=$row['view_config']['location_type'];
        }
        $this->user_power_type=0;
        if($row['view_config']&&$row['view_config']['user_power_type']){//基于区域划分网站用户权限
            $this->user_power_type=intval($row['view_config']['user_power_type']);
        }
        if($this->user_power_type==1){//如果是基于区域划分的
            $user=session("user");
            if($user['data_config']){
                if($user['data_config']['district']){
                    $this->type="district";
                    $this->root_value=$user['data_config']['province']."_".$user['data_config']['city']."_".$user['data_config']['district'];
                }else if($user['data_config']['city']){
                    $this->type="city";
                    $this->root_value=$user['data_config']['province']."_".$user['data_config']['city'];
                }else if($user['data_config']['province']){
                    $this->type="province";
                    $this->root_value=$user['data_config']['province'];
                }
            }
        }
    }
    public function loadConfigAsArray(){
        $this->loadConfig();
        $json=json_encode($this);
        return json_decode($json,true);
    }
    public function parseUserLocCond(){
        $this->loadConfig();
        $location_type=$this->location_type;
        $user_power_type=$this->user_power_type;
        $where=array();
        if($user_power_type==1){//如果基于区域划分用户网站
            $user=session("user");
            if($user['data_config']){
                if($user['data_config']['province']){
                    $where[$location_type.".province"]=$user['data_config']['province'];
                }
                if($user['data_config']['city']){
                    $where[$location_type.".city"]=$user['data_config']['city'];
                }
                if($user['data_config']['district']){
                    $where[$location_type.".district"]=$user['data_config']['district'];
                }
            }
        }
        return $where;
    }

    public function parseUserLocation(){
        $this->loadConfig();
        $location_type=$this->location_type;
        $user_power_type=$this->user_power_type;
        $where=array();
        if($user_power_type==1){//如果基于区域划分用户网站
            $user=session("user");
            if($user['data_config']){
                if($user['data_config']['province']){
                    $where[$location_type]["province"]=$user['data_config']['province'];
                }
                if($user['data_config']['city']){
                    $where[$location_type]["city"]=$user['data_config']['city'];
                }
                if($user['data_config']['district']){
                    $where[$location_type]["district"]=$user['data_config']['district'];
                }
            }
        }
        return $where;
    }

}