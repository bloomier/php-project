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
                <button v-on:click="counter += 1">增加 1</button>
                <p>这个按钮被点击了 {{ counter }} 次。</p>
            </div>

            <div id="app2">
                <!-- `greet` 是在下面定义的方法名 -->
                <button v-on:click="greet">Greet</button>
            </div>

            <div id="app3">
                <button v-on:click="say('hi')">Say hi</button>
                <button v-on:click="say('what')">Say what</button>
            </div>


        </div>


        <script type="text/javascript">
            new Vue({
                el: '#app',
                data: {
                    counter: 0
                }
            });
            var app = new Vue({
                el: '#app2',
                data: {
                    name: 'Vue.js'
                },
                // 在 `methods` 对象中定义方法
                methods: {
                    greet: function (event) {
                        // `this` 在方法里指当前 Vue 实例
                        alert('Hello ' + this.name + '!')
                        // `event` 是原生 DOM 事件
                        if (event) {
                            alert(event.target.tagName)
                        }
                    }
                }
            })

            new Vue({
                el: '#app3',
                methods: {
                    say: function (message) {
                        alert(message)
                    }
                }
            });

        </script>
    </body>
</html>