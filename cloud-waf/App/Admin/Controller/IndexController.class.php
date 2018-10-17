<?php
namespace Admin\Controller;
use Think\Controller;
use Think\Hook;


class IndexController extends Controller {


    public function about(){
        $version="未知";
        if(is_file("SVN_Build_REV")){
            $version=file_get_contents("SVN_Build_REV");
        }
        $this->show("version:".$version, 'utf-8', 'text/html');
    }

}