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
                <p v-if="seen">现在你看到我了</p>
                <template v-if="ok">
                    <h1>菜鸟教程</h1>
                    <p>学的不仅是技术，更是梦想！</p>
                    <p>哈哈哈，打字辛苦啊！！！</p>
                </template>
            </div>
            <div id="app2">
                <div v-if="Math.random() > 0.5">
                    Sorry
                </div>
                <div v-else>
                    Not sorry
                </div>
            </div>

            <div id="app3">
                <div v-if="type === 'A'">
                    A
                </div>
                <div v-else-if="type === 'B'">
                    B
                </div>
                <div v-else-if="type === 'C'">
                    C
                </div>
                <div v-else>
                    Not A/B/C
                </div>
            </div>


        </div>


        <script type="text/javascript">
            new Vue({
                el: '#app',
                data: {
                    seen: false,
                    ok: true
                }
            });
            new Vue({
                el: '#app2'
            });

            new Vue({
                el: '#app3',
                data: {
                    type: 'B'
                }
            })

            $(function(){


            });
        </script>
    </body>
</html>