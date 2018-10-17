<?php
namespace Security\Controller;
use Home\Controller\BaseController;
use Think\Controller;

class EventController extends BaseController {


    public function record(){
        $arr = C('EVENT_TYPE');
        foreach ($arr as $k=>$v){
            if($v==""){
                unset($arr[$k]);
            }
        }
        $this -> assign('event_type_config', $arr);
        $this->display();

    }

    public  function eventCheck(){
        $arr = C('EVENT_TYPE');
        $this -> assign('event_type_config', $arr);
        $this -> assign("image_path",C("IMAGE_SERVER"));
        $this -> assign("province",I("province"));
        $this->getEventType();
        $this->display("event_check");
    }

    public function eventCheckList(){
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        //$params['event_id'] = I('eventId');
        $params['limit'] = I('limit');
        $params['start'] = (I('currentpage') - 1) * I('limit');
        $params['audit_state'] = 0;
        $params['deal_state'] = 0;
        $param = I('param');
        if($param != null && $param != ""){
            $params['web_title'] = I('param');
        }
        $event_type = I('event_type');
        if($event_type != null && $event_type != ""){
            $params['event_type'] = I('event_type');
        }
        $web_ip_province = I("web_ip_province");
        if($web_ip_province != null && $web_ip_province != ""){
            $params['web_ip_province'] = $web_ip_province;
        }

        $data = http_post(C('STORM_CENTER_PATH')."/security/eventCheckList",$params,"json");

        if($data && $data['code'] == 1){
            $result['code']  = 1;
            $result['rows']  = $data["items"];
            $result['total'] = $data["other"];
        }
        $this->ajaxReturn($result);
    }

    public function getEmailContent(){
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        $data = I('curData');
        $list = $data['event_list'];
        $params['site_domain'] = $data['site_domain'];
        $params['site_title'] = $data['site_title'];
        $params['event_count'] = $data['event_count'];
        $params['web_ip_province'] = $list[0]['web_ip_province'];
        $params['web_ip_city'] = $list[0]['web_ip_city'];
        $event_ids = "";
        $event_descs = "";
        $event_types = "";
        $event_type_cns = "";
        $event_deal_states = "";
        $event_snapshots = "";
        $web_ip_provinces = "";
        $web_ip_citys = "";
        $event_sources = "";
        $site_urls = "";

        for($i = 0,$num = count($list); $i < $num; $i++){
            $one_event_id = $list[$i]['event_id'];
            $event_ids .= $one_event_id."@@";

            $one_event_desc = $list[$i]['event_desc'];
            $event_descs .= $one_event_desc."@@";

            $one_type = $list[$i]['event_type'];
            $event_types .= $one_type."@@";

            $one_type_cn = $list[$i]['event_type_cn'];
            $event_type_cns .= $one_type_cn."@@";

            $one_deal_state = $list[$i]['deal_state'];
            $event_deal_states .= $one_deal_state."@@";

            $one_event_snapshot = $list[$i]['event_snapshot'];
            if($one_event_snapshot == ""){
                $one_event_snapshot = "//";
            }
            $event_snapshots .= $one_event_snapshot."@@";

            $one_web_ip_province = $list[$i]['web_ip_province'];
            $web_ip_provinces .= $one_web_ip_province."@@";

            $one_web_ip_city = $list[$i]['web_ip_city'];
            $web_ip_citys .= $one_web_ip_city."@@";

            $one_event_source = $list[$i]['event_source'];
            $event_sources .= $one_event_source."@@";

            $one_site_url = $list[$i]['web_url'];
            $site_urls .= $one_site_url."@@";

        }

        $params['event_ids'] = $event_ids;
        $params['event_descs'] = $event_descs;
        $params['event_types'] = $event_types;
        $params['event_type_cns'] = $event_type_cns;
        $params['event_deal_states'] = $event_deal_states;
        $params['event_snapshots'] = $event_snapshots;
        $params['web_ip_provinces'] = $web_ip_provinces;
        $params['web_ip_citys'] = $web_ip_citys;
        $params['event_sources'] = $event_sources;
        $params['site_urls'] = $site_urls;

        $json = http_post(C('STORM_CENTER_PATH')."/Security/Event/getEmailContent",$params,"json");
        if($json){
            $result['code']=1;
            $result['other']=$json["other"];
        }
        $this->ajaxReturn($result);
    }

