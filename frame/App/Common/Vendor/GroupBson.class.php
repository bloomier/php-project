<?php
namespace Common\Vendor;
class GroupBson  {
    public function parseGroupConfig($script){
        //去掉注释  //去掉尾部}；中的；

        $reg='/\/\*\*.*?\*\*\//';
        $script=preg_replace($reg,"",$script);
        $script=str_replace("};","}",$script);
        //conf
        $confTmp=substr($script,strpos($script,"=")+1);
        $conf=substr($confTmp,0,strpos($confTmp,"var"));
        $reduce=substr($confTmp,strpos($confTmp,"var reduce=")+11);
        $finalize=substr($reduce,strpos($reduce,"var finalize=")+13);
        $reduce=substr($reduce,0,strpos($reduce,"var finalize="));
        $bson=json_decode($conf,true);
        $bson['reduce']=$reduce;
        $bson['finalize']=$finalize;
        return $bson;


    }
    public function appendInitial($bson,$ext_initial){
        $initial=$bson['initial'];
        $initial=array_merge($initial,$ext_initial);
        $bson['initial']=$initial;
        return $bson;
    }


    public function group($collection,$bson){
        $option=array();
        if($bson['cond']){
            $option['condition']=$bson['cond'];
        }
        if($bson['finalize']){
            $option['finalize']=$bson['finalize'];
        }
        $row=$collection->group($bson['key'],$bson['initial'],$bson['reduce'],$option);
        if($row['retval']){
            return $row['retval'][0];
        }else{
            return $bson['initial'];
        }
    }


}