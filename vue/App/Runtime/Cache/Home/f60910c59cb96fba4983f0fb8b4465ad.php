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

        <style>
            .active {
                width: 100px;
                height: 100px;
                background: green;
            }

            .text-danger {
                background: red;
            }
        </style>
    </head>

    <body >
        <!-- 绑定类属性 -->
        <div id="app">
            <div v-bind:class="{ active: isActive }"></div>
        </div>

        <!-- 覆盖背景色 -->
        <div id="app2">
            <div class="static"
                 v-bind:class="{ active: isActive, 'text-danger': hasError }">
            </div>
        </div>

        <script>
            new Vue({
                el: '#app',
                data: {
                    isActive: true
                }
            });

            new Vue({
                el: '#app2',
                data: {
                    isActive: true,
                    hasError: true
                }
            });

        </script>
    </body>
</html>