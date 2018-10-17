####[返回目录](apis?xKey={:I('xKey')})

<hr>
####安全漏洞
<hr>
    获取安全漏洞类型
    uri:/API/Vuls/getVulsCategory
    请求地址:http://api.websaas.cn/index.php/API/Vuls/getVulsCategory?xKey=key&xToken=md5(uri+keyPass+yyyy-MM-dd)
    {
        "code": 1,
        "msg": "",
        "info": [
            {
                "vid": "SD0007",             漏洞编号
                "vname": "sql inject",    漏洞英文
                "vnameCn": "sql注入",  漏洞中文
                "level": "high",			   漏洞危险级别
                "start": null,
                "limit": null
            },
            ………………
    	]
    }
<hr>
	获取指定域名的安全漏洞
	uri:/Api/Vuls/getVulsByDomain/domain/请求的域名
	请求地址:http://api.websaas.cn/index.php/API/Vuls/getVulsByDomain/domain/请求的域名?xKey=key&xToken=md5(uri+keyPass+yyyy-MM-dd)
	响应值:
	{
        "code": 1,
        "msg": "success",
        "info": {
            "value": [
                {
                    "rowKey":""   漏洞ID  用于查询漏洞详情
                    "url": "http://www.tdcif.com/100jindaliyutupian//",  漏洞url
                    "vid": "SD0002",    //漏洞类型
                    "poc": "IIS|6.0"    //POC
                },
                …………

            ]

         }
     }

<hr>
<hr>
	获取指定域名的暗链信息
	uri:/Api/Vuls/getHideLinkVuls/domain/请求的域名
	请求地址:http://api.websaas.cn/index.php/API/Vuls/getHideLinkVuls/domain/请求的域名?xKey=key&xToken=md5(uri+keyPass+yyyy-MM-dd)
	响应值:
	正常有数据
	{
        "code": 1,
        "msg": "success",
        "info": [
            {
                "timestamp":1438414655859 收录时间毫秒数
                "rowKey":""   漏洞ID  用于查询漏洞详情
                "url": "http://www.tdcif.com/100jindaliyutupian//",  漏洞url
                "vid": "SD6016",    //漏洞类型
                "poc": "******"    //POC
            },
            …………
         ]
     }
    无漏洞
    {
        "code": 1,
        "msg": "无漏洞信息",
        "info": [
        ]
    }
    未收录
    {
        "code": 0,
        "msg": "该网站未收录",
        "info": []
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
    public static final String VLUS_CATEGORY="/API/Vuls/getVulsCategory";
    public static final String VULS_BY_DOMAIN="/API/Vuls/getVulsByDomain";//获取指定域名的安全漏洞
    public static final String HIDE_LINK_BY_DOMAIN="/API/Vuls/getHideLinkVuls";//获取指定域名的暗链
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
     * 获取漏洞类型
     * @throws Exception
     */
    public static void getVlusCategory()throws Exception{
        String uri=VLUS_CATEGORY;
        String requestUrl=createXToeknUrl(uri);
        //System.out.println(requestUrl);
        String json=HttpUtil.httpGet(requestUrl);
        System.out.println(json);

    }

	/**
	 * 获取指定域名的安全漏洞
	 * @param domain
	 * @throws Exception
	 */
	public static void getVulsByDomain(String domain)throws Exception{
		String uri=VULS_BY_DOMAIN+"/domain/"+domain;
		String requestUrl=createXToeknUrl(uri);
		String json=HttpUtil.httpGet(requestUrl);
		System.out.println(json);

	}

	/**
     * 获取指定域名的安全漏洞
     * @param domain
     * @throws Exception
     */
    public static void getHideLinkByDomain(String domain)throws Exception{
        String uri=HIDE_LINK_BY_DOMAIN+"/domain/"+domain;
    	String requestUrl=createXToeknUrl(uri);
    	String json=HttpUtil.httpGet(requestUrl);
    	System.out.println(json);
    }