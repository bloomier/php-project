<?php
namespace Base\Controller;
use Admin\Controller\BaseController;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;

/**
 * Class OptionsLogController
 * @package Base\Controller
 * 操作日志
 */
class OptionsLogController extends BaseController {


    /**  进入列表 */
    public function index(){
        $this->display("optionsLog");
    }


    /** 获取列表直接（从本地库获取） */
    public function getList(){
        $md = new AutoIncrementModel(Constants::$DB_LOG_OPT);
        $list = $md->where(array(type=>2))->select();
        //$list = $md->select();
        $items = array();
        $userList = $this->listUser();
        foreach($list as $k=>$row){
            $row['username'] = $userList[$row['uid']] ? $userList[$row['uid']] : "";
            //echo $userList[$row['uid']].";;;".$row['uid']."<br/>";
            $items[]=$row;
        }
        //$this->ajaxReturn($result);

        $ret['recordsTotal']= count($items);
        $ret['recordsFiltered'] = count($items);
        $ret['items'] = array_values($items);
        $this->ajaxReturn($ret);
    }

    private function listUser(){
        //header("Content-Type: text/html; charset=utf-8");
        $model=new AutoIncrementModel(Constants::$DB_AUTH_USER);
        //$map['username'] = array('$exists'=>true, '$not'=>array('$in'=>array("dbapp")) );
        $users = $model->field("_id,username,name,email")->select();//->where($map)
        $list = array();
        foreach($users as $k=>$row){
            $list[$row['_id'].""] = $row['name']."(".$row['username'].")";
        }
        return $list;
    }


}