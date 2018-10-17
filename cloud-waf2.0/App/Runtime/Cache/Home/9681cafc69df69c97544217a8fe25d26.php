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






</head>
<body class="fixed-sidebar full-height-layout gray-bg" style="overflow:hidden">
    <div id="wrapper">
        <!--左侧导航开始-->
        <nav class="navbar-default navbar-static-side maxture" role="navigation">
            <div class="nav-close"><i class="fa fa-times-circle"></i></div>
            <div class="sidebar-collapse">
                <ul class="nav" id="side-menu">
                    <li class="nav-header">
                        <div class="dropdown profile-element text-center">
                            <span><img alt="image" class="img-circle" src="/cloud-waf2.0/Public/asset/img/user.jpg" /></span>
                            <a data-toggle="dropdown" class="dropdown-toggle" href="#">
                                <span class="clear">
                                    <span class="block m-t-xs"><strong class="font-bold"><?php echo ($user["username"]); ?></strong></span>
                                    <span class="text-muted text-xs block"><?php echo ($user["name"]); ?><b class="caret"></b></span>
                                </span>
                            </a>
                            <ul class="dropdown-menu animated fadeInRight m-t-xs">
                                <li>
                                    <!--<a class="" href="/cloud-waf2.0/index.php/Admin/Index/index" >主菜单</a>-->
                                    <a class="J_menuItem" href="/cloud-waf2.0/index.php/Admin/Setting/index" >个人设置</a>
                                </li>

                                <li class="divider"></li>
                                <li><a href="/cloud-waf2.0/index.php/Admin/Login/logout" tppabs="/cloud-waf2.0/index.php/Admin/Login/logout">安全退出</a>
                                </li>
                            </ul>
                        </div>
                        <div class="logo-element">移动综分系统</div>
                    </li>
                    <li>
                        <a class="J_menuItem" href="/cloud-waf2.0/index.php/<?php echo ($pMenu["name"]); ?>" data-index="8">
                            <i class="fa fa-home"></i>
                            <span class="nav-label">首页</span>
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void (0);">
                            <i class="fa fa-cogs"></i>
                            <span class="nav-label">系统管理</span>
                            <span class="fa arrow"></span>
                        </a>
                        <ul class="nav nav-second-level collapse " aria-expanded="true" style="">
                            <li>
                                <a class="J_menuItem" href="/cloud-waf2.0/index.php/<?php echo ($cMenu["name"]); ?>" data-index="56"><i class="fa fa-user"></i>用户管理</a>
                            </li>
                            <li>
                                <a class="J_menuItem" href="/cloud-waf2.0/index.php/<?php echo ($cMenu["name"]); ?>" data-index="56"><i class="fa fa-users"></i>角色管理</a>
                            </li>
                            <li>
                                <a class="J_menuItem" href="/cloud-waf2.0/index.php/<?php echo ($cMenu["name"]); ?>" data-index="56"><i class="fa fa-menu"></i>菜单管理</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
        <!--左侧导航结束-->
        <div id="page-wrapper" class="gray-bg dashbard-1">
            <div class="row border-bottom maxture">
                <nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0">
                    <div class="navbar-header">
                        <!--<a class="navbar-return-prev minimalize-styl-2 btn btn-primary " href="#"><i class="fa fa-mail-reply"></i> </a>-->
                        <a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="#"><i class="fa fa-bars"></i> </a>
                        <div role="search" class="navbar-form-custom" method="post" action="#">
                            <div class="form-group">
                                <input type="text" placeholder="请输入您需要查找的内容 …" class="form-control" name="top-search" id="top-search">
                            </div>
                        </div>
                    </div>
                    <ul class="nav navbar-top-links navbar-right">

                        <li class="dropdown">
                            <a class="dropdown-toggle count-info" data-toggle="dropdown" href="#">
                                <i class="fa fa-bell"></i> <span class="label label-primary">0</span>
                            </a>
                            <ul class="dropdown-menu dropdown-alerts">
                                <li>
                                    <a href="javascript:void(0);" tppabs="">
                                        <div>
                                            <i class="fa fa-envelope fa-fw"></i> 您有0条未读消息
                                            <span class="pull-right text-muted small">
                                                <!--4分钟前-->
                                            </span>
                                        </div>
                                    </a>
                                </li>
                                <!--<li class="divider"></li>-->

                            </ul>
                        </li>
                        <!--<li class="hidden-xs">-->
                            <!--<a href="#"  class="J_menuItem" data-index="0"><i class="fa fa-cart-arrow-down"></i>主题</a>-->
                        <!--</li>-->
                        <li class="dropdown hidden-xs">
                            <a class="right-sidebar-toggle J_menuItem" aria-expanded="false"  href="/cloud-waf2.0/index.php/Home/WorkSpace/index">
                                <i class="fa fa-tasks"></i> 工作台
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div class="row content-tabs maxture">
                <button class="roll-nav roll-left J_tabLeft"><i class="fa fa-backward"></i>
                </button>
                <nav class="page-tabs J_menuTabs">
                    <div class="page-tabs-content">
                        <a href="javascript:;" class="active J_menuTab" data-id="/cloud-waf2.0/index.php/<?php echo ($user["firstAction"]); ?>"><?php echo ($user["firstActionName"]); ?></a>
                    </div>
                </nav>
                <button class="roll-nav roll-right J_tabRight"><i class="fa fa-forward"></i>
                </button>
                <div class="btn-group roll-nav roll-right">
                    <button class="dropdown J_tabClose" data-toggle="dropdown">关闭操作<span class="caret"></span>

                    </button>
                    <ul role="menu" class="dropdown-menu dropdown-menu-right">
                        <li class="J_tabShowActive"><a>定位当前选项卡</a>
                        </li>
                        <li class="divider"></li>
                        <li class="J_tabCloseAll"><a>关闭全部选项卡</a>
                        </li>
                        <li class="J_tabCloseOther"><a>关闭其他选项卡</a>
                        </li>
                    </ul>
                </div>
                <a href="/cloud-waf2.0/index.php/Admin/Login/logout"  class="roll-nav roll-right J_tabExit"><i class="fa fa-sign-out"></i> 退出</a>
            </div>
            <div class="row J_mainContent" id="content-main">
                <iframe class="J_iframe" name="iframe0" width="100%" height="100%" src="/cloud-waf2.0/index.php/<?php echo ($user["firstAction"]); ?>" data-id="/cloud-waf2.0/index.php/<?php echo ($user["firstAction"]); ?>" frameborder="0"  seamless></iframe>
            </div>
            <div class="footer maxture">
                <div class="pull-right">&copy; 2008-2016 <a href="http://www.dbappsecurity.com.cn/"  target="_blank">XXXX技术有限公司</a>
                </div>
            </div>
        </div>
    </div>


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
    <script>
         var href=location.href;
         if(href.indexOf("Home/Index/index")==-1){
             console.info(href);
             location.href=__WEBROOT__+"/Home/Index/index";
         }
//         var p='<a href="javascript:;" class="active J_menuTab" data-id="first"> 首页<i class="fa fa-times-circle"></i></a>';
//         $(".J_menuTabs .page-tabs-content").append(p);
//        $(".J_menuItem").bind("click", function(){
//            if($(this).attr("target") == "_blank"){
//                window.open($(this).attr("href"));
//                return false;
//            }else{
//                return true;
//            }
//        });
    </script>
</body>

</html>