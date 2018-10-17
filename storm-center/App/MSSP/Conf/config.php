<?php

    $servicePackageConfig = array(
        //服务套餐 ： 漏扫1+网站服务质量2+云防护4
        "SERVICEPACKAGE" => array("漏扫","网站服务质量","云防护","安全事件检测"),
    );

    $servicereport = array(

        TEMPLATE_PATH=>"./report/msspreport/"

    );

return array_merge($servicePackageConfig,$servicereport);