<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="renderer" content="webkit">
<meta http-equiv="Cache-Control" content="no-siteapp" />
<title>XXX-title</title>
<meta name="keywords" content="">
<meta name="description" content="">

<!--[if lt IE 9]>
<meta http-equiv="refresh" content="0;ie.html" />
<![endif]-->

<link rel="icon" href="/frame/Public/asset/img/fav.png" type="image/x-icon">
<link rel="shortcut icon" href="/frame/Public/asset/img/fav.png" type="image/x-icon">

<link rel="shortcut icon" href="#">
<link href="/frame/Public/asset/js/plugins/bootstrap/bootstrap.min.css" rel="stylesheet">
<link href="/frame/Public/asset/css/font-awesome.min.css" rel="stylesheet">
<link href="/frame/Public/asset/css/animate.min.css" rel="stylesheet">
<link href="/frame/Public/asset/css/style.min.css" rel="stylesheet">
<link href="/frame/Public/asset/css/chosen.css" rel="stylesheet">

    <!--plugins begin-->
<link href="/frame/Public/asset/js/plugins/dataTables/dataTables.bootstrap.css" rel="stylesheet">
<link href="/frame/Public/asset/js/plugins/sweetalert/sweetalert.css"  rel="stylesheet">
<link href="/frame/Public/asset/js/plugins/iCheck/iCheck.css"  rel="stylesheet">
<link href="/frame/Public/asset/js/plugins/sweetalert/sweetalert.css" ref="stylesheet" type="text/css">
<link href="/frame/Public/asset/js/plugins/parsley/parsley.css" ref="stylesheet" type="text/css">
<link href="/frame/Public/asset/js/plugins/select2/select2.css" rel="stylesheet" type="text/css">
    <!--plugins end-->
<link rel="stylesheet" href="/frame/Public/asset/css/common.css" >
<link rel="stylesheet" href="/frame/Public/asset/css/app.css" >
<input id="publicPath" type="hidden" value="/frame/Public">
<input id="rootPath" type="hidden" value="/frame/index.php">
<input id="pathInfo" type="hidden" value="<?php echo ($pathInfo); ?>">







    <style>
       
    </style>
</head>

<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight">
        <div class="row">
            <div class="col-sm-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h5>基本 <small>分类，查找</small></h5>
                        <div class="ibox-tools">
                            <a class="collapse-link">
                                <i class="fa fa-chevron-up"></i>
                            </a>
                            <a class="dropdown-toggle" data-toggle="dropdown" href="table_data_tables.html#">
                                <i class="fa fa-wrench"></i>
                            </a>
                            <ul class="dropdown-menu dropdown-user">
                                <li><a href="table_data_tables.html#">选项1</a>
                                </li>
                                <li><a href="table_data_tables.html#">选项2</a>
                                </li>
                            </ul>
                            <a class="close-link">
                                <i class="fa fa-times"></i>
                            </a>
                        </div>
                    </div>
                    <div class="ibox-content">
                    <table id="waf_site_table" class="table table-striped table-bordered table-hover dataTables-example" style="width: 100%;">
                    	<thead  style="text-align: center">
		                    <tr>
		                        <th width="20%">id</th>
		                        <th  width="20%">编号</th>
		                        <th  width="20%">名称</th>
		                        <th  width="20%">帐号</th>
		                        <th  width="20%">联系地址</th>
		                    </tr>
		                </thead>
                        <tbody></tbody>
                    </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
<script src="/frame/Public/asset/js/jquery/jquery.min.js" ></script>
<script src="/frame/Public/asset/js/jquery/jquerycookie.js" ></script>
<script src="/frame/Public/asset/js/plugins/bootstrap/bootstrap.min.js" ></script>
<script src="/frame/Public/asset/js/plugins/metisMenu/jquery.metisMenu.js"></script>
<script src="/frame/Public/asset/js/plugins/slimscroll/jquery.slimscroll.min.js"></script>

<script src="/frame/Public/asset/js/common/content.min.js"></script>
<script src="/frame/Public/asset/js/plugins/pace/pace.min.js"></script>
<script src="/frame/Public/asset/js/common/contabs.js"></script>
        <!--plugins begin-->
<script src="/frame/Public/asset/js/plugins/dataTables/jquery.dataTables.min.js"></script>
<script src="/frame/Public/asset/js/plugins/dataTables/dataTables.bootstrap.js"></script>
<script src="/frame/Public/asset/js/plugins/dataTables/dataTables.ext.js"></script>
<script src="/frame/Public/asset/js/plugins/sweetalert/sweetalert.min.js"></script>
<script src="/frame/Public/asset/js/plugins/iCheck/icheck.min.js"></script>
<script src="/frame/Public/asset/js/plugins/parsley/parsley.js"></script>
<script src="/frame/Public/asset/js/plugins/select2/select2.js"></script>

        <!--plugins end-->
<script src="/frame/Public/script/main.js"></script>
<script src="/frame/Public/asset/js/common/app.js" ></script>
<script type="text/javascript" src="/frame/Public/script/Home/Tree/table.js"></script>