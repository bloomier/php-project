<?php
namespace Common\Vendor;
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

}