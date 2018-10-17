<?php
/**
 * Created by JetBrains PhpStorm.
 * User: sakoo
 * Date: 15-4-3
 * Time: 20:28
 * To change this template use File | Settings | File Templates.
 */
?>

<html>

    <script>
        var funs="aaa";

        var o={

            init:function(){
                var o=this;
                console.info(this);
                __functions__.msg.call(o,"aaa");
            }

        }

        var __functions__={
            msg:function(msg){
                console.info(this);
               // alert(msg);
            }


        }

        o.init();

    </script>
</html>
