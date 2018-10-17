####[返回目录](apis?xKey={:I('xKey')})

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
    public static final String VLUS_CATEGORY="/API/Vuls/getVulsCategory";

    public static final String  VULS_BY_DOMAIN="/API/Vuls/getVulsByDomain";//获取指定域名的安全漏洞
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
