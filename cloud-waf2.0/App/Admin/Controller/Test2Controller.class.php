<?php
namespace Admin\Controller;
use Common\Model\AutoIncrementModel;
use Common\Model\StringModel;
use Common\Vendor\Constants;
use Common\Vendor\ExcelUtil;
use Common\Vendor\WafConsole;
use Think\Controller;
class Test2Controller extends Controller {

    public function reset(){
        $db = new AutoIncrementModel(Constants::$DB_REGION);
        $param["_id"] = 1;
        $param["init"] = 1;
        $db->save($param, array(upsert=>true));
    }


    public function test(){

//        $util=new ExcelUtil();
//        $objPHPExcel=$util->create(array("标题1","标题2","标题3"));
//        $util->write($objPHPExcel,2,array(array("xc","as","fd"),array("xcc","asc","fdc")));
//        $util->write($objPHPExcel,7,array(array("xc","as","fd"),array("xcc","asc","fdc")));
//        $util->outPut($objPHPExcel,"D:/xxx.xlsx")
        set_time_limit(0);
        $util=new ExcelUtil();
        $objPHPExcel=$util->create(array("域名","标题","IP","省份(IP归属)","城市(IP归属)"));
        change_db(1);
        $md=new StringModel(Constants::$DB_ASSET);
        //分页查询
        $start=0;
        while(true){
            if($start>100000){
                break;
            }
            $rows=$md->field("_id,title,ip,location.province,location.city")->limit($start.",10")->select();
            $data=array();
            foreach(array_values($rows) as $row){
                $data[]=array($row['_id'],$row['title'],$row['ip'],$row['location']['province'],$row['location']['city']);
            }
            if(count($data)>0){
                $util->write($objPHPExcel,$start+2,$data);
            }else{
                break;
            }
            $start=$start+10;
        }



        $util->outPut($objPHPExcel,"D:/xxx.xlsx");



    }
    private function convertUTF8($str){
        if(empty($str)) return '';
        return  iconv('gb2312', 'utf-8', $str);
    }

}