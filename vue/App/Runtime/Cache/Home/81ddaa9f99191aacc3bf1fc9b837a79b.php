<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
    <head>
        <title>玄武盾</title>
        <meta charset="utf-8">
        <!--如果是IE,使用IE9 的内核来渲染-->
        <!--[if IE]>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
        <meta http-equiv="X-UA-Compatible" content="IE=9" />
        <![endif]-->
        <script src="/vue/Public/script/plugins/vue/vue.min.js"></script>
    </head>

    <body >
        <!-- 所有需要用到的插件在这里定义 -->
        <input id="publicPath" type="hidden" value="/vue/Public">
        <input id="rootPath" type="hidden" value="/vue/index.php">
        <input id="echartPath" type="hidden" value="/vue/Public/asset/js/echarts/dist">
        <link rel="stylesheet" href="/vue/Public/css/login.css" />

        <div class="container">
            <div id="app">
                <div v-html="message"></div>
            </div>
            <div id="app2">
                <div v-html="message"></div>
            </div>

        </div>


        <script type="text/javascript">
            new Vue({
                el: '#app',
                data: {
                    message: '<h1>菜鸟教程</h1>'
                }
            });
            new Vue({
                el: '#app2',
                data: {
                    message: '<h1>Hello World For Vue.js</h1>'
                }
            })
            $(function(){


            });
        </script>
    </body>
</html>