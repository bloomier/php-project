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
                <ol>
                    <li v-for="site in sites">
                        {{ site.name }}
                    </li>
                </ol>
            </div>
            <div id="app2">
                <ul>
                    <li v-for="value in object">
                        {{ value }}
                    </li>
                </ul>
            </div>

            <div id="app3">
                <ul>
                    <li v-for="(value, key, index) in object">
                        {{ index }}. {{ key }} : {{ value }}
                    </li>
                </ul>
            </div>

            <div id="app4">
                <ul>
                    <li v-for="n in 10">
                        {{ n }}
                    </li>
                </ul>
            </div>
        </div>


        <script type="text/javascript">
            new Vue({
                el: '#app',
                data: {
                    sites: [
                        { name: 'Runoob' },
                        { name: 'Google' },
                        { name: 'Taobao' }
                    ]
                }
            });
            new Vue({
                el: '#app2',
                data: {
                    object: {
                        name: '菜鸟教程',
                        url: 'http://www.runoob.com',
                        slogan: '学的不仅是技术，更是梦想！'
                    }
                }
            });

            new Vue({
                el: '#app3',
                data: {
                    object: {
                        name: '菜鸟教程',
                        url: 'http://www.runoob.com',
                        slogan: '学的不仅是技术，更是梦想！'
                    }
                }
            });

            new Vue({
                el: '#app4'
            });


            $(function(){


            });
        </script>
    </body>
</html>