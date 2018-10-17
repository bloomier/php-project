####[返回目录](apis?xKey={:I('xKey')})
<hr>

####安全事件
<hr>
    获取一个切片
    uri:/API/BigdataTask/queryOneSlice/nodeId/节点Id
    请求地址:http://api.websaas.cn/index.php/API/BigdataTask/queryOneSlice/nodeId/节点Id?xKey=key&xToken=md5(uri+keyPass+yyyy-MM-dd)
    响应值
    {
        "code": 1,
        "slice": {
            id:1,
            number:'1_0_128779878688',
            urls:"www.baidu.com,www.qq.com,www.sina.com.cn",
            scan_style:"0 边扫边爬 1只扫不爬",
            other:"其他一些不重要的参数"
        },
        msg:"如果code=0,输出失败原因"
    }

<hr>
    开始一个切片
    uri:/API/BigdataTask/startOneSlice/sliceId/切片ID
    请求地址:http://api.websaas.cn/index.php/API/BigdataTask/startOneSlice/sliceId/切片ID?xKey=key&xToken=md5(uri+keyPass+yyyy-MM-dd)
    响应值
    {
        "code": 1,
        "msg": "如果code=0,输出失败原因"
    }


<hr>
    完成一个切片
    uri:/API/BigdataTask/finishOneSlice/sliceId/切片Id/fileName/vlues文件名称
    注意:如果是绝对地址请把“/” 或者 “\” 转换成“__”
    请求地址:http://api.websaas.cn/index.php/API/BigdataTask/finishOneSlice/sliceId/切片Id/fileName/vlues文件名称?xKey=key&xToken=md5(uri+keyPass+yyyy-MM-dd)
    响应值
    {
        "code": 1,
        msg:"如果code=0,输出失败原因"
    }


<hr>
    读取一个已完成的切片,用于数据中心数据回传
    uri:/API/BigdataTask/queryOneSliceHostry/nodeId/节点Id
    请求地址:http://api.websaas.cn/index.php/API/BigdataTask/queryOneSliceHostry/nodeId/节点Id?xKey=key&xToken=md5(uri+keyPass+yyyy-MM-dd)
    响应值
    {
        "code": 1,
         "slice": {
            id:1,
            number:'1_0_128779878688',
            urls:"www.baidu.com,www.qq.com,www.sina.com.cn",
            status:3,
            other:"其他一些不重要的参数",
            vlus_file:"节点文件以number来命名，这个参数将废弃"

        },
        msg:"如果code=0,输出失败原因"
    }
<hr>
    开始一个切片的同步
    uri:/API/BigdataTask/startSyncOneSlice/sliceId/切片Id
    请求地址:http://api.websaas.cn/index.php/API/BigdataTask/startSyncOneSlice/sliceId/切片Id?xKey=key&xToken=md5(uri+keyPass+yyyy-MM-dd)
    响应值
    {
        "code": 1,
        msg:"如果code=0,输出失败原因"
    }

<hr>
    完成一个切片的同步
    uri:/API/BigdataTask/finishSyncOneSlice/sliceId/切片Id
    请求地址:http://api.websaas.cn/index.php/API/BigdataTask/finishSyncOneSlice/sliceId/切片Id?xKey=key&xToken=md5(uri+keyPass+yyyy-MM-dd)
    响应值
    {
        "code": 1,
        msg:"如果code=0,输出失败原因"
    }
<hr>
    重置某节点下所有正在运行的切片的状态
    uri:/API/BigdataTask/resetSliceByNode/nodeId/节点Id
    请求地址:http://api.websaas.cn/index.php/API/BigdataTask/resetSliceByNode/nodeId/节点Id?xKey=key&xToken=md5(uri+keyPass+yyyy-MM-dd)
    响应值
    {
        "code":1,
        msg:"如果code=0,输出失败原因"
    }
<hr>
    获取所有策略
    uri:/API/BigdataPolicy/queryAllPolicy
    请求地址:http://api.websaas.cn/index.php/API/BigdataPolicy/queryAllPolicy?xKey=key&xToken=md5(uri+keyPass+yyyy-MM-dd)
    响应值
    {
        "code":1,
        "rows":[
            {
                id:SDXXXXXXX,
                name:XXXXXX,
                leve:50 (20信息,30低危,40中危,50高危,60安全事件)
            }......
        ]
    }
