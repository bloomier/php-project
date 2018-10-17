####[返回目录](apis?xKey={:I('xKey')})

<hr>

####key认证

    api地址: http://api.websaas.cn/index.php
    请求方式: GET
    uri:具体请求+参数
    apiKey:{key:key值,keyPass:认证密码,rules:可请求的api,province:省份属性,hourCount:每小时可请求最大的次数}
    xKey=key
    xToken=md5(uri+keyPass+yyyy-MM-dd)
    md5要求小写,`yyyy-MM-dd`为当前`年-月-日`
    生成请求地址： api地址/uri?xKey=key&xToken=md5(uri+keyPass+yyyy-MM-dd)
    响应:code=1为正常响应  code=0为异常响应



<hr>
####大屏接入认证

    处于安全考虑，请不要在前端代码中处理xKey和xToken的生成逻辑

    攻击态势
    http://www.websaas.cn/index.php/ScreenCenter/AttackEvent/index?xKey=key
    &xToken=md5(yyyy-MM-dd+keyPass)

    智能节点
    http://www.websaas.cn/index.php/ScreenCenter/BrainNodes/index?xKey=key
    &xToken=md5(yyyy-MM-dd+keyPass)

    网站普查
    http://www.websaas.cn/index.php/ScreenCenter/WebSurvey/index?xKey=key
    &xToken=md5(yyyy-MM-dd+keyPass)

    安全事件
    http://www.websaas.cn/index.php/ScreenCenter/SecurityEvent/index?xKey=key
    &xToken=md5(yyyy-MM-dd+keyPass)

    先知页面
    http://www.websaas.cn/index.php/ScreenCenter/GovDynamic/index?xKey=key
    &xToken=md5(yyyy-MM-dd+keyPass)

    MSSP页面
    http://www.websaas.cn/index.php/ScreenCenter/WebCloudWaf/index?xKey=key
    &xToken=md5(yyyy-MM-dd+keyPass)

    世界互联网大会页面
    http://www.websaas.cn/index.php/ScreenCenter/CloudMonitor/index/key/world-network?xKey=key
    &xToken=md5(yyyy-MM-dd+keyPass)

    浙江人民政府页面
    http://www.websaas.cn/index.php/ScreenCenter/CloudMonitor/index/key/world-zjrm?xKey=key
    &xToken=md5(yyyy-MM-dd+keyPass)

    浙江公安厅页面
    http://www.websaas.cn/index.php/ScreenCenter/CloudMonitor/index/key/world-zjga?xKey=key
    &xToken=md5(yyyy-MM-dd+keyPass)

    浙江在线页面
    http://www.websaas.cn/index.php/ScreenCenter/CloudMonitor/index/key/world-zjzx?xKey=key
    &xToken=md5(yyyy-MM-dd+keyPass)

    桐乡市政府页面
    http://www.websaas.cn/index.php/ScreenCenter/CloudMonitor/index/key/world-txzf?xKey=key
    &xToken=md5(yyyy-MM-dd+keyPass)