<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
    <head>
        <title>VUE</title>
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
                <p>原始字符串: {{ message }}</p>
                <p>计算后反转字符串: {{ reversedMessage }}</p>
            </div>

        </div>


        <script type="text/javascript">
            var vm = new Vue({
                el: '#app',
                data: {
                    message: 'Runoob!'
                },
                computed: {
                    // 计算属性的 getter
                    reversedMessage: function () {
                        // `this` 指向 vm 实例
                        return this.message.split('').reverse().join('')
                    }
                }
            });

            $(function(){


            });
        </script>
    </body>
</html>