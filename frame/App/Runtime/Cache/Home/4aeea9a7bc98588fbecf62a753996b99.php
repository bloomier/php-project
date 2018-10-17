<?php if (!defined('THINK_PATH')) exit();?>
<!DOCTYPE html>
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






    <link href="/frame/Public/asset/js/plugins/zTree_v3/css/metroStyle/metroStyle.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="/frame/Public/asset/js/plugins/zTree_v3/css/demo.css" type="text/css">
    <link rel="stylesheet" href="/frame/Public/asset/js/plugins/zTree_v3/css/zTreeStyle/zTreeStyle.css" type="text/css">
    <link rel="stylesheet" href="/frame/Public/asset/js/plugins/dialog/bootstrap-dialog.min.css" type="text/css">


    <style>
        table.dataTable tbody tr.selected {
            background-color: #b0bed9;
        }

        .login-dialog .modal-dialog {
            width: 150px;
        }
    </style>
</head>
<body class="gray-bg">
<div class="wrapper wrapper-content animated fadeInRight">
    <input type="hidden" id="public_id" value="/frame/Public">
    <div class="row">
        <div class="col-sm-12">
            <div class="ibox">
                <div class="ibox-title">
                    <h5>首页 >> 树示例</h5>
                    <div class="ibox-tools">
                        <a class="collapse-link">
                            <i class="fa fa-chevron-up"></i>
                        </a>
                    </div>
                </div>
                <div class="ibox-content">
                    <a class="btn btn-sm  btn-primary  btn-add" href="javascript:void(0)"><i class="fa fa-plus"></i>&nbsp;添加节点</a>
                    <a class="btn btn-sm  btn-danger btn-delete" href="javascript:void(0)"><i class="fa fa-trash"></i>&nbsp;添加删除</a>
                    <a class="btn btn-sm  btn-success btn-alert" href="javascript:void(0)"><i class="fa fa-trash"></i>&nbsp;弹框选择</a>
                    <ul id="treeDemo" class="ztree"></ul>
                </div>
            </div>
        </div>
    </div>
</div>

<div class='role-dialog-content' style="display: none;">
    <form class="form-horizontal" id="roleForm" action="#" data-parsley-validate>
        <!--<div class="form-group">-->
        <!--<label  class="col-sm-3 control-label"><span style="color: red">*</span>角色名称</label>-->
        <!--<div class="col-sm-9">-->
        <!--<input type="text" class="form-control" name="name" required data-parsley-length="[2, 20]" >-->
        <!--</div>-->
        <!--</div>-->
        <div class="form-group">
            <label  class="col-sm-2 control-label" style="text-align:right;padding-right: 2px;"><span style="color: red" style="text-align:right;">*</span>IP组：</label>
            <div class="col-sm-10" style="padding-left: 5px;">
                <ul id="ztree" class="ztree" style="width: 98%;"></ul>
            </div>
        </div>
    </form>
</div>



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
<script type="text/javascript" src="/frame/Public/asset/js/plugins/zTree_v3/js/jquery.ztree.core.js"></script>
<script type="text/javascript" src="/frame/Public/asset/js/plugins/zTree_v3/js/jquery.ztree.excheck.js"></script>
<script type="text/javascript" src="/frame/Public/asset/js/plugins/zTree_v3/js/jquery.ztree.exedit.js"></script>

<script type="text/javascript" src="/frame/Public/asset/js/plugins/dialog/bootstrap-dialog.min.js"></script>

<script type="text/javascript" src="/frame/Public/script/Home/Tree/tree.js"></script>
</body>
</html>