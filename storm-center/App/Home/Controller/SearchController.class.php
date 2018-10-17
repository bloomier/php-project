<?php
namespace Home\Controller;
use Think\Controller;

class SearchController extends BaseController {

	public function index(){

        $this -> display("index");
    }

    // 查询结果页面
    public function queryResult(){
        if(!I('params')){
            $this->redirect("index");
        }
        $this->assign("params", I("params"));
        $this->display("query-result");
    }

    // 查询
    public function queryByParam(){
        $param["area"] = I('area');
        $param["query_param"] = I("query_param");
        $param["start"]=I("start");
        $param["limit"]=I("limit");
        $param['show_area'] = I("type");
        $rst=array('code'=>0, 'data'=>array(), 'total'=>0, 'time'=>0);

        $result = http_post(C('STORM_CENTER_PATH')."/webdomain/query", $param,'json');
        if($result["code"]){
            $rst["code"] = 1;
            $rst['total'] = $result["other"]["count"];
            $rst['time'] = $result['other']['time'];
            $values = array();
            foreach($result["other"]["value"] as $tmp){
                $tmpDomain = $tmp['domain'];
                $tmp['encodeDomain'] = urlencode(encodeApiKey($tmpDomain));
                $values[] = $tmp;
            }
            $rst['data'] = $values;
            if(I('type')){
                $rst['areacount'] = $result['other']['areacount'];
            }
        }

        $this->ajaxReturn($rst,"JSON");
    }

}