<?php
namespace Admin\Controller;
use Think\Controller;
use Think\Model;

class TestController extends Controller {
    public function index(){
        echo get_client_ip();

    }

}