    public function event_check(){
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        //$params['curData'] = I('curData');
        $data = I('curData');
        $list = $data['event_list'];
        $params['site_domain'] = $data['site_domain'];
        $params['site_title'] = $data['site_title'];
        $params['event_count'] = $data['event_count'];
        $params['web_ip_province'] = $list[0]['web_ip_province'];
        $params['web_ip_city'] = $list[0]['web_ip_city'];
        $event_ids = "";
        $event_descs = "";
        $event_types = "";
        $event_type_cns = "";
        $event_deal_states = "";
        $event_snapshots = "";
        $web_ip_provinces = "";
        $web_ip_citys = "";
        $event_sources = "";
        $site_urls = "";
        for($i = 0,$num = count($list); $i < $num; $i++){

            $one_event_id = $list[$i]['event_id'];
            $event_ids .= $one_event_id."@@";

            $one_event_desc = $list[$i]['event_desc'];
            $event_descs .= $one_event_desc."@@";

            $one_type = $list[$i]['event_type'];
            $event_types .= $one_type."@@";

            $one_type_cn = $list[$i]['event_type_cn'];
            $event_type_cns .= $one_type_cn."@@";

            $one_deal_state = $list[$i]['deal_state'];
            $event_deal_states .= $one_deal_state."@@";

            $one_event_snapshot = $list[$i]['event_snapshot'];
            if($one_event_snapshot == null || $one_event_snapshot == ""){
                $one_event_snapshot = "//";
            }
            $event_snapshots .= $one_event_snapshot."@@";

            $one_web_ip_province = $list[$i]['web_ip_province'];
            $web_ip_provinces .= $one_web_ip_province."@@";

            $one_web_ip_city = $list[$i]['web_ip_city'];
            $web_ip_citys .= $one_web_ip_city."@@";

            $one_event_source = $list[$i]['event_source'];
            $event_sources .= $one_event_source."@@";

            $one_site_url = $list[$i]['web_url'];
            $site_urls .= $one_site_url."@@";

        }

        $params['event_ids'] = $event_ids;
        $params['event_descs'] = $event_descs;
        $params['event_types'] = $event_types;
        $params['event_type_cns'] = $event_type_cns;
        $params['event_deal_states'] = $event_deal_states;
        $params['event_snapshots'] = $event_snapshots;
        $params['web_ip_provinces'] = $web_ip_provinces;
        $params['web_ip_citys'] = $web_ip_citys;

        $params['event_sources'] = $event_sources;
        $params['site_urls'] = $site_urls;
        $params['group_users'] = $data['group_users'];
        $user=session("user");
        $params['current_user'] = $user['username'];

        $json = http_post(C('STORM_CENTER_PATH')."/Security/Event/checkEvent",$params,"json");
        if($json){
            $result['code']=1;
            $result['msg']="通报成功";
        }
        $this->ajaxReturn($result);

    }


    public function verify(){
        $arr = C('EVENT_TYPE');
        $this -> assign('event_type_config', $arr);
        $this -> assign("image_path",C("IMAGE_SERVER"));
        $this->getEventType();
        $this->display("verify");

    }

    public function trace(){
        if(I('deal_state')){
            $this->assign("default_deal_state", I('deal_state'));
        }
        $this->getEventType();
        $this->display();
    }

    private function getEventType(){
        $data = http_post(C('STORM_CENTER_PATH')."/security/queryEventType", null, "json");
        $this->assign('eventType',$data['items']);
    }

    /*事件跟踪中 查看事件*/
    public function traceView(){
        $params['event_id'] = I('eventId');
        $data = http_post(C('STORM_CENTER_PATH')."/security/selectEventInfo",$params,"json");
        if($data['code']){
            $this->assign("event", $data['items'][0]);
        }
        $this->assign("eventId", I('eventId'));
        $this->assign("image_path",C("IMAGE_SERVER"));
        $this->display("traceView");

    }

    public function history_new(){
        $result['code']= 0;
        $result['msg']= "成功";
        $this->assign("event_id", I("event_id"));
        $params = array(
            "event_id"=>I("event_id"),
            "web_domain"=>I("web_domain"),
        );
        $json = http_post(C('STORM_CENTER_PATH')."/queryEventInfoHistory",$params,"json");
        //设置编码
        header("Content-Type:text/html;   charset=utf-8");
        //所有年份的数组
        $year  = array();
        $site_name = "";
        //遍历获取所有年，并存入数组中
        for($temp = 0;$temp < count($json[items]);$temp++){
            foreach($json[items][$temp] as $k=>$v) {
                //获取网站名
                if($site_name == ""){
                    if ($k == "web_title") {
                        $site_name = $v;
                    }
                }
                if ($k == "happen_time") {
                    $isin = in_array(substr($v,0,4),$year);
                    if($isin){
                    }else{
                        $year[count($year)] = substr($v,0,4);
                    }
                    break;
                }
            }
        }
        $result['site_name'] = $site_name;
        $result['year'] = $year;
        //$this->assign("eventInfo",$result);
        $this->display("history_new");
    }

