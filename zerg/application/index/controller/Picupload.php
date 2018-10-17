<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/10/17
 * Time: 14:57
 */

namespace app\index\controller;
use think\View;
use think\Controller;

class Picupload extends Controller
{
    public function index()
    {
        $view = new View();
        return $view->fetch("picupload");
    }

    public function picupload()
    {
        //判断文件上传是否出错
        if($_FILES["file"]["error"])
        {
            echo $_FILES["file"]["erroe"];
        }
        else
        {
            //控制上传的文件类型，大小
            if(($_FILES["file"]["type"]=="image/jpeg"||$_FILES["file"]["type"]=="image/jpg" || $_FILES["file"]["type"]=="image/png")&&$_FILES["file"]["size"]<1024000)
            {
                //找到文件存放位置，注意tp5框架的相对路径前面不用/
                //这里的filename进行了拼接，前面是路径，后面从date开始是文件名
                //我在static文件下新建了一个file文件用来存放文件，要注意自己建一个文件才能存放传过来的文件
                $dateStr = date("YmdHis");
                $filename = "images/file/".$dateStr.$_FILES["file"]["name"];
                //判断文件是否存在
                if (file_exists($filename))
                {
                    echo "该文件已存在！";
                }
                else
                {
                    //保存文件
                    //move_uploaded_file是php自带的函数，前面是旧的路径，后面是新的路径
                    move_uploaded_file($_FILES["file"]["tmp_name"],$filename);
                    echo '上传成功，文件url地址为：'.config('setting.img_prefix').'/file/'.$dateStr.$_FILES["file"]["name"];
                }
            }
            else
            {
                echo "文件类型不正确！";
            }
        }
    }

}