<hr>
    添加|修改策略
    uri:/API/BigdataPolicy/addOnePolicy/id/策略编号/name/策略名称/level/策略等级
    请求地址:http://api.websaas.cn/index.php/API/BigdataPolicy/addOnePolicy/id/策略编号/name/策略名称/level/等级?xKey=key&xToken=md5(uri+keyPass+yyyy-MM-dd)
    响应值
    {
        "code":1
        "msg":"如果code=0,输出失败原因"
    }
<hr>
    获取一个待验证的任务
    uri:/API/BigdataTask/queryOneVerificationSlice/nodeId/节点Id
    请求地址:http://api.websaas.cn/index.php/API/BigdataTask/queryOneVerificationSlice/nodeId/节点Id?xKey=key&xToken=md5(uri+keyPass+yyyy-MM-dd)
    响应值
    {
        "code": 1,
        "slice": {
            id:1,
            number:'1_0_128779878688',
            urls:"xxx,xxx,xxx",// rowkey
            scan_style:"0 边扫边爬 1只扫不爬",
            other:"其他一些不重要的参数"
        },
        msg:"如果code=0,输出失败原因"
    }
<hr>
    根据rowkey获取详细信息
    uri:/API/BigdataTask/queryOneVulsDetail
    请求参数:rowKey
    请求地址:http://api.websaas.cn/index.php/API/BigdataTask/queryOneVulsDetail?xKey=key&xToken=md5(uri+keyPass+yyyy-MM-dd)
    响应值
    {
        "code": 1,
        "detail": {
            "req": "xxx",//请求包
            "vid": "xxx",// 策略编号
            "url": "xxx",// 策略URL
            "poc": ""//
        },
        msg:"如果code=0,输出失败原因"
    }
<hr>
    完成某个漏洞验证切片任务
    uri:/API/BigdataTask/finishOneVulsSlice
    请求参数:sliceId
    请求地址:http://api.websaas.cn/index.php/API/BigdataTask/finishOneVulsSlice/sliceId/1?xKey=key&xToken=md5(uri+keyPass+yyyy-MM-dd)
    响应值
    {
        "code": 1,
        msg:"如果code=0,输出失败原因"
    }

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

    public static String httpPost(String url,Map<String,String> requests) throws Exception{
    		Object obj=httpPost(url, requests, new Response() {
    			@Override
    			public Object getResponse(HttpEntity entity) throws Exception {
    				return EntityUtils.toString(entity);
    			}
    		});
    		if(obj==null){
    			throw new Exception("数据连接失败");
    		}
    		return (String)obj;
    	}

