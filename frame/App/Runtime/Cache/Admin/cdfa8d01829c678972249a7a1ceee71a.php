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

<link rel="icon" href="/cloud-waf2.0/Public/asset/img/fav.png" type="image/x-icon">
<link rel="shortcut icon" href="/cloud-waf2.0/Public/asset/img/fav.png" type="image/x-icon">

<link rel="shortcut icon" href="#">
<link href="/cloud-waf2.0/Public/asset/js/plugins/bootstrap/bootstrap.min.css" rel="stylesheet">
<link href="/cloud-waf2.0/Public/asset/css/font-awesome.min.css" rel="stylesheet">
<link href="/cloud-waf2.0/Public/asset/css/animate.min.css" rel="stylesheet">
<link href="/cloud-waf2.0/Public/asset/css/style.min.css" rel="stylesheet">
<link href="/cloud-waf2.0/Public/asset/css/chosen.css" rel="stylesheet">

    <!--plugins begin-->
<link href="/cloud-waf2.0/Public/asset/js/plugins/dataTables/dataTables.bootstrap.css" rel="stylesheet">
<link href="/cloud-waf2.0/Public/asset/js/plugins/sweetalert/sweetalert.css"  rel="stylesheet">
<link href="/cloud-waf2.0/Public/asset/js/plugins/iCheck/iCheck.css"  rel="stylesheet">
<link href="/cloud-waf2.0/Public/asset/js/plugins/sweetalert/sweetalert.css" ref="stylesheet" type="text/css">
<link href="/cloud-waf2.0/Public/asset/js/plugins/parsley/parsley.css" ref="stylesheet" type="text/css">
<link href="/cloud-waf2.0/Public/asset/js/plugins/select2/select2.css" rel="stylesheet" type="text/css">
    <!--plugins end-->
<link rel="stylesheet" href="/cloud-waf2.0/Public/asset/css/common.css" >
<link rel="stylesheet" href="/cloud-waf2.0/Public/asset/css/app.css" >
<input id="publicPath" type="hidden" value="/cloud-waf2.0/Public">
<input id="rootPath" type="hidden" value="/cloud-waf2.0/index.php">
<input id="pathInfo" type="hidden" value="<?php echo ($pathInfo); ?>">






    <link href="/cloud-waf2.0/Public/asset/js/plugins/zTree_v3/css/metroStyle/metroStyle.css" rel="stylesheet" type="text/css" />

</head>
<body class="gray-bg">
<div class="wrapper wrapper-content animated fadeInRight">
    <div class="row">
        <div class="col-sm-12">
            <div class="ibox">
                <div class="ibox-title">
                    <h5>IP黑名单列表</h5>
                    <div class="ibox-tools">
                        <a class="collapse-link">
                            <i class="fa fa-chevron-up"></i>
                        </a>
                    </div>
                </div>
                <div class="ibox-content">
                    <table id="ip_table" class="table table-striped table-bordered table-hover dataTables-example" style="width: 100%;" >
                        <thead  style="text-align: center">
                        <tr>
                            <th>IP</th>
                            <th>登录名</th>
                            <th>开始时间</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        </thead>
                        <tbody></tbody>
                    </table>

                </div>
            </div>
        </div>
    </div>
</div>

<!--<div class="main">-->
    <!--<div class="m-inner">-->

        <!--<div class="widget">-->
            <!--<div class="widget-heading">-->
                <!--<div class="widget-title">IP黑名单列表</div>-->
            <!--</div>-->
            <!--<table class="u-grid" id="ip_table11">-->
                <!--<thead  style="text-align: center">-->
                <!--<tr>-->
                    <!--<th>IP</th>-->
                    <!--<th>登录名</th>-->
                    <!--<th>操作</th>-->
                <!--</tr>-->
                <!--</thead>-->
                <!--<tbody></tbody>-->
            <!--</table>-->
        <!--</div>-->
    <!--</div>-->


<!--</div>-->




<script src="/cloud-waf2.0/Public/asset/js/jquery/jquery.min.js" ></script>
<script src="/cloud-waf2.0/Public/asset/js/jquery/jquerycookie.js" ></script>
<script src="/cloud-waf2.0/Public/asset/js/plugins/bootstrap/bootstrap.min.js" ></script>
<script src="/cloud-waf2.0/Public/asset/js/plugins/metisMenu/jquery.metisMenu.js"></script>
<script src="/cloud-waf2.0/Public/asset/js/plugins/slimscroll/jquery.slimscroll.min.js"></script>

<script src="/cloud-waf2.0/Public/asset/js/common/content.min.js"></script>
<script src="/cloud-waf2.0/Public/asset/js/plugins/pace/pace.min.js"></script>
<script src="/cloud-waf2.0/Public/asset/js/common/contabs.js"></script>
        <!--plugins begin-->
<script src="/cloud-waf2.0/Public/asset/js/plugins/dataTables/jquery.dataTables.min.js"></script>
<script src="/cloud-waf2.0/Public/asset/js/plugins/dataTables/dataTables.bootstrap.js"></script>
<script src="/cloud-waf2.0/Public/asset/js/plugins/dataTables/dataTables.ext.js"></script>
<script src="/cloud-waf2.0/Public/asset/js/plugins/sweetalert/sweetalert.min.js"></script>
<script src="/cloud-waf2.0/Public/asset/js/plugins/iCheck/icheck.min.js"></script>
<script src="/cloud-waf2.0/Public/asset/js/plugins/parsley/parsley.js"></script>
<script src="/cloud-waf2.0/Public/asset/js/plugins/select2/select2.js"></script>

        <!--plugins end-->
<script src="/cloud-waf2.0/Public/script/main.js"></script>
<script src="/cloud-waf2.0/Public/asset/js/common/app.js" ></script>
<script type="text/javascript" src="/cloud-waf2.0/Public/asset/js/plugins/cityselector/jquery.cityselect.js"></script>
<script type="text/javascript" src="/cloud-waf2.0/Public/asset/js/plugins/dialog/bootstrap-dialog.min.js"></script>

<script type="text/javascript" src="/cloud-waf2.0/Public/script/Admin/black_ip.js"></script>

</body>
</html>