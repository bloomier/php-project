<?php
/**
 * Created by PhpStorm.
 * User: ah
 * Date: 2015/7/15
 * Time: 14:35
 */

namespace MSSP\Controller;
use Home\Controller\BaseController;
use Think\Controller;
use Think\Model;

/**
 * 合同
 * Class ContractController
 * @package MSSP\Controller
 */
class ContractController extends BaseController {

    /**合同首页**/
    // 列出所有合同信息
    public function index(){
        //合同状态统计
        $data = http_post(C('STORM_CENTER_PATH')."/mssp/msspContract/contractStateCount", null,'json');
        if($data['code']){
            $this->assign("contract_state", urlencode(json_encode($data['other'])));
        }

        // 套餐统计
        $data = http_post(C('STORM_CENTER_PATH')."/mssp/msspContract/contractPackagesCount", null,'json');
        if($data['code']){
            $this->assign("contract_packages", urlencode(json_encode($data['other'])));
        }
        $this->listAllCustomer();// 列出所有客户
        $this->display("index");
    }

    // 查询合同
    public function listContract(){
        $result=array("code"=>0,"total"=>0,"rows"=>array());
        $start = (I('currentpage') - 1) * I('limit');
        $limit = I('limit');
        $param['start'] = $start;
        $param['limit'] = $limit;
        if(I('param')){
            $param['name'] =I('param');
        }
        if(I('state')){
            $state=I('state')==2?0:I('state');
            $param['state']=$state;
        }
        $data = http_post(C('STORM_CENTER_PATH')."/mssp/msspContract/mixQuery", $param,'json');
        if($data['code']){
            $result['code']=1;
            $result['total'] = $data['total'];
            $result['rows'] = $data['items'];
        }
        $this->ajaxReturn($result);
    }

    public function toUpdate(){
        $contactInfo = http_post(C('STORM_CENTER_PATH')."/mssp/msspContract/queryOneContractInfo", array("id"=>I("id")), "json");
        if($contactInfo['code']){
            $tmp = $contactInfo['other'];
            $this->assign("contractInfoSrc", urlencode(json_encode($tmp['contractInfo'])));
            $this->assign("domainListSrc", urlencode(json_encode($tmp['domainList'])));
            $this->assign("alertListSrc", urlencode(json_encode($tmp['alertList'])));
        }
        $this->toAdd();
    }

    // 修改合同信息
    public function update(){
        $alertUser = $this->addContactList();
        $param = $this->initContactParam();
        $param['alertUser'] = json_encode($alertUser);
        $param['id'] = I('id');
        $result = http_post(C('STORM_CENTER_PATH')."/mssp/msspContract/update", $param, 'json');
        $this->ajaxReturn($result);
    }

    /**合同添加**/
    // 进入添加
    public function toAdd(){
        // 将所有pm返回到页面
        $this->listUser();
        // 获取策略组
        $this->listPolicyGroup();
        // 获取节点
        $this->queryNode();
        // 列出所有合同用户&&关注人
        $this->listAllContactUser();
        // 列出所有销售人员
        $this->listSaler();
        // 列出所有客户信息
        $this->listAllCustomer();
        $this->display("edit");
    }

    // 添加合同
    public function addContract(){
        $alertUser = $this->addContactList();
        $param = $this->initContactParam();
        $param['alertUser'] = json_encode($alertUser);
        $result = http_post(C('STORM_CENTER_PATH')."/mssp/msspContract/insert", $param, 'json');
        $this->ajaxReturn($result);
    }

    /**查看合同详情**/
    // 查看合同详细信息
    public function detail(){
        $contactInfo = http_post(C('STORM_CENTER_PATH')."/mssp/msspContract/queryOneContractInfo", array("id"=>I("id")), "json");
        if($contactInfo['code']){
            $tmp = $contactInfo['other'];
            $this->assign("contractBaseDataSrc", urlencode(json_encode($tmp['contractInfo'])));
            $this->assign("contractBaseData", $tmp['contractInfo']);
            $this->assign("contractDomainListSrc", urlencode(json_encode($tmp['domainList'])));
            $this->assign("contractContactListSrc", urlencode(json_encode($tmp['alertList'])));
        }
        // 列出所有合同用户&&关注人
        $this->listAllContactUser();
        $this->display("detail");
    }

    // 查询所有PM
    private function listUser(){
        $model=M("user");
        $users=$model->field("id,username,name")->select();
        $this->assign("pmlist", urlencode(json_encode($users)));
    }

    // 查询所有策略组
    private function listPolicyGroup(){
        $param['enable'] = 1;
        // 获取策略组
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataGroupPolicy/query", $param,'json');
        if($data['code']){
            $this->assign("policy_group",$data['items']);
        }
    }

