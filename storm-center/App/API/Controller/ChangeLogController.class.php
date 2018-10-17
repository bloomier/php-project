<?php
namespace API\Controller;


use API\Util\Parsedown;
use Think\Controller;

class ChangeLogController extends Controller {

    public function _initialize(){
        $key=I('xKey');
        if(!$key){
            $this->ajaxReturn("xKey empty");
        }

        if($key!='sakoo.jiang'){
            $this->ajaxReturn("xKey error");
        }


    }
    public function logs(){
        $dir="./App/API/View/changeLog";
        $files=scandir($dir);
        echo "<h3>changeLog</h3>";
        $data=array();
        foreach ($files as $file) {
            if($this->endWith($file,".md")){
                $data[]=$file;
            }
        }
        usort($data,'sortByTime');
        foreach($data as $d){
            $href="log?file=".$d.'&xKey=sakoo.jiang';
            echo "<a href='".$href."'>".$d."</a><br>";
        }


    }
    public function log(){
        $file=I('file');
        if(!$file){
            $this->ajaxReturn("$file param empty!");
        }
        $this->showMarkDown('changeLog/'.$file);

    }



    private function  showMarkDown($view){
        //$file="./App/API/View/".$view;
        //echo $file;
        $text = $this->fetch("./App/API/View/".$view);

        $html=Parsedown::instance()->parse($text);
        $this->show($html,"UTF-8","text/html");

    }
    private function endWith($haystack, $needle) {

        $length = strlen($needle);
        if($length == 0)
        {
            return true;
        }
        return (substr($haystack, -$length) === $needle);
    }


}