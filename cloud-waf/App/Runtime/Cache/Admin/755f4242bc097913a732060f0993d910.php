<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
<head>
    <title>系统登录</title>
    <meta charset="utf-8">
    <link href="/cloud-waf/Public/asset/css/common.css" rel="stylesheet" type="text/css" />
    <link href="/cloud-waf/Public/asset/css/login.css" rel="stylesheet" type="text/css" />
    <link rel="icon" href="/cloud-waf/Public/asset/image/fav.png" type="image/x-icon">
    <link rel="shortcut icon" href="/cloud-waf/Public/asset/image/fav.png" type="image/x-icon">

</head>
<body class="login-bg" onkeydown="keydown()">
<div class="wrap">
    <div class="logo"></div>
    <!--<form action="/cloud-waf/index.php/Home/Login/login2"  method="post" onSubmit="return myCheck()">-->
    <div id="form">
        <div class="f-bd">
            <label ><i class="icon icon-user"></i><input class="txt" type="text"  id="username" name="username" placeholder="用户名"/></label>
            <label ><i class="icon icon-psw"></i><input class="txt" type="password" id="_password" name="password" placeholder="密码"/></label>
            <label  class="label-mpsw" style="margin-right: 0px !important; "><i class="icon icon-mpsw"></i><input class="txt" type="text" id="verify_code_text" name="valicode"  placeholder="手机验证码"/><button class="psw-btn btn-verify">获取手机验证码</button></label>

            <label style="display: none" id="region_id_wraper">
                <select id="region_id">
                    <option value="">===请选择域===</option>
                    <?php if(is_array($regions)): foreach($regions as $key=>$vo): ?><option value="<?php echo ($vo["_id"]); ?>"><?php echo ($vo["name_cn"]); ?></option><?php endforeach; endif; ?>
                </select>
            </label>
            <!--<label  class="label-mpsw" ><i class="icon icon-mpsw"></i><input class="txt" type="text" id="reVerity_id" name="valicode"  placeholder="密信接收动态密码"/><button type="button" class="psw-btn" id="securityCode_id">获取动态密码</button></label>-->
        </div>

        <div class="f-bd" style="padding-top: 10px;">
            <span class="text-danger" id="errorMsg_id" style="color: red"></span>
        </div>

        <div class="f-btn"><button class="btn-login">登录</button></div>
        <div class="f-tip"></div>
    </div>
        <!--<p>没有账号？&nbsp;<a href="#storm" data-toggle="collapse" aria-expanded="false" aria-controls="storm">联系风暴中心</a></p>-->
    <!--</form>-->
    <div class="produce">
        <div class="item">
            <div class="left">
                <div class="img img1"></div>
                <div class="text">云监测</div>
            </div>
            <div class="right">
                <div class="title">最新0day</div>
                <div class="info">
                    <ul class="info-inner" id="hole">
                        <li>丰富的系统、域名、服务指纹探测发现</li>
                        <li>多线路域名解析</li>
                        <li>丰富的系统、域名、服务指纹探测发现</li>
                        <li>基于WAF的8年策略</li>
                        <li>丰富的系统、域名、服务指纹探测发现</li>
                        <li>服务质量监测</li>
                    </ul>

                </div>
            </div>
        </div>
        <div class="item">
            <div class="left">
                <div class="img img2"></div>
                <div class="text">云防御</div>
            </div>
            <div class="right">
                <div class="title">主流攻击</div>
                <div class="info">
                    <ul class="info-inner" id="attack">
                        <li>丰富的系统、域名、服务指纹探测发现</li>
                        <li>多线路域名解析</li>
                        <li>丰富的系统、域名、服务指纹探测发现</li>
                        <li>基于WAF的8年策略</li>
                        <li>丰富的系统、域名、服务指纹探测发现</li>
                        <li>服务质量监测</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="item">
            <div class="left">
                <div class="img img3"></div>
                <div class="text">云运营</div>
            </div>
            <div class="right">
                <div class="title">最新安全事件</div>
                <div class="info">
                    <ul class="info-inner" id="event">
                        <li>丰富的系统、域名、服务指纹探测发现</li>
                        <li>多线路域名解析</li>
                        <li>丰富的系统、域名、服务指纹探测发现</li>
                        <li>基于WAF的8年策略</li>
                        <li>丰富的系统、域名、服务指纹探测发现</li>
                        <li>服务质量监测</li>
                    </ul>
                </div>
            </div>
        </div>

    </div>
    <div class="footer">
        <div class="copyright">
            <i>©</i> 2007-2016 XXXX技术有限公司
        </div>
    </div>

</div>
<div class="tip show-msg-label" >
    <div class="m-tip success"  style="display: none">
        <span>密信已发送,剩余有效时间<label class="usable-time">180</label>秒</span>
    </div>
    <div class="m-tip error" style="margin-top: 4px;display: none"  >

    </div>
</div>
<div class="none-btn">
    <a class="btn btn-default btn-page-toggle" href="/cloud-waf/index.php/Home/Login/index.html" type="button">登录</a>
</div>
<!--<div class="wrapper">
    <img src="/cloud-waf/Public/image/MSSP/login_bg.png" alt="" height="100%" width="100%" style="position:fixed;"/>
</div>-->
<input id="rootPath" type="hidden" value="/cloud-waf/index.php">
<script type="text/javascript" src="/cloud-waf/Public/asset/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="/cloud-waf/Public/asset/js/jquery/jquery.md5.js"></script>
<script type="text/javascript" src="/cloud-waf/Public/script/Admin/login.js"></script>
<script>
    // 回车登录验证
    function keydown(e) {
//        var e = e||event;
        var e=e||arguments.callee.caller.arguments[0]||window.event;
        var currKey = e.keyCode||e.which||e.charCode;
        if(currKey == 13){
            $(".btn-login").click();
        }
    }

    $(function(){

        $("#username").focus();
        function scroll(dom){
            var y = 0;
            var speed=200;
            var innerEl = $('#'+dom);
            var rollEl = innerEl.parent();
            var waitEl = innerEl.clone(true).removeAttr('id');
            rollEl.append(waitEl);
            function autoScroll(){
                y = y - 0.8;
                innerEl.css({
                    top: y
                });
                waitEl.css({
                    top: y + innerEl.height()
                });

                if(y * -1 > innerEl.height()){
                    y = 0;
                    var tmp = innerEl;

                    innerEl = waitEl;
                    waitEl = tmp;
                }
            }
            var timer = setInterval(autoScroll,speed);

            rollEl.mouseover(function(){
                clearInterval(timer);
            });
            rollEl.mouseout(function(){
                timer = setInterval(autoScroll,speed);
            });


        }

        scroll('hole');
        scroll('attack');
        scroll('event');


    })
</script>
</body>
</html>