<?php
namespace Home\Controller;
use Think\Controller;
class SceneOneController extends BaseController{

    /**
     * 获取第一个场景的信息
     */
    public function querySceneInfo(){
        $domain["domain"] = I("domain");
        $domain["type"]=I("queryType");
        $domain["ip"]=I("ip");
        $result = http_post(C('STORM_CENTER_PATH')."/sceneOneDomain", $domain,'json');
        $this->ajaxReturn($result);
    }


}