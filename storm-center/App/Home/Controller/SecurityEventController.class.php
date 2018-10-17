<?php
namespace Home\Controller;
use Home\Globals\Constants;
use Think\Upload;
use Think\Model;
use Think\Controller;

class SecurityEventController extends BaseController{

    // 进入安全事件录入页面
    public function index(){
        $this -> display("index");
    }

    // 进入安全事件查询界面
    public function queryPage(){
        $this -> display("query");
    }

    // 将安全事件添加到mysql中
    public function insertTo(){

        $fileType = 'jpg,gif,png,jpeg,bmp';
        $pos = strripos($_FILES["file"]["name"],'.'); //获取到文件名的位置
        $fileName = getSystemMillis()."__".substr($_FILES["file"]["name"],0,$pos);

        $setting = array(
            'mimes' => '', //允许上传的文件MiMe类型
            'maxSize' => 0, //上传的文件大小限制 (0-不做限制)
            'exts' => $fileType, //允许上传的文件后缀
            'autoSub' => true, //自动子目录保存文件
            'subName' => array('date', 'Y-m-d'), //子目录创建方式，[0]-函数名，[1]-参数，多个参数使用数组
            'rootPath' => C("UPLOAD_SAVE_FILE"), //保存根路径
            'savePath' => "", //保存路径
            'saveName' => $fileName, // 保存文件名
        );

        $this->uploader = new Upload($setting, 'Local');//B5教程网
        $info = $this->uploader->uploadOne($_FILES["file"]);

        // 文件保存成功之后，将信息录入到数据库中
        if ($info) {
            $data["security_event_title"] = I("title");// 标题
            $data["security_event_domain"] = I("domain");// 域名
            $data["security_event_description"] = I("description");// 描述
            $data["security_event_time"] = I("createTime");// 时间
            $data["security_event_type"] = I("imgType");// 图片类型
            $data["security_event_province"] = I("province");// 省份
            $data["security_event_city"] = I("city");// 城市
            $data["security_event_status"] = 1;// 状态
            $data["security_event_sender"] = "admin";// 上传者
            $data["security_event_img_path"] = C("UPLOAD_SAVE_FILE")."/".array('date', 'Y-m-d')."/".$info['savename'];
            $securityEvent = M("security_event")->add($data);
            if($securityEvent){
                echo "信息录入成功！";
            }else{
                echo "信息入库失败，请重新上传！";
            }
        } else {
            echo "信息录入失败，请重新上传！";
        }
    }

    /**
     * 查询安全事件信息
     */
    public function query(){

        $imgType = I("imgType");
        $status = I("status");
        $param = I("params");
        $startTime = I("startTime");
        $endTime = I("endTime");
        $limit = I("limit");
        $startPoint = I("start");

        // 查询条件
        $queryParam = "";
        // 条件
        if($param){
            $queryParam = " (security_event_domain LIKE '%".$param."%' ";
            $queryParam = $queryParam." OR security_event_title LIKE '%".$param."%' ";
            $queryParam = $queryParam." OR security_event_province LIKE '%".$param."%' ";
            $queryParam = $queryParam." OR security_event_city LIKE '%".$param."%' ";
            $queryParam = $queryParam." OR security_event_sender LIKE '%".$param."%' ";
            $queryParam = $queryParam." OR security_event_status LIKE '%".$param."%') ";
        }

        // 图片类型
        if($imgType){
            if($queryParam){
                $queryParam = $queryParam." AND ";
            }
            $queryParam = $queryParam."security_event_type=".$imgType;

        }
        // 图片状态
        if($status){
            if($queryParam){
                $queryParam = $queryParam." AND ";
            }
            $queryParam = $queryParam."security_event_status=".$status;
        }

        // 时间条件
        if($startTime){
            if($queryParam){
                $queryParam = $queryParam." AND ";
            }
            $queryParam = $queryParam."security_event_time>'".$startTime."' AND security_event_time<'".$endTime."'";
        }
        // 获取结果数目
        $count = M('security_event')->where($queryParam)->count();

        // 获取记录列表
        $eventList=M('security_event')->where($queryParam)->limit($startPoint.",".$limit)->order("security_event_id desc")->select();
        $result["count"] = $count;
        $result["list"] = $eventList;
        // 返回信息
        $this->ajaxReturn($result);
    }

    // 处理安全事件
    public function dealWithEvent(){
        $id = I("event_id");// 编号
        $status = I("status");// 状态:1通过，0不通过，2删除
        if($status){
            if($status == 1){
                $securityEvent = M("security_event")->where("security_event_id=".$id)->find();

                $eventValue = array(
                    "imageType"=>$securityEvent["security_event_type"],
                    "domain"=>$securityEvent["security_event_domain"],
                    "title"=>$securityEvent["security_event_title"],
                    "poc"=>$securityEvent["security_event_sender"],
                    "province"=>$securityEvent["security_event_province"],
                    "city"=>$securityEvent["security_event_city"],
                    "file"=>"@".$securityEvent["security_event_img_path"]
                );

                $serverResult = http_post_file(C("STORM_CENTER_PATH")."/insertEvent", $eventValue, "json");
                if($serverResult["code"] == 1){
                    if($serverResult["other"]){
                        $data["security_event_status"] = 2;
                        $result = M("security_event")->where("security_event_id=".$id)->save($data);
                        if($result){
                            $this->ajaxReturn("操作成功！");
                        }else{
                            $this->ajaxReturn("操作失败！");
                        }
                    }else{
                        $data["security_event_status"] = 4;
                        $data["security_event_error_info"] = "域名表不存在该安全事件域名！";
                        $result = M("security_event")->where("security_event_id=".$id)->save($data);
                        if($result){
                            $this->ajaxReturn("提交失败！");
                        }else{
                            $this->ajaxReturn("操作失败！");
                        }
                    }
                }else{
                    $data["security_event_status"] = 4;
                    $data["security_event_error_info"] = "提交服务器失败！";
                    $result = M("security_event")->where("security_event_id=".$id)->save($data);
                    if($result){
                        $this->ajaxReturn("提交失败！");
                    }else{
                        $this->ajaxReturn("操作失败！");
                    }
                }

            }else if($status == 2){
                // 删除
                $result = M("security_event")->where("security_event_id=".$id)->delete();
                if($result){
                    $this->ajaxReturn("删除成功！");
                }else{
                    $this->ajaxReturn("删除失败！");
                }
            }
        }else{
            // 不通过
            $data["security_event_status"] =3;
            $result = M("security_event")->where("security_event_id=".$id)->save($data);
            if($result){
                $this->ajaxReturn("操作成功！");
            }else{
                $this->ajaxReturn("操作失败！");
            }
        }
    }

    // 显示图片
    public function getImg(){
        $event = M("security_event")->where("security_event_id=".I("id"))->find();
        $path = $event["security_event_img_path"];
        $result = file_get_contents($path);
        header("Content-type: image/jpg");
        echo $result;
    }
}