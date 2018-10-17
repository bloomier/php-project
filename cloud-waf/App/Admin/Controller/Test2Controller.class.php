<?php
namespace Admin\Controller;
use Common\Vendor\ExcelUtil;
use Think\Controller;

class Test2Controller extends Controller {

    public function index(){
        echo 'helloword';
    }

    public function echoTime(){
        echo date("Y-m-d H:i:s")."<br/>";
    }

    public function openExcel(){
        $fileName = "ancyshi";
        echo $fileName;
    }

    public function writeFile()
    {
        $excelUtil = new ExcelUtil();
        $path = "test.xlsx";
        $titles = array("src_ip_addr",
            "dst_ip_addr",
            "src_port",
            "dst_port",
            "login_account",
            "call_number",
            "called_number",
            "call_direction",
            "call_type",
            "call_start_time",
            "call_end_time",
            "call_time",
            "gateway_ip_addr",
            "gateway_ip_work_id",
            "src_ip_work_id",
            "dst_ip_work_id",
            "pppoe_account",
            "user_type",
            "singnal_type",
            "report_date");
        $objPHPExcel = $excelUtil->create($titles);

        $link = mysql_connect('localhost', 'root', 'root') //烈火提示：请先修改用户名与密码

        or die('Could not connect: ' . mysql_error());

        mysql_select_db('nisp3') or die('Could not select database');

        // 执行 SQL 查询

        $query = 'SELECT * FROM all_voip_xdr';

        $result = mysql_query($query) or die('Query failed: ' . mysql_error());

// 用 HTML 显示结果

        echo "<table>n";

        while ($line = mysql_fetch_assoc($result)) {

            echo "t<tr>n";

            foreach ($line as $col_value) {

                echo "tt<td>$col_value</td>n";

            }

            echo "t</tr>n";

            //$rows = array();
            // $rows = D("all_voip_xdr")->select();

        }
        //写入
        $excelUtil->write($objPHPExcel, 1, $result);
        //保存
        $excelUtil->outPut($objPHPExcel,'ancyshi.xls');
    }
}