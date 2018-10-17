<?php
namespace Home\Controller;
use Home\Globals\Constants;
use Think\Controller;
use Think\Model;

class ImageController extends Controller {

    public function test(){
        $this->display("Test/test");
    }

    public function testRule(){
        $date=date("Y-m-j");
        $time=time();
        echo $time;
    }

    public function uploadImgToServer(){
        $file=$_FILES["file"]['tmp_name'];
        $filename=$_FILES["file"]['name'];
        // var_dump($file);
        $dir=dirname($file);
        $newName=$dir."/".$filename;
        rename($file,$newName);
        $data=array("name"=>"@".$newName);
        $json=http_post_file(C("IMAGE_SERVER")."/index.php/Image/uploadImg?type=".I('type')."&key=0EocrYTAR9nrD7j3mRxh2uHoPt4hlRAcaJAaPRElI",
            $data,"json");
        unlink($file);
        unlink($newName);
        //var_dump($json['path']);
        if($json['code']>0){
            $json['relation_path']=$json['path'];
            $json['path']=C("IMAGE_SERVER")."/upload/".$json['path'];
        }
        echo json_encode($json);
    }

}