    // 查询所有节点
    private function queryNode(){
        // 获取节点信息
        $data = http_post(C('STORM_CENTER_PATH')."/optcenter/bigdataNode/query", array(),'json');
        if($data['code']){
            $this->assign("nodes",$data['items']);
        }
    }

    // 列出所有用户
    private function listAllContactUser(){
        $model=new  Model();
        $query=array("user.role_id = role.id AND (role.id=1000 OR is_follow=1)");
        $users=$model->table(array(
            C('DB_PREFIX').'user'=>'user',
            C('DB_PREFIX').'role'=>'role'
        ))->where($query)
            ->field("user.id,user.username,user.name,user.email,user.login_type,role.name role_name,user.expired_date,user.is_lock,user.remark,user.is_follow")->select();
        $this->assign("contactList", urlencode(json_encode($users)));

    }

    // 添加合同联系人
    private function addContactList(){
        $result = array();
        $contactList = I("contactList");
        $contactList = json_decode(str_replace("&quot;","\"", $contactList), true);
        for($i = 0; $i < count($contactList); $i++){
            $tmp = $contactList[$i];
            $tmpAlert = array("warning_type"=>$tmp['alertType'], "user_id"=>0);
            if($tmp['telephone']){
                $user=M('user');
                $rows=$user->where(array("username"=>$tmp['telephone']))->find();
                $user->name=$tmp['username'];
                $user->email=$tmp['email'];
                if($rows){
                    $user->where(array("username"=>$tmp['telephone']))->save();
                    $tmpAlert['user_id'] = $rows['id'];
                }else{
                    $user->role_id=1000;
                    $user->username=$tmp['telephone'];
                    $user->password=md5('dbapp@123');
                    $user->remark=$tmp['remark'];
                    $tmpAlert['user_id']=$user->add();
                }
                $result[] = $tmpAlert;
            }
        }
        return $result;
    }

    // 合同参数组装
    private function initContactParam(){
        $param = array();
        $param['number'] = I("contract_id");
        $param['name'] = I("contract_name");
        $param['customer_id'] = I("customer_name");
        $param['start_time'] = I("contract_begin");
        $param['end_time'] = I("contract_end");
        $param['pm_id'] = I("contract_pm");
        $param['saler_id'] = I("contract_saler");
        $param['packages'] = I("packages");
        $param['domainList'] = I("domainList");
        if(1&$param['packages']){
            $param['webscan_params'] = I('webscan_params');
        }
        if(8&$param['packages']){
            $param['securityscan_params'] = I("securityscan_params");
        }
        return $param;
    }

    // 列出所有销售人员
    private function listSaler(){
        $data = http_post(C('STORM_CENTER_PATH')."/mssp/msspSaler/query", null,'json');
        if($data['code']){
            $this->assign("salers", urlencode(json_encode($data['items'])));
        }
    }

    // 列出所有客户人员
    private function listAllCustomer(){
        $data = http_post(C('STORM_CENTER_PATH')."/mssp/msspCustomer/query", array("state"=>1),'json');
        if($data['code']){
            $this->assign("customerSrc", urlencode(json_encode($data['items'])));
        }
    }

    /**
     * 批量删除
     */
    public function beatchDelete(){
        $param['ids'] = I('ids');
        $data = http_post(C('STORM_CENTER_PATH')."/mssp/msspContract/beatchDelContract", $param,'json');
        if($data['code']){
            $this->ajaxReturn(array("code"=>1,"msg"=>"删除成功"));
        }else{
            $this->ajaxReturn(array("code"=>2,"msg"=>"请勾选删除行"));
        }
    }

    public function sendUrlEmail(){
        $param['domain'] = I("domainUrl");
        $param['contact'] = I("contactList");
        $json = http_post(C("STORM_CENTER_PATH")."/mssp/MsspContractDailyUrl/sendEmail", $param,'json');
        return $json;
    }

    public function generateUrl(){
        $result = array("code"=>0, "urlList"=>array(),"userList"=>array(),"contract_id"=>0);
        $param = array("contract_id"=>I('contract_id'), "packages_id"=>0);
        $result['contract_id'] = I('contract_id');
        $json = http_post(C("STORM_CENTER_PATH")."/mssp/msspContractDailyUrl/generate", $param, 'json');
        if($json['code']){
            $result['code'] = 1;
            $result['urlList'] = $json['other']['url'][I('contract_id')];
            $tmpList = $this->initContactList($json['other']['contact']);
            $result['userList'] = $tmpList;
        }
        $this->ajaxReturn($result);
    }

    private function initContactList($userList){
        $ids = array();
        for($i = 0; $i < count($userList); $i++){
            $tmp = $userList[$i];
            $ids[] = $tmp['user_id'];
        }
        $user = M("user");
        $where['id'] = array("in", $ids);
        $contactList = $user->where($where)->field("email")->select();
        return $contactList;
    }

}