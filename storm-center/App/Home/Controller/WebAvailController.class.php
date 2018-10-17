<?php
namespace Home\Controller;
use Think\Controller;
class WebAvailController extends BaseController {

    public function index(){
        $this->display("index");
    }

    public function warnsms(){
        $domains=I("domains");
        $json=http_post("http://172.16.2.88:8089/warnapp/api/contract/accessinfos/list?domains=".$domains,null,'json');
        $this->ajaxReturn($json);
    }
}