/**所有的注释必须用这种格式**/
/**网站漏洞数据的统计**/
/**先知大屏数据的驱动脚本**/
var conf={
    "ns":"prophet.event",
    "key":{},
    "initial":{/**初始化**/
        /**location 表示 用地理归属 admin_location 表示用行政归属**/
        /**category_type:province**/
        /**province 以省份作为area_rank的分组依据  city 以城市作为area_rank分组依据 dist 以区县作为area_rank分组依据**/
        "security":{
            "total":0,
            "area_rank":{
                "placeholder":1
            },
            "type_rank":{
                "placeholder":1
            }

        }




    },
    "cond":{/**如果需要过滤条件 要在java或php代码中指定**/

    }

};
var reduce=function(doc,prev){
    if(doc.type==2){
        return;
    }
    var data=prev.security;
    data.total++;

    var _category=doc[prev.category_type]?doc[prev.category_type]:"其他";

    if(_category){
        if(!data.area_rank[_category]){
            data.area_rank[_category]=0;
        }
        data.area_rank[_category]++;
    }
    var eventType=doc.event_type+"";
    if(!data.type_rank[eventType]){
        data.type_rank[eventType]={
            total:0,
            time_rank:{},
            area_rank:{}
        }
    }
    data.type_rank[eventType].total++;
    if(_category){
        if(!data.type_rank[eventType].area_rank[_category]){
            data.type_rank[eventType].area_rank[_category]=0;
        }
        data.type_rank[eventType].area_rank[_category]++;
    }
    var timeKey=doc.happen_year_month;
    if(timeKey){
        if(!data.type_rank[eventType].time_rank[timeKey]){
            data.type_rank[eventType].time_rank[timeKey]=0;
        }
        data.type_rank[eventType].time_rank[timeKey]++;
    }





};



var finalize=function(doc){
    delete doc.security.area_rank['placeholder'];
    delete doc.security.type_rank['placeholder'];

};