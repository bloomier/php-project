<?php
namespace app\index\controller;
use app\test\model\Category as CategoryModel;
use Firebase\JWT\JWT;

class Index
{
    public function index()
    {
        return json("interface API");
    }
    

}