    public function history(){
        $result['code']= 0;
        $result['msg']= "成功";
        $this->assign("event_id", I("event_id"));
        $params = array(
            "event_id"=>I("event_id"),
            "web_domain"=>I("web_domain"),
        );
        $json = http_post(C('STORM_CENTER_PATH')."/queryEventInfoHistory",$params,"json");
        //设置编码
        header("Content-Type:text/html;   charset=utf-8");
        //所有年份的数组
        $year  = array();
        $site_name = "";
        //遍历获取所有年，并存入数组中
        for($temp = 0;$temp < count($json[items]);$temp++){
            foreach($json[items][$temp] as $k=>$v) {
                //获取网站名
                if($site_name == ""){
                    if ($k == "web_title") {
                        $site_name = $v;
                    }
                }
                if ($k == "happen_time") {
                    $isin = in_array(substr($v,0,4),$year);
                    if($isin){
                    }else{
                        $year[count($year)] = substr($v,0,4);
                    }
                    break;
                }
            }
        }

        $yearList = array();
        for($i = 0; $i < count($year); $i++){
            $oneYear = array();
            for($temp = 0;$temp < count($json[items]);$temp++){
                $oneObject = array();
                $flag = false;
                $had_repair = 1;
                $date_str = "";
                $event_type = "黑页";
                $deal_state = "修复";
                $web_url = "";
                $event_id = "";
                foreach($json[items][$temp] as $k=>$v) {
                    if ($k == "happen_time") {
                        $date_str = substr($v,5,5);
                        if($year[$i] == substr($v,0,4)){
                            $flag = true;
                        }
                    }
                    if ($k == "event_type") {
                        if($v == "1"){
                            $event_type == "黑页";
                        } else if($v == "2"){
                            $event_type = "暗链";
                        } else if($v == "3"){
                            $event_type = "反共";
                        } else if($v == "5"){
                            $event_type = "博彩";
                        } else if($v == "6"){
                            $event_type = "色情";
                        } else if($v == "7"){
                            $event_type = "漏洞";
                        } else {
                            $event_type = "其他";
                        }
                    }
                    if ($k == "deal_state") {
                        $deal_state = $v;
                        if($deal_state == 3){
                            $had_repair = 3;
                            $deal_state = "修复";
                        } else {
                            $deal_state = "未修复";
                        }
                    }
                    if ($k == "web_url") {
                        $web_url = $v;
                    }
                    if ($k == "event_id") {
                        $event_id = $v;
                    }
                }
                if($flag){
                    $oneObject['date_str'] = $date_str;
                    $oneObject['had_repair'] = $had_repair;
                    $oneObject['deal_str'] = $event_type." [".$deal_state."]";
                    $oneObject['web_url'] = $web_url;
                    $oneObject['event_id'] = $event_id;
                }
                array_push($oneYear,$oneObject);
            }

            $yearList[$year[$i]] = $oneYear;
        }
        $result['site_name'] = $site_name;
        //$year[count($year)] = "2014";
        $result['year'] = $year;
        $result['yearList'] = $yearList;
        $this->assign("eventInfo",$result);
        $this->display("history");
    }

