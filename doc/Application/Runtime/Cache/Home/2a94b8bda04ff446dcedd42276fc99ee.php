<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title><?php echo ($item["item_name"]); ?> ShowDoc</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <link href="/doc/Public/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <style type="text/css">
    @charset "utf-8";
	body {
		font:14px/1.5 "Microsoft Yahei","微软雅黑",Tahoma,Arial,Helvetica,STHeiti;
	}
    </style>
      <script type="text/javascript">
      var DocConfig = {
          host: window.location.origin,
          app: "<?php echo U('/');?>",
          pubile:"/doc/Public",
      }

      DocConfig.hostUrl = DocConfig.host + "/" + DocConfig.app;
      </script>

  </head>
  <body>
<link rel="stylesheet" href="/doc/Public/css/index.css" />

    <div class="container-narrow">

      <div class="masthead">
        <ul class="nav nav-pills pull-right">
          <?php if($login_user): ?><li ><a href="<?php echo U('Home/Item/index');?>">我的项目</a></li>
            <?php else: ?>
            <li ><a href="<?php echo U('Home/User/login');?>">登录/注册</a></li><?php endif; ?>
          
        </ul>
        <h3 class="muted">ShowDoc</h3>
      </div>

      <hr>

		<div id="myCarousel" class="carousel slide">
		   <!-- 轮播（Carousel）指标 -->
		   <ol class="carousel-indicators">
		      <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
		      <li data-target="#myCarousel" data-slide-to="1"></li>
		      <li data-target="#myCarousel" data-slide-to="2"></li>
		   </ol>   
		   <!-- 轮播（Carousel）项目 -->
		   <div class="carousel-inner">
		      <div class="item active">
		         <img src="/doc/Public/img/pic1.jpg" alt="First slide">
		      </div>
		      <div class="item">
		         <img src="/doc/Public/img/pic2.jpg" alt="Second slide">
		      </div>
 		      <div class="item">
		         <img src="/doc/Public/img/pic3.jpg" alt="Third slide">
		      </div>
		   </div>
		   <!-- 轮播（Carousel）导航 -->
		   <a class="carousel-control left" href="#myCarousel" 
		      data-slide="prev">&lsaquo;</a>
		   <a class="carousel-control right" href="#myCarousel" 
		      data-slide="next">&rsaquo;</a>
		</div>
<!-- 		<p class="lead " > 
			<small>
				ShowDoc是一个在线文档编辑与展示的网站。通过它，你可以上天入地无所不能，前无古人后无来者，顶天立地无所畏惧，八仙归海众神归位，排山倒海浩浩荡荡，从此你再也不用担心吃药的时候没有勺子，也不用担心打字的时候没有墨鱼，一切尽在你的掌控之中。去吧比卡丘！让那些愚蠢的人类都亮瞎眼！！！
			</small>
		</p> -->
		<p class="text-center">
			<!--<a class="btn btn-primary  btn-large" href="<?php echo U('Home/item/show').'?item_id=2';?>" target="_blank">Demo</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-->
			<!--<a class="btn  btn-large" href="<?php echo U('Home/item/show').'?item_id=3';?>" target="_blank" >帮助教程&nbsp;<i class="icon-circle-arrow-right"></i></a>-->
		</p>

      <hr>


      <div class="footer">
        <!--<p>&copy; Created By <a href="http://blog.star7th.com/" target="_blank"> Star7th</a></p>-->
      </div>

    </div> <!-- /container -->


    
	<script src="/doc/Public/js/common/jquery.min.js"></script>
    <script src="/doc/Public/bootstrap/js/bootstrap.min.js"></script>
    <script src="/doc/Public/js/common/showdoc.js"></script>
  </body>
</html> 
 <script type="text/javascript">

    $("#myCarousel").carousel('cycle');

 </script>