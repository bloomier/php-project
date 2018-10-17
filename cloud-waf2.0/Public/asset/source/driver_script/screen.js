/**所有的注释必须用这种格式**/
/**网站漏洞数据的统计**/
/**先知大屏数据的驱动脚本**/
var conf={
    "ns":"prophet.asset",
    "key":{},
    "initial":{/**初始化**/
    	"location_type":"location",/**location 表示 用地理归属 admin_location 表示用行政归属**/
    	/**category_type:province**/
    	/**province 以省份作为area_rank的分组依据  city 以城市作为area_rank分组依据 dist 以区县作为area_rank分组依据**/
		/**detail:滨江  这个数据代表 要对滨江的数据列出详单**/
    	"level_mapper":{
    		
    	},/**example: sd0001:"high"   ,漏洞等级映射**/
		"zeroPolicy":[/**0天策略组**/


		],
    	"vuls":{/**漏洞样本**/
    		"has_risk":{
            	"yes":0,
            	"no":0
            },
            "risk_rank":{
            	"high":{
            		"total":0,
            		"area_rank":{
						"placeholder":1/**占位符,在php环境下必须加上占位符,否则php会把空的json 当做array**/
					},
            		"type_rank":{
						"placeholder":1
					}
            	},
            	"mid":{
            		"total":0,
            		"area_rank":{
						"placeholder":1
					},
            		"type_rank":{
						"placeholder":1
					}
            	},
            	"low":{
            		"total":0,
            		"area_rank":{
						"placeholder":1
					},
            		"type_rank":{
						"placeholder":1
					}
            	},
            	"info":{
            		"total":0,
            		"area_rank":{
						"placeholder":1
					},
            		"type_rank":{
						"placeholder":1
					}
            	},
            	"safe":{
            		"total":0,
            		"area_rank":{
						"placeholder":1
					},
            		"type_rank":{
						"placeholder":1
					}
            	}
            	
            },
            "risk_type_rank":{/**example  sd0001：{total:1,level:"high","example20":[],area_rank:{}}**/
				"placeholder":1
            }
    	},
		"survey":{
			"total_web_num":0,
			"area_nums":{
				"placeholder":1
			},
			"exeption":{
				"total":0,
				"type_rank":{
					"placeholder":1
				}
			}
		},
		"zeroday":{/**0天漏洞**/
			"data":{
				"placeholder":1/**数据格式  0天name:{area_rank:{}}  **/
			}

		},
		"finger":{
			"data":{
				"placeholder":1
			}

		}

        
    },
    "cond":{/**如果需要过滤条件 要在java代码中指定**/
    	
    }

};
var reduce=function(doc,prev){

	var location=doc[prev.location_type];
	var _category="";
	if(prev.category_type){
		_category=location?(location[prev.category_type]||''):'';
		if(_category.length>32){
			_category="";
		}
	}

	/**漏洞统计脚本**/
	(function(){
		if(!doc.vuls){
			return;
		}
		var vuls_data=prev.vuls;
		if(doc.vuls.level=='safe'){
			vuls_data.has_risk.no++;
		}else{
			vuls_data.has_risk.yes++;
		}

		
		var levels=["high","mid","low","info","safe"];
		levels.forEach(function(level){
			if(doc.vuls&&doc.vuls.level&&doc.vuls.level==level){
				vuls_data.risk_rank[level].total++;
				if(prev.category_type){
					if(_category){
						if(!vuls_data.risk_rank[level].area_rank[_category]){
							vuls_data.risk_rank[level].area_rank[_category]=0;
						}
						vuls_data.risk_rank[level].area_rank[_category]++;
					}

				}
				
			}
			
		});
		if(doc.vuls&&doc.vuls&&doc.vuls.sd_detail){
			var ds_detail=doc.vuls.sd_detail;
			for(var sd in ds_detail){
				/**处理risk_rank 中的type_rank**/
				var _theLevel=prev.level_mapper[sd];
				if(_theLevel){
					if(!vuls_data.risk_rank[_theLevel].type_rank[sd]){
						vuls_data.risk_rank[_theLevel].type_rank[sd]=0;
					}
					vuls_data.risk_rank[_theLevel].type_rank[sd]+=ds_detail[sd];
				}
				
				/**处理risk_type_rank**/
				if(!vuls_data.risk_type_rank[sd]){
					vuls_data.risk_type_rank[sd]={};
					vuls_data.risk_type_rank[sd].total=0;
					vuls_data.risk_type_rank[sd]['example20']=[];
					vuls_data.risk_type_rank[sd].area_rank={};
					vuls_data.risk_type_rank[sd].level=prev.level_mapper[sd];
				}
				
				vuls_data.risk_type_rank[sd].total+=ds_detail[sd];
				if(vuls_data.risk_type_rank[sd]['example20'].length<20){
					vuls_data.risk_type_rank[sd]['example20'].push({domain:doc['_id'],title:doc['title'],count:ds_detail[sd]});
				}

				/**处理risk_type_rank中的area_rank**/
				if(_category){
					if(!vuls_data.risk_type_rank[sd].area_rank[_category]){
						vuls_data.risk_type_rank[sd].area_rank[_category]=0;
					}
					vuls_data.risk_type_rank[sd].area_rank[_category]+=ds_detail[sd];
				}


			}
		}
	})();
	/**普查统计脚本**/
	(function(){
		var survey_data=prev.survey;
		survey_data.total_web_num++;

		if(_category){
			if(!survey_data.area_nums[_category]){
				survey_data.area_nums[_category]=0;
			}
			survey_data.area_nums[_category]++;

		}
		if(doc.survey){

			if(doc.survey.visit_state&&doc.survey.visit_state!=1){
				survey_data.exeption.total++;
			}
			if(doc.survey.visit_state&&doc.survey.visit_state!=1){
				var exceptionType=doc.survey.visit_state+"";
				if(!survey_data.exeption.type_rank[exceptionType]){
					survey_data.exeption.type_rank[exceptionType]={
						total:0,
						area_rank:{},
						example10:[]
					};
				}
				survey_data.exeption.type_rank[exceptionType].total++;
				if(survey_data.exeption.type_rank[exceptionType].example10.length<10){
					if(doc.survey.visit_last){
						var up_data=doc.survey.visit_data[doc.survey.visit_last];

						survey_data.exeption.type_rank[exceptionType].example10.push({_id:doc._id,title:doc.title,type:exceptionType,time:up_data['lasest_uptime']});
					}

				}
				if(_category){
					if(!survey_data.exeption.type_rank[exceptionType].area_rank[_category]){
						survey_data.exeption.type_rank[exceptionType].area_rank[_category]=0;
					}
					survey_data.exeption.type_rank[exceptionType].area_rank[_category]++;

				}
			}

		}




	})();

	/**0天统计脚本**/
	(function(){
		var zero_data=prev.zeroday.data;
		var addZeroDay=function(policyName){
			zero_data[policyName].total++;
			if(_category){
				if(!zero_data[policyName].area_rank[_category]){
					zero_data[policyName].area_rank[_category]=0;
				}
				zero_data[policyName].area_rank[_category]++;
			}
		}
		var matchVersion=function(versions,_V){
			if(!versions||versions.length==0){
				return true;
			}
			for(var i=0;i<versions.length;i++){
				if(_V&&_V.indexOf(versions[i])==0){
					return true;
				}
			}
			return false;
		}
		if(prev.zeroPolicy&&prev.zeroPolicy.length){
			prev.zeroPolicy.forEach(function(policy){
				if(!zero_data[policy.name]){
					zero_data[policy.name]={
						_id:policy._id,
						total:0,
						area_rank:{}
					}
				}

				if(policy.type==1){
					var fingerType=policy.config.finger_type;

					var fingerName=policy.config.name;
					var fingerVersion=policy.config.version;
					if(doc.finger[fingerType]&&doc.finger[fingerType].indexOf(fingerName)==0){/**匹配名称**/

						var tmp=doc.finger[fingerType].split(" ");
						if(tmp.length>1){
							var version=tmp[1];
							if(matchVersion(policy.config.version,version)){
								addZeroDay(policy.name);
							}


						}
					}


				}else if(policy.type==2){
					var sd=policy.config.name;
					if(sd&&doc.vuls&&doc.vuls.sd_detail&&doc.vuls.sd_detail[sd]){
						addZeroDay(policy.name);

					}

				}



			});
		}

	})();

	/**指纹统计脚本**/
	(function(){
		var finger_data=prev.finger.data;
		var fingers=doc.finger;
		for(var fingerType in fingers){
			var fingerVaule=fingers[fingerType].split(" ")[0];
			if(fingerType&&fingerVaule){
				if(!finger_data[fingerType]){
					finger_data[fingerType]={};
				}
				if(!finger_data[fingerType][fingerVaule]){
					finger_data[fingerType][fingerVaule]={
						total:0,
						area_rank:{},
						example10:[]
					}
				}
				finger_data[fingerType][fingerVaule].total++;
				if(finger_data[fingerType][fingerVaule].example10.length<10){
					finger_data[fingerType][fingerVaule].example10.push({_id:doc._id,title:doc.title});
				}
				if(_category){
					if(!finger_data[fingerType][fingerVaule].area_rank[_category]){
						finger_data[fingerType][fingerVaule].area_rank[_category]=0;
					}
					finger_data[fingerType][fingerVaule].area_rank[_category]++;

				}
			}


		}
	})();

};



var finalize=function(doc){
	
	delete doc['level_mapper'];
	delete doc['zeroPolicy'];
	/**移除占位符**/
	var levels=["high","mid","low","info","safe"];
	levels.forEach(function(level){
		delete doc.vuls.risk_rank[level].area_rank['placeholder'];
		delete doc.vuls.risk_rank[level].type_rank['placeholder'];
	});
	delete doc.vuls.risk_type_rank['placeholder'];

	delete doc.survey.area_nums['placeholder'];
	delete  doc.survey.exeption.type_rank['placeholder'];
	delete  doc.zeroday.data['placeholder'];

	delete doc.finger.data['placeholder'];


};