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
            <h3>================================================================</h3>
            <div id="app">
                <p>input 元素：</p>
                <input v-model="message" placeholder="编辑我……">
                <p>消息是: {{ message }}</p>

                <p>textarea 元素：</p>
                <p style="white-space: pre">{{ message2 }}</p>
                <textarea v-model="message2" placeholder="多行文本输入……"></textarea>
            </div>

            <h3>================================================================</h3>
            <div id="app2">
                <p>单个复选框：</p>
                <input type="checkbox" id="checkbox" v-model="checked">
                <label for="checkbox">{{ checked }}</label>

                <p>多个复选框：</p>
                <input type="checkbox" id="runoob" value="Runoob" v-model="checkedNames">
                <label for="runoob">Runoob</label>
                <input type="checkbox" id="google" value="Google" v-model="checkedNames">
                <label for="google">Google</label>
                <input type="checkbox" id="taobao" value="Taobao" v-model="checkedNames">
                <label for="taobao">taobao</label>
                <br>
                <span>选择的值为: {{ checkedNames }}</span>
            </div>


            <h3>================================================================</h3>
            <div id="app3">
                <input type="radio" id="runoob3" value="Runoob" v-model="picked">
                <label for="runoob">Runoob</label>
                <br>
                <input type="radio" id="google3" value="Google" v-model="picked">
                <label for="google">Google</label>
                <br>
                <span>选中值为: {{ picked }}</span>
            </div>

            <h3>================================================================</h3>
            <div id="app4">
                <select v-model="selected" name="fruit">
                    <option value="">选择一个网站</option>
                    <option value="www.runoob.com">Runoob</option>
                    <option value="www.google.com">Google</option>
                </select>

                <div id="output">
                    选择的网站是: {{selected}}
                </div>
            </div>


        </div>


        <script type="text/javascript">
            new Vue({
                el: '#app',
                data: {
                    message: 'Runoob',
                    message2: '菜鸟教程\r\nhttp://www.runoob.com'
                }
            });
            new Vue({
                el: '#app2',
                data: {
                    checked : false,
                    checkedNames: []
                }
            });

            new Vue({
                el: '#app3',
                data: {
                    picked : 'Runoob'
                }
            });

            new Vue({
                el: '#app4',
                data: {
                    selected: ''
                }
            });

        </script>
    </body>
</html>