    /*历史事件*/
    public function history_old(){
        $this->assign("event_id", I("event_id"));
        $params = array(
            "event_id"=>I("event_id"),
            "web_domain"=>I("web_domain"),
        );
        $json = http_post(C('STORM_CENTER_PATH')."/queryEventInfoHistory",$params,"json");
        //设置编码
        header("Content-Type:text/html;   charset=utf-8");
        //所有年份的数组
        $year  = array();
        $site_name = "";
        $site_domain = "";
        if(I("web_domain") != ''){
            $site_domain = I("web_domain");
        }
        //遍历获取所有年，并存入数组中
        for($temp = 0;$temp < count($json[items]);$temp++){
            foreach($json[items][$temp] as $k=>$v) {
                //获取域名
                if($site_domain == ""){
                    if ($k == "web_domain") {
                        $site_domain = $v;
                    }
                }
                //获取网站名
                if($site_name == ""){
                    if ($k == "web_title") {
                        $site_name = $v;
                    }
                }
                if ($k == "happen_time") {
                    $isin = in_array(substr($v,0,4),$year);
                    if($isin){
                    }else{
                        $year[count($year)] = substr($v,0,4);
                    }
                    break;
                }
            }
        }
        $title = "<div class='page-header' align='center'>".
                 "<h2>".$site_name."<small><a href=''>".$site_domain."</a></small></h2></div>";
        $div = "<div class='col-md-7'><div class='timeline'>";
        $yearDiv = "<ul class='event_year'>";
        for($i = 0; $i < count($year); $i++){
            if($i == 0){
                $yearDiv .= "<li class='current'><label for='".$year[$i]."'>".$year[$i]."</label></li>";
            } else {
                $yearDiv .= "<li><label for='".$year[$i]."'>".$year[$i]."</label></li>";
            }
        }
        $yearDiv .= "</ul>";
        $event_list = "<ul class='event_list'>";
        $list_div = "";
        for($i = 0; $i < count($year); $i++){
            $first = "<div class='list''><h3 id='".$year[$i]."'>".$year[$i]."</h3>";
            for($temp = 0;$temp < count($json[items]);$temp++){
                $flag = false;
                $one_li = "";
                $date_str = "";
                $event_type = "黑页&nbsp;&nbsp;";
                $deal_state = "&nbsp;&nbsp;修复&nbsp;";
                $class_str = "repair";
                $web_url = "";
                foreach($json[items][$temp] as $k=>$v) {
                    if ($k == "happen_time") {
                        $date_str = substr($v,5,5);
                        if($year[$i] == substr($v,0,4)){
                            $flag = true;
                        }
                    }
                    if ($k == "event_type") {
                        if($v == "1"){
                            $event_type == "黑页&nbsp;&nbsp;";
                        } else if($v == "2"){
                            $event_type = "暗链&nbsp;&nbsp;";
                        } else if($v == "3"){
                            $event_type = "反共&nbsp;&nbsp;";
                        } else if($v == "5"){
                            $event_type = "博彩&nbsp;&nbsp;";
                        } else if($v == "6"){
                            $event_type = "色情&nbsp;&nbsp;";
                        } else if($v == "7"){
                            $event_type = "漏洞&nbsp;&nbsp;";
                        } else {
                            $event_type = "其他&nbsp;&nbsp;";
                        }
                    }
                    if ($k == "deal_state") {
                        $deal_state = $v;
                        if($deal_state == 3){
                            $class_str = "repair";
                            $deal_state = "&nbsp;&nbsp;修复&nbsp;";
                        } else {
                            $class_str = "unrepair";
                            $deal_state = "&nbsp;&nbsp;未修复&nbsp;";
                        }
                    }
                    if ($k == "web_url") {
                        $web_url = $v;
                    }
                }
                if($flag){
                    $one_li = "<li><span>".$date_str."</span><p><span>".
                                "<i class='type'>".$event_type."</i>".
                                "<a href='".$web_url."'>".$web_url."</a><i class='".$class_str.
                                "'>".$deal_state."</i></span></p></li>";
                }
                $first .= $one_li;
            }
            $list_div .= $first."</div>";
        }
        $event_list .= $list_div."</ul>";
        $div .= $yearDiv.$event_list."</div>";
        $info = $title.$div;

        $this->assign("info",$info);
        $this->display();
    }


    public function insert(){
        $params = array(
            "web_url"=>I("web_url"),
            "web_domain"=>I("web_domain"),
            "web_title"=>I("web_title"),
            "web_ip"=>I("web_ip"),
            "happen_time"=>I('happen_time'),
            "event_type"=>I("event_type"),
            "event_desc"=>I("event_desc"),
            "event_source"=>I("event_source"),
            "event_snapshot"=>I("event_snapshot"),
            "intrusion_mode"=>I("intrusion_mode"),
            "remark"=>I("remark")
        );
        $json = http_post(C('STORM_CENTER_PATH')."/insertEventInfo",$params,"json");
        $result['code']= $json[code];
        $result['msg']= $json[msg];
        $this->ajaxReturn($result);
    }

    /**
     * 查询
     */
    public function query(){
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        $start = (I('currentpage') - 1) * I('limit');
        $limit = I('limit');
        if(I('audit_state') || I('audit_state') == 0){
            $param['audit_state'] = I('audit_state');
        }
        if(I('param')){
            $param['param'] = '%'.I('param').'%';
        }
        $param['start'] = $start;
        $param['limit'] = $limit;

        if(I('event_type')){
            $param['event_type'] = I('event_type');
        }
        if(I('web_domain')){
            $param['web_domain'] = I('web_domain');
        }
        if(I("event_id")){
            $param['event_id'] = I('event_id');
        }
        if(I('web_title')){
            $param['web_title'] = I('web_title');
        }

        if(I('audit_status')){
            $param['audit_state'] = I('audit_status');
        }

        if(I('deal_state')){
            $param['deal_state'] = (I('deal_state') - 1);
        }
        $data = http_post(C('STORM_CENTER_PATH')."/security/selectEventInfo", $param,'json');
        if($data['code']){
            $result['code']=1;
            $result['total'] = $data['other'];
            $result['rows'] = $data['items'];
        }
        $this->ajaxReturn($result);
    }

