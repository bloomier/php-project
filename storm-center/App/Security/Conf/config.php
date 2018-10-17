<?php
    $dealConfig = array(

        'DEAL_STATE' => array('请选择'=>'','登记'=>'0','审核'=>'1','通报'=>'2','修复'=>'3')



);


$contractConfig = array(
    "CONTRACT_AREA" => array(
        "请选择"=>array(
            "SALE_RESPONSIBLE"=>"",
            "AREA_RESPONSIBLE"=>""
        ),
        "上海办"=>array(
            "SALE_RESPONSIBLE"=>"刘德华0,张学友0,黎明0,郭富城0",
            "AREA_RESPONSIBLE"=>"andyLua0,zhangxueyou0,liming0,guofucheng0"
        ),
        "武汉办"=>array(
            "SALE_RESPONSIBLE"=>"刘德华1,张学友1,黎明1,郭富城1",
            "AREA_RESPONSIBLE"=>"andyLua1,zhangxueyou1,liming1,guofucheng1"
        ),
        "南京办"=>array(
            "SALE_RESPONSIBLE"=>"刘德华2,张学友2,黎明2,郭富城2",
            "AREA_RESPONSIBLE"=>"andyLua2,zhangxueyou2,liming2,guofucheng2"
        ),
        "北京办"=>array(
            "SALE_RESPONSIBLE"=>"刘德华3,张学友3,黎明3,郭富城3",
            "AREA_RESPONSIBLE"=>"andyLua3,zhangxueyou3,liming3,guofucheng3"
        ),
    )
);


return array_merge($dealConfig,$contractConfig);