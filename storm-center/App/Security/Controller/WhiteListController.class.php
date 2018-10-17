<?php
/**
 * Created by PhpStorm.
 * User: ST
 * Date: 2015/9/9
 * Time: 16:06
 */

namespace Security\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;



class WhiteListController extends BaseController  {

    // 进入我的合同列表页面
    public function index(){
        $this -> display("index");
    }

    //进入合同登记页面
    public function register(){
        $contract_id = I('contract_id');
        $contract_area = C('CONTRACT_AREA');
        if($contract_id && $contract_id != ""){
            $this -> assign('contract_id', $contract_id);
            $params = array(
                'id' =>$contract_id
            );
            $json = http_post(C('STORM_CENTER_PATH')."/security/whitelist/getWhiteListById",$params,"json");
            $contract = $json[other];
            $this -> assign('contract', urlencode(json_encode($contract)));
        }
        $sale_responsibles = array("请选择");
        $area_responsibles = array("请选择");
        //此处遍历归属区域就是为了在查看详情时，避免有区域负责人和销售负责人时没有匹配项
        foreach ($contract_area as $k => $v) {
            if($v != null){
                foreach($v as $key1 => $v1){
                    if($key1 == "SALE_RESPONSIBLE"){
                        if($v1 != null && $v1 != ""){
                            $oneArr = explode(",", $v1);
                            $sale_responsibles = array_merge($sale_responsibles,$oneArr);
                        }
                    } else {
                        if($v1 != null && $v1 != ""){
                            $oneArr = explode(",", $v1);
                            $area_responsibles = array_merge($area_responsibles,$oneArr);
                        }
                    }
                }
            }
        }
        $this -> assign('sale_responsibles', $sale_responsibles);
        $this -> assign('area_responsibles', $area_responsibles);
        $this -> assign('config_area', $contract_area);

        $this -> display("register");
    }

    //新增合同
    public function insert(){
        $user=session("user");
        $area = I("area");
        if($area == "请选择"){
            $area = "";
        }
        $area_responsible = I("area_responsible");
        if($area_responsible == "请选择"){
            $area_responsible = "";
        }
        $sale_responsible = I("sale_responsible");
        if($sale_responsible == "请选择"){
            $sale_responsible = "";
        }

        $params = array(
            "client_no"=>I("client_no"),
            //"contract_name"=>I("contract_name"),
            "client_name"=>I("client_name"),
            "client_phone"=>I("client_phone"),
            //"contract_start_date"=>I('contract_start_date'),
            //"contract_end_date"=>I("contract_end_date"),
            "area"=>$area,
            "area_responsible"=>$area_responsible,
            "sale_responsible"=>$sale_responsible,
            "remark"=>I("remark"),
            "user_id"=>$user['id'],
            "is_deleted"=>1,
            "domains"=>I("domains")
        );

        $json = http_post(C('STORM_CENTER_PATH')."/security/whitelist/insert",$params,"json");
        $result['code']= $json[code];
        $result['msg']= $json[msg];
        $this->ajaxReturn($result);
    }

    public function queryWhiteList(){
        $user=session("user");
        //dump($user);
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        $client_no = I('groupName');
        if($client_no != ""){
            $param['client_no']= "%".$client_no."%";
        }
        $is_deleted = I('is_deleted');
        //dump("=========================".$is_deleted);
        if($is_deleted && $is_deleted != ""){
            $param['is_deleted'] = $is_deleted;
        }
        $start = (I('currentpage') - 1) * I('limit');
        $limit = I('limit');
        $param['start'] = $start;
        $param['limit'] = $limit;
        $param['user_id'] = $user['id'];
        $json = http_post(C('STORM_CENTER_PATH')."/security/whitelist/query", $param,'json');
        if($json['code']){
            $result['code']=1;
            $result['total'] = $json['total'];
            $result['rows'] = $json['items'];
        }
        $this->ajaxReturn($result);
    }

    /**
     * 删除合同
     */
    public function delete(){
        $param['ids']=I('ids');
        $json = http_post(C('STORM_CENTER_PATH')."/security/whitelist/delete", $param,'json');
        if($json['code']){
            $result['code'] = 1;
            $result['msg'] = '删除成功';
        } else {
            $result['code'] = 0;
            $result['msg'] = '删除失败';
        }
        $this->ajaxReturn($result);
    }

    /**
     * 获取该域名是否为公司合同用户
     */
    public function hadWhiteList(){
        $data = I('curData');
        $param['domains'] = $data['site_domain'];
        $json = http_post(C('STORM_CENTER_PATH')."/security/whitelist/hadWhiteList", $param,'json');
        if($json['code']){
            $result['code'] = 1;
            $result['msg'] = '合同用户';
            $result['other'] = $json['other'];
        } else {
            $result['code'] = 0;
            $result['msg'] = '非合同用户';
        }
        //dump($result);
        $this->ajaxReturn($result);
    }

} 