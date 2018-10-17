<?php
$config->installed       = true;
$config->debug           = false;
$config->requestType     = 'GET';
$config->db->host        = '127.0.0.1';
$config->db->port        = '3306';
$config->db->name        = 'zentao';
$config->db->user        = 'root';
$config->db->password    = '123456';
$config->db->prefix      = 't_';
$config->webRoot         = getWebRoot();
$config->default->lang   = 'zh-cn';
$config->mysqldump       = 'D:\wamp\bin\mysql\mysql5.6.17\bin\mysqldump.exe';