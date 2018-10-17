<?php

function checkDeviceId(){
    $map=C('deviceMap');
    $domain=I('domain');
    $deviceId=$map[$domain];
    return $deviceId;
}