<hr>

    public static final String API_HOST="http://api.websaas.cn/index.php";

    public static final String BIGDATATASK_QUERYONESLICE="/API/BigdataTask/queryOneSlice";//获取一个切片
    public static final String BIGDATATASK_STARTONESLICE="/API/BigdataTask/startOneSlice";//开始一个切片
    public static final String BIGDATATASK_FINISHONESLICE="/API/BigdataTask/finishOneSlice";//完成一个切片
    public static final String BIGDATATASK_RESETSLICEBYNODEID = "/API/BigdataTask/resetSliceByNode";// 重置一个节点下的所有正在运行的切片

    public static final String BIGDATATASK_QUERYONESLICE_HISTORY="/API/BigdataTask/queryOneSliceHostry";//获取一个历史切片
    public static final String BIGDATATASK_STARTSYNCONESLICE="/API/BigdataTask/startSyncOneSlice";//开始同步
	public static final String BIGDATATASK_FINISHSYNCONESLICE="/API/BigdataTask/finishSyncOneSlice";//完成同步

	public static final String BIGDATATASK_QUERY_ALL_POLICY = "/API/BigdataPolicy/queryAllPolicy";// 获取所有策略

	public static final String BIGDATATASK_ADD_ONE_POLICY = "/API/BigdataPolicy/addOnePolicy";// 添加或修改策略

	public static final String BIGDATATASK_VULS_VERIFICATION = "/API/BigdataTask/queryOneVerificationSlice";// 获取漏洞校验任务

	public static final String BIGDATATASK_VULS_DETAIL = "/API/BigdataTask/queryOneVulsDetail";// 根据rowkey获取一个漏洞的基础信息

	public staitc final String BIGDATATASK_FINISH_ONE_VULS_SLICE = "/API/BigdataTask/finishOneVulsSlice";// 完成一个漏洞校验切片

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
  	 * 获取任务切片
  	 * @throws Exception
  	 */
  	public static void queryOneSlice() throws Exception{
  		String uri=BIGDATATASK_QUERYONESLICE+"/nodeId/1";

  		String requestUrl=createXToeknUrl(uri);
  		String json=HttpUtil.httpGet(requestUrl);
  		System.out.println(json);
  	}
  	/**
     * 开始任务切片
     * @throws Exception
     */
    public static void startOneSlice() throws Exception{
        String uri=BIGDATATASK_STARTONESLICE+"/sliceId/1";

        String requestUrl=createXToeknUrl(uri);
        String json=HttpUtil.httpGet(requestUrl);
        System.out.println(json);
    }
  	/**
  	 * 完成任务切片
  	 * @throws Exception
  	 */
  	public static void finishOneSlice() throws Exception{
  		String uri=BIGDATATASK_FINIONESLICE+"/sliceId/1/fileName/vlues文件名称";

  		String requestUrl=createXToeknUrl(uri);
  		String json=HttpUtil.httpGet(requestUrl);
  		System.out.println(json);
  	}
  	/**
     * 获取任务历史切片
     * @throws Exception
     */
    public static void queryOneSliceHistory() throws Exception{
        String uri=BIGDATATASK_QUERYONESLICE_HISTORY+"/nodeId/node1";

        String requestUrl=createXToeknUrl(uri);
        String json=HttpUtil.httpGet(requestUrl);
        System.out.println(json);
    }

     /**
     * 开始切片数据的同步
     * @throws Exception
     */
    public static void startSyncOneSlice()throws Exception{
        String uri=BIGDATATASK_STARTSYNCONESLICE+"/sliceId/1";

        String requestUrl=createXToeknUrl(uri);
        String json=HttpUtil.httpGet(requestUrl);
        System.out.println(json);
    }
    /**
     * 完成切片数据的同步
     * @throws Exception
     */
    public static void finishSyncOneSlice()throws Exception{
        String uri=BIGDATATASK_FINISHSYNCONESLICE+"/sliceId/1";

        String requestUrl=createXToeknUrl(uri);
        String json=HttpUtil.httpGet(requestUrl);
        System.out.println(json);
    }

    /**
     * 重置某节点下所有正在运行的切片状态(改为等待状态)
     */
    public static void resetSliceByNodeId() throws Exception{
        String uri = BIGDATATASK_RESETSLICEBYNODEID + "/nodeId/node1";

        String requestUrl = createXToeknUrl(uri);
        String json = HttpUtil.httpGet(requestUrl);
        System.out.println(json);
    }

    /**
     * 获取所有策略
     */
    public static void getAllPolicy() throws Exception{
        String uri = BIGDATATASK_QUERY_ALL_POLICY;

        String requestUrl = createXToeknUrl(uri);
        String json = HttpUtil.httpGet(requestUrl);
        System.out.println(json);
    }

    /**
     * 添加或修改策略
     */
     public static void addOrUpdatePolicy() throws Exception{
        String uri = BIGDATATASK_ADD_ONE_POLICY + "/id/SD0001/name/新增策略1/level/等级";

        String requestUrl = createXToeknUrl(uri);
        String json = HttpUtil.httpGet(requestUrl);
        System.out.println(json);
     }

    /**
     * 获取漏洞校验任务
     */
     public static void getVulsVerificationSlice() throws Exception{
        String uri = BIGDATATASK_VULS_VERIFICATION + "/nodeId/节点id";
        String requestUrl = createXToeknUrl(uri);
        String json = HttpUtil.httpGet(requestUrl);
        System.out.println(json);
     }

     /**
      * 根据rowkey获取某漏洞的详细信息
      */
     public static void getVulsDetail() throws Exception{
        String uri = BIGDATATASK_VULS_DETAIL;
        Map param = new HashMap();
        param.put("rowKey", "xxxxxx");
        String requestUrl = createXToeknUrl(uri);
        String json = HttpUtil.httpPost(requestUrl, param);
        System.out.println(json);
     }

     /**
      * 一个漏洞切片完成
      */
     public static void finishVulsSlice() throws Exception{
        String uri = BIGDATATASK_FINISH_ONE_VULS_SLICE + "/sliceId/1";
        String requestUrl=createXToeknUrl(uri);
        String json=HttpUtil.httpGet(requestUrl);
        System.out.println(json);
     }






