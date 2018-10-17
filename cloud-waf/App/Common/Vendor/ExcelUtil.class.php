<?php
namespace Common\Vendor;
/**
 * 操作Excel工具类
 * Class ExcelUtil
 * @package Common\Vendor
 */
class ExcelUtil  {

    public function create($titles){
        $excelTArr=array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P");
        vendor("PHPExcel.PHPExcel");
        $objPHPExcel = new \PHPExcel();
        $objPHPExcel->getProperties()->setCreator("ctos")
            ->setLastModifiedBy("ctos")
            ->setTitle("Office 2007 XLSX Test Document")
            ->setSubject("Office 2007 XLSX Test Document")
            ->setDescription("Test document for Office 2007 XLSX, generated using PHP classes.")
            ->setKeywords("office 2007 openxml php")
            ->setCategory("Test result file");
        for($i=0;$i<count($titles);$i++){
            $objPHPExcel->getActiveSheet()->getColumnDimension($excelTArr[$i])->setWidth(15);
            $objPHPExcel->setActiveSheetIndex(0)->getStyle($excelTArr[$i]."1")->getFont()->setBold(true);
            $objPHPExcel->setActiveSheetIndex(0) ->setCellValue($excelTArr[$i]."1",$titles[$i]);
        }
        return $objPHPExcel;
    }

    public function write($objPHPExcel,$startLine,$rows){
         $excelTArr=array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P");
         for($i=0;$i<count($rows);$i++){
            $row=$rows[$i];
            for($j=0;$j<count($row);$j++){
                $objPHPExcel->setActiveSheetIndex(0) ->setCellValue($excelTArr[$j].($startLine+$i),$row[$j]);
            }
         }
    }

    public function writeObj($objPHPExcel,$startLine,$rows, $title){
        $excelTArr=array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z");
        for($i=0;$i<count($rows);$i++){
            $row=$rows[$i];
            for($j=0;$j<count($title);$j++){
                $tmp = $title[$j];
                if($row[$tmp]){
                    $objPHPExcel->setActiveSheetIndex(0) ->setCellValue($excelTArr[$j].($startLine+$i),$row[$tmp]);
                }else{
                    $objPHPExcel->setActiveSheetIndex(0) ->setCellValue($excelTArr[$j].($startLine+$i),"");
                }
            }
        }
    }

    public function outPut($objPHPExcel,$fileName){
        $objWriter = new \PHPExcel_Writer_Excel2007($objPHPExcel);
        $objWriter->save($fileName);
    }

    /** 根据excel路径读取excel内容，
     * $path文件路径
     * $limitNum设定文件行数
     */
    public function readFile($path, $limitNum){
        $result = array(code=>1, count=>0, msg=>"成功");
        //require_once 'module/PHPExcel/Classes/PHPExcel/IOFactory.php';
        require('./ThinkPHP/Library/Vendor/PHPExcel/PHPExcel/IOFactory.php');
        //vendor("PHPExcel.PHPExcel");
        $objPHPExcel = \PHPExcel_IOFactory::load($path);
        $objPHPExcel->setActiveSheetIndex(0);
        $sheet0    = $objPHPExcel->getSheet(0);
        $rowCount  = $sheet0->getHighestRow();//excel行数
        $sheet0->getActiveCell();
        $columnCount = $sheet0->getHighestColumn();

        $items=array();
        //第一行一般为标题行去掉，从第二行开始
        for($currentRow=2; $currentRow <= $rowCount; $currentRow++){
            //从哪列开始，A表示第一列
            for($currentColumn='A'; $currentColumn <= $columnCount; $currentColumn++){
                //数据坐标
                $address=$currentColumn.$currentRow;
                //读取到的数据，保存到数组$arr中
                $items[$currentRow][$currentColumn]=$sheet0->getCell($address)->getValue();
            }
        }

        if($rowCount - 1 > $limitNum){
            $result = array(code=>0, count=>0, msg=>"上传文件行数超出限定值:".$limitNum);
        } else {
            $result['count'] = count($items);
            $result['items'] = $items;
        }

        return $result;
    }




}