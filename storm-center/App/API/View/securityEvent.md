####[返回目录](apis?xKey={:I('xKey')})
<hr>

####安全事件
<hr>
    获取安全事件类型
    uri:/API/SecurityEvent/getEventCategory
    请求地址:http://api.websaas.cn/index.php/API/SecurityEvent/getEventCategory?xKey=key&xToken=md5(uri+keyPass+yyyy-MM-dd)
    响应值
    {
        "code": 1,
        "values": {
            "请选择": "",
            "黑页": "1",
            "暗链": "2",
            "反共": "3",
            "博彩": "5",
            "色情": "6",
            "其他": "4"
        }
    }



<hr>

	获取指定域名的所有安全事件
	uri:/API/SecurityEvent/getEventByDomain/domain/请求的域名
	请求地址:http://api.websaas.cn/index.php/API/SecurityEvent/getEventByDomain/domain/请求的域名?xKey=key&xToken=md5(uri+keyPass+yyyy-MM-dd)
    响应值
    {
        "code": 1,
        "msg": "",
        "imgserver":"",(事件截图地址,和info中的event_snapshot(如果存在)拼接就可获取)
        "info": [
            {
                    "event_id": "1263accece0d4457b6743ca340531215",
                    "web_url": "http://www.tdcif.com/baqibanfulogotuan3/",
                    "web_domain": "www.tdcif.com",
                    "web_title": "酒色论坛_艺术美女_黄色五月",
                    "web_ip": "125.77.199.211",
                    "web_ip_addr": "福建省厦门市",
                    "web_ip_province": "福建",
                    "web_ip_city": "厦门",
                    "event_type": "4",
                    "contract_id": null,
                    "happen_time": "2015-07-27 04:56:59",
                    "event_desc": "[{暗链地址:http://www.tdcif.com 关键词:[, 美女] 状态:可疑同域}, {暗链地址:http://www.tdcif.com/qundifengguangxingganmeinv/ 关键词:[, 性感, 美女] 状态:可疑同域}, {暗链地址:http://www.2068181.com/wuxiongyinaizhaomeinv/ 关键词:[, 美女] 状态:确定}]",
                    "event_source": "大数据",
                    "event_snapshot": "图片地址(可能没有)",
                    "audit_state": (0:登记  1:审核通过 -1:审核失败),
                    "create_date": "2015-07-27 23:01:08",
                    "create_user": "hadoop",
                    "last_modify_user": "hadoop",
                    "last_modify_date": "2015-07-27 22:59:09",
                    "uuid": "2f29c404b9984f1db56fe2c384f803c8",
                    "其他字段":"不重要"
             }
             …………

        ]
    }
<hr>
	获取指定某一天的所有安全事件
	uri:/API/SecurityEvent/getEventByDay/day/指定某一天(yyyy-MM-dd)
	请求地址:http://api.websaas.cn/index.php/API/SecurityEvent/getEventByDay/day/指定某一天?xKey=key&xToken=md5(uri+keyPass+yyyy-MM-dd)
	响应值
    {
        "code": 1,
        "msg": "",
        "info": [
            {
                    "event_id": "1263accece0d4457b6743ca340531215",
                    "web_url": "http://www.tdcif.com/baqibanfulogotuan3/",
                    "web_domain": "www.tdcif.com",
                    "web_title": "酒色论坛_艺术美女_黄色五月",
                    "web_ip": "125.77.199.211",
                    "web_ip_addr": "福建省厦门市",
                    "web_ip_province": "福建",
                    "web_ip_city": "厦门",
                    "event_type": "4",
                    "contract_id": null,
                    "happen_time": "2015-07-27 04:56:59",
                    "event_desc": "[{暗链地址:http://www.tdcif.com 关键词:[, 美女] 状态:可疑同域}, {暗链地址:http://www.tdcif.com/qundifengguangxingganmeinv/ 关键词:[, 性感, 美女] 状态:可疑同域}, {暗链地址:http://www.2068181.com/wuxiongyinaizhaomeinv/ 关键词:[, 美女] 状态:确定}]",
                    "event_source": "大数据",
                    "event_snapshot": "图片地址(可能没有)",
                    "audit_state": (0:登记  1:审核通过 -1:审核失败),
                    "create_date": "2015-07-27 23:01:08",
                    "create_user": "hadoop",
                    "last_modify_user": "hadoop",
                    "last_modify_date": "2015-07-27 22:59:09",
                    "uuid": "2f29c404b9984f1db56fe2c384f803c8",
                    "其他字段":"不重要"
             }
             …………

        ]
    }


<hr>
<hr>
    demo 基于http-client-4.4.1.jar

    public static String httpGet(String url) throws Exception{
        CloseableHttpClient httpclient = HttpClients.createDefault();
        CloseableHttpResponse response=null;
        try{
            HttpGet httpGet = new HttpGet(url);
            response = httpclient.execute(httpGet);

            HttpEntity entity = response.getEntity();
            return EntityUtils.toString(entity, "UTF-8");



        }catch (Exception e) {
            // TODO: handle exception
        //	e.printStackTrace();
        }finally{
            if(response!=null){
                response.close();
            }
            httpclient.close();
        }
        throw new Exception("reponse error");
    }

<hr>

    public static final String API_HOST="http://api.websaas.cn/index.php";
    public static final String SECURITY_EVENT_CATEGORY="/API/SecurityEvent/getEventCategory";
    public static final String SECURITY_EVENT_BY_DOMAIN="/API/SecurityEvent/getEventByDomain";//获取指定域名所有安全事件
    public static final String SECURITY_EVENT_BY_DAY="/API/SecurityEvent/getEventByDay";//获取指定日期所有安全事件

    public static final String API_KEY="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX";
    public static final String KEY_PASS="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX";
    public static SimpleDateFormat format=new SimpleDateFormat("yyyy-MM-dd");
    /**
     * API KEY KEYPASS 认证
     * @param uri
     * @return
     */
    private static String createXToeknUrl(String uri){
        String xToken=MD5Util.MD5(uri+KEY_PASS+format.format(new Date()));
        String url=API_HOST+uri+"?xKey="+API_KEY+"&xToken="+xToken;
        return url;
    }

<hr>
    /**
     * 获取安全事件类型
     * @throws Exception
     */
    public static void getEventCategory() throws Exception{
        String uri=SECURITY_EVENT_CATEGORY;
        String requestUrl=createXToeknUrl(uri);
        //System.out.println(requestUrl);
        String json=HttpUtil.httpGet(requestUrl);
        System.out.println(json);

    }

    /**
     * 获取指定域名所有安全事件
     * @param domain
     * @throws Exception
     */
    public static void getEventByDomain(String domain) throws Exception{
        String uri=SECURITY_EVENT_BY_DOMAIN+"/domain/"+domain;
        String requestUrl=createXToeknUrl(uri);
        String json=HttpUtil.httpGet(requestUrl);
        System.out.println(json);



    }

    /**
     * 获取指定日期所有安全事件
     * @param day
     * @throws Exception
     */
    public static void getEventByDay(String day)throws Exception{
        String uri=SECURITY_EVENT_BY_DAY+"/day/"+day;
        String requestUrl=createXToeknUrl(uri);
        String json=HttpUtil.httpGet(requestUrl);
        System.out.println(json);

    }
