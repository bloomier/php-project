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
<style type="text/css">
.single-cat{
  margin: 10px;

}
</style>
 <div id="edit-cat" class="modal hide fade">
  <div class="modal-header">
    <h4>历史版本</h4>
  </div>
  <table class="table table-hover">
    <TR>
      <td>修改时间</td>
      <td>修改人</td>
      <td>操作</td>
    </TR>
    <?php if($PageHistory): if(is_array($PageHistory)): foreach($PageHistory as $key=>$value): ?><TR>
        <td><?php echo ($value["addtime"]); ?></td>
        <td><?php echo ($value["author_username"]); ?></td>
        <td><a href="edit?page_id=<?php echo ($page_id); ?>&page_history_id=<?php echo ($value["page_history_id"]); ?>">恢复到此版本</a></td>
      </TR><?php endforeach; endif; endif; ?>
  </table>

    <div class="modal-footer">
      <a href="edit?page_id=<?php echo ($page_id); ?>" class="btn exist-cat">关闭</a>
      <a href="edit?page_id=<?php echo ($page_id); ?>" class="btn btn-primary exist-cat">完成</a>
    </div>
 </div>
<input type="hidden" id="page_id" value="<?php echo ($page_id); ?>">
    
	<script src="/doc/Public/js/common/jquery.min.js"></script>
    <script src="/doc/Public/bootstrap/js/bootstrap.min.js"></script>
    <script src="/doc/Public/js/common/showdoc.js"></script>
  </body>
</html> 
 <script type="text/javascript">
 $(function(){
   $('#edit-cat').modal();
 })

 </script>