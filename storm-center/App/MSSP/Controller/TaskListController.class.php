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

/**
 * 客户列表
 * Class ContractController
 * @package MSSP\Controller
 */
class TaskListController extends Controller {

    public function index(){
        $this->display("index");
    }
}