    /**
     * 修改
     */
    public function update(){
        $param = array();
        $user=session("user");
        $param['event_id'] = I('id');
        if(I('title')){
            $param['web_title'] = I('title');
        }
        if(I('source')){
            $param['event_source'] = I('source');
        }
        if(I('url')){
            $param['web_url'] = I('url');
        }
        if(I('audit')){
            $param['audit_state'] = I('audit');
        }
        if(I('desc')){
            $param['event_desc'] = I('desc');
        }
        if(I('contact')){
            $param['contact'] = I('contact');
        }
        if(I('deal_state')){
            $param['deal_state'] = I('deal_state');
        }
        $location = "";
        if(I('province')){
            if(I('province') != '全国'){
                $param['web_ip_province'] = I('province');
                $location = $location.I('province');
            }

        }
        if(I('city')){
            if(I('city') != '' && I('city') != '全省'){
                $param['web_ip_city'] = I('city');
                $location = $location.I('province');
            }
        }
        if($location != "" && I('province') != '全国' && I('city') != '全省'){
            $param['web_ip_addr'] = $location;
        }
        //事件截图 add by ancyshi
        if(I('event_snapshot')){
            $param['event_snapshot'] = I('event_snapshot');
        }
        $param['audit_user'] = $user['username'];
        $param['last_modify_user'] = $user['username'];
        $data = http_post(C('STORM_CENTER_PATH')."/security/updateEventInfo", $param,'json');
        if($data['code']){
            $this->ajaxReturn(array("code"=>1,"msg"=>"修改成功"));
        }else{
            $this->ajaxReturn(array("code"=>0,"msg"=>"修改失败"));
        }
    }

    /**
     * 修改
     */
    public function beatchRepair(){
        $param = array();
        $user=session("user");
        $param['userName'] = $user['username'];
        $param['ids'] = I('ids');
        $data = http_post(C('STORM_CENTER_PATH')."/security/beatchUpdateEventInfo", $param,'json');
        if($data['code']){
            $this->ajaxReturn(array("code"=>1,"msg"=>"修改成功"));
        }else{
            $this->ajaxReturn(array("code"=>0,"msg"=>"修改失败"));
        }
    }

    /**
     * 查询
     */
    public function queryEventLog(){
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        $start = (I('currentpage') - 1) * I('limit');
        $limit = I('limit');

        $param['start'] = $start;
        $param['limit'] = $limit;

        $param['eventId'] = I('eventId');

        if(I('logDesc')){
            $param['logDesc'] = I('logDesc');
        }

        if(I('remark')){
            $param['remark'] = I('remark');
        }

        $data = http_post(C('STORM_CENTER_PATH')."/security/queryEventLog", $param,'json');
        if($data['code']){
            $result['code']=1;
            $other = $data['other'];
            $result['total'] = $other['count'];
            $result['rows'] = $other['list'];
        }
        $this->ajaxReturn($result);
    }

    /**
     * 通过省-市查询
     */
    public function queryByLocation(){
        $param['province'] = I('province');
        $param['city'] = I('city');
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        $data = http_post(C('STORM_CENTER_PATH')."/security/getGroupByLocation", $param,'json');
        if($data['code']){
            $result['code']=1;
            $result['rows'] = $data['items'];
        }
        $this->ajaxReturn($result);
    }


    public function statistics(){
        $yearArr = array();
        $yearNum = (int)date("Y");
        $yearArr["请选择年份"] = "";
        for(; $yearNum > 2012; $yearNum--){
            $yearArr[$yearNum."年"] = $yearNum."";
        }
        //echo($yearNum);
        $this -> assign('year_config', $yearArr);
        $this->display();
    }

    public function queryEventStatistics(){
        $param = array();
        $param['year_month_key'] = I('year_month_key');
        $data = http_post(C('STORM_CENTER_PATH')."/security/queryEventStatistics", $param,'json');
        if($data['code']){
            $result['code']=1;
            $result['data'] = $data['data'];
        }
        $this->ajaxReturn($result);
    }
}