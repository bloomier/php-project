<?php

namespace Com;
use Common\Vendor\Constants;
/**
 * Created by PhpStorm.
 * User: jianghaifeng
 * Date: 2016/1/13
 * Time: 13:09
 */
class VulsContent
{
    // ---------------------------------------------------------------------------->报告相关
// 获取websiteInfo
    function initWebSiteInfo($domain){
        $param['domain'] = $domain;
        $webSiteInfo = http_post(C(Constants::$PATH_STORM_CENTER)."/search/Query/Report/domainInfo", $param, 'json');
        return $webSiteInfo['other'];
    }
// 获取vulsInfo
    function initVulsInfo($domain){
        $param['domain'] = $domain;
        $vulsInfo = http_post(C(Constants::$PATH_STORM_CENTER)."/search/Query/Report/vulsInfo", $param, 'json');
        $result = $vulsInfo['other'];
        $count = 0;
        if($result['20']){
            $result['20'] = $this->dealVulsInfo($result["20"]);
            if($result["20"]["count"]){
                $count = $count + $result["20"]["count"];
                $result['info'] = $result['20'];
            }
        }
        if($result['30']){
            $result['30'] = $this->dealVulsInfo($result["30"]);
            if($result["30"]["count"]){
                $count = $count + $result["30"]["count"];
                $result['low']=$result['30'];
            }
        }
        if($result['40']){
            $result['40']=$this->dealVulsInfo($result["40"]);
            if($result["40"]["count"]){
                $count = $count + $result["40"]["count"];
                $result['mid']=$result['40'];
            }
        }
        if($result['50']){
            $result['50']=$this->dealVulsInfo($result["50"]);
            if($result["50"]["count"]){
                $count = $count + $result["50"]["count"];
                $result['high']=$result['50'];
            }
        }
        if($result['60']){
            $result['60']=$this->dealVulsInfo($result["60"]);
            if($result["60"]["count"]){
                $result['security']= $result['60'];
            }
        }
        $result["vulscount"] = $count;
        return $result;
    }

    function dealVulsInfo($vuls){
        $result = array();
        $result["count"] = $vuls["count"];
        $vulsinfo = array();
        if($vuls["count"] > 0){
            for($i = 0; $i < count($vuls["vulsinfo"]); $i++){
                $tmp = $vuls["vulsinfo"][$i];
                if(strlen($tmp["vid"]) == 6){
                    $tmpCount = count($tmp["vuls_detail"]);
                    $result["count"] = $result["count"] - $tmpCount;
                }else{
                    $vulsinfo[] = $tmp;
                }
            }
        }
        $result["vulsinfo"] = $vulsinfo;
        return $result;
    }
// 获取securityInfo
    function initSecurityInfo($domain){
        $param['domain'] = $domain;
        $securityInfo = http_post(C(Constants::$PATH_STORM_CENTER)."/search/Query/Report/securityInfo", $param, 'json');
        return $securityInfo['other'];
    }
// 获取safeStateInfo
    function initSafeStateInfo($domain, $ip){
        $param['domain'] = $domain;
        $param['ip'] = $ip;
        $safeState = http_post(C(Constants::$PATH_STORM_CENTER)."/search/Query/Report/safeState", $param, 'json');
        $tmpValue = $safeState['other'];
        if($tmpValue['sub_domain']){
            $tmpValue['sub_domain'] = $this->encryptDomain($tmpValue['sub_domain']);
        }
        if($tmpValue['room_domain']){
            $tmpValue['room_domain'] = $this->encryptDomain($tmpValue['room_domain']);
        }
        if($tmpValue['ip_domain']){
            $tmpValue['ip_domain'] = $this->encryptDomain($tmpValue['ip_domain']);
        }
        return $tmpValue;
    }

    function encryptDomain($list){
        $tmpArray = array();
        for($i = 0; $i < count($list); $i++){
            $tmp = $list[$i];
            $domain = $tmp['domain'];
            if(!$domain){
                $domain = $tmp['sid'];
            }
            if($domain){
                $tmp['encryptDomain'] = encodeApiKey($domain);
                $tmpArray[] = $tmp;
            }
        }
        return $tmpArray;
    }

// 获取统计信息
    function initCensusInfo($vulsInfo){
        $result = array();
        $security = $vulsInfo['security'];
        $level = "低";
        if($security['count']){
            $result['rank_security_total'] = $security['total'];
            $level = "高";
        }else{
            $result['rank_security_total'] = 0;
            $result['rank_security_month_total'] = 0;
        }
        $count = 0;
        $info = 0;
        $vulscount = 0;
        $vuls = $vulsInfo['vuls'];
        if($vuls['vulscount']){
            $count = $vuls['vulscount'];
        }
        if($vuls['info']){
            $info = $vuls['info']['count'];
        }
        if($level != '高'){
            if($vuls['high']){
                $level = '高';
            }else if($vuls['mid']){
                $level = '中';
            }
        }
        $vulscount = $count - $info;
        $result['rank_vuls_total'] = $vulscount;
        $result['rank_info_total'] = $info;
        $result['rank_level'] = $level;
        return $result;
    }

}