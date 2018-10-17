/**所有的注释必须用这种格式**/
/**var conf=,var reduce= var finalize这2个变量必须严格设定 中间只能有一个空格,顺序也必须严格,由于简单起见，其他格式尚不能解析**/
/**finalize 可以不配置 **/
var conf={
    "ns":"prophet.asset",
    "key":{},
    "initial":{/**初始化**/
        "count":1,
        "province":{},
        "city":{}
    }

};


var reduce=function(doc,prev){
	prev.count++;
	var province=doc.location.province;
	if(province){
		var prevCount=prev.province[province]||0;
		prev.province[province]=prevCount+1;
	}
	var city=doc.location.city;
	if(city){
		var prevCount=prev.city[city]||0;
		prev.city[city]=prevCount+1;
	}
};



var finalize=function(doc){
	doc.test=2;
	
};