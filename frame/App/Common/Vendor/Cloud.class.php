<?php
namespace Common\Vendor;
class Cloud  {
    public function queryPolicyMapper(){
        if(S('cloud_policy_mapper')){//1个小时的数据缓存
            return S('cloud_policy_mapper');
        }
        $json=http_post(C(Constants::$API_CLOUD)."/TaskAPI/queryPolicy",null,'json');
        $conf=array();
        $nameMapper=array();
        $levelMapper=array();
        $_m=array(60=>"high",50=>"high",40=>"mid",30=>"low",20=>"info");
        if($json['code']>0){
            foreach($json['items'] as $item){
                if($item['policy']){
                    $nameMapper[$item['policy']]=$item['name'];
                    $levelMapper[$item['policy']]=$_m[$item['level']];

                }
            }
        }
        $conf['vuls_name_mapper']=$nameMapper;
        $conf['vuls_level_mapper']=$levelMapper;
        S('cloud_policy_mapper',$conf,3600);
//        dump($conf);
        return $conf;
    }

    /**
     * 查询策略原样
     */
    public function queryPolicy(){
        $json=http_post(C(Constants::$API_CLOUD)."/TaskAPI/queryPolicy",null,'json');
        return $json;
    }

    public function security_event_mapper(){
        if(S('security_event_mapper')){//1个小时的数据缓存
            return S('security_event_mapper');
        }
        $json=http_post(C(Constants::$API_CLOUD)."/EventAPI/queryType",null,'json');
        $nameMapper=array();
        foreach($json['items'] as $item){
            $nameMapper[$item["_id"]]=$item['name'];
        }
        $conf=array();
        $conf['event_type_name_mapper']=$nameMapper;
        S('security_event_mapper',$conf,3600);
        return $conf;
    }

    public function zero_day_policy(){
        if(S('zeroday_policy')){//1个小时的数据缓存
            return S('zeroday_policy');
        }
        $json=http_post(C(Constants::$API_CLOUD)."/ZeroDayConfigAPI/query",null,'json');
        $policy=array();
        if($json['code']>0){
            $items=$json["items"];

            foreach($items as $item){
                $_policy=array(_id=>$item["_id"],name=>$item['name'],type=>$item['type'],"desc"=>$item['desc']);
                if($item['type']==2){
                    $_policy['config']=array(name=>$item['config']);
                }else if($item['type']==1){
                    $_policy['config']=$item['config'];
                }
                $policy[$item['name']]=$_policy;
            }
        }
        $conf=array("zeroday_policy"=>$policy);
        S('zeroday_policy',$conf,3600);
        return $conf;

    }


    /**
     * 安全资讯类型
     */
    public function safetyInfoType(){
        if(S('safety_info_type')){
            return S('safety_info_type');
        }
        $json = http_post(C(Constants::$API_CLOUD)."/SafetyInfoAPI/safeInfoType", null, 'json');
        S('safety_info_type', $json['items'], 3600);
        return $json['items'];
    }

    /**
     * 根据id获取某个资讯的详情
     *
     * @param $id
     * @return mixed
     */
    public function queryOneSafety($id){
        $json = http_post(C(Constants::$API_CLOUD)."/SafetyInfoAPI/queryOneSafety", array(_id=>$id), 'json');
        return $json['info'];
    }

    /**
     * 安全资讯列表
     */
    public function safetyInfo($type = null){
        if(S('safety_info')){
//            return S('safety_info');
        }
        if($type){
            $param["safety_type_id"] = $type;
        }
        $param['region_id'] = current_region_id();
        $json = http_post(C(Constants::$API_CLOUD)."/SafetyInfoAPI/query", $param, 'json');
        S('safety_info', $json['items'], 3600);
        return $json['items'];
    }

    /**
     * 专题报告
     *
     * @return mixed
     */
    public function querySpecialReport(){
        $param["region_id"] = current_region_id();
        $json=http_post(C(Constants::$API_CLOUD)."/SpecialReportAPI/query", $param, 'json');
        return $json["items"];
    }

}