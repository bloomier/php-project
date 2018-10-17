/**
 *@name
 *@author Sean.xiang
 *@date 2015/6/30
 *@desc
 */
(function(){
    var SiteIndex = function(){
        this.init_data = init_data;
        this.init_bind = init_bind;
        this.init_view = init_view;
        this.setting = setting;
        this.init = init;
    };

    var init = function(){
        this.init_bind.bindFunction.call(this);
        this.init_data.init.call(this);
    };

    var setting = {
        filterParam:[]
    }

    // ajax request
    var init_data = {

        init : function(){
            var o = this;
            this.siteTable = $("#site_table").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__+'/MSSP/Site/query',//����URL
                "aoColumns": [ //����ӳ��
                    //{"mDataProp": 'id'},
                    {"mDataProp": 'domain'},
                    {"mDataProp": 'title'},
                    {"mDataProp": 'packages'},
                    {"mDataProp": 'desc'},
                    {"mDataProp": 'repair_advice'}
                    //{"sDefaultContent": ''}
                ],
                "aoColumnDefs": [//ָ��������
                    {"aTargets":[2],"mRender":function(value,type,aData){

                    }}
                ],
                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//�л���ǰ�Ļص�
                    //var desc = aData['desc'];
                    //var editBtn=$('<a class="btn blue-stripe mini" href="#">�鿴</a>');
                    //editBtn.bind("click",function(){
                    //    var path = __ROOT__ + "/OptCenter/Policy/policyDetail?id=" + aData["id"];
                    //    location.href = path;
                    //});
                    //$('td:eq(5)', nRow).append(editBtn);
                },
                "fnServerParams":function(aoData){//��ѯ����
                    $.merge(aoData, o.setting.filterParam);
                }
            }));
        },

        query : function(value){
            var o = this;
            var flag = 0;
            var name = "level";
            var levelValue = o.setting.siteType[value];
            $.each(o.setting.filterParam, function(point, item){
                if(item.name==name){
                    item.value = levelValue;
                    flag = 1;
                }
            });
            if(!flag){
                o.setting.filterParam.push({name:"level", value:levelValue});
            }
            o.siteTable.fnDraw(true);

        }
    };

    // bind function
    var init_bind = {
        bindFunction: function(){
            var o = this;
            $(".grouptabs li").bind("click", function(){
                $(".item-active", $(".grouptabs")).removeClass("item-active");
                $(this).addClass("item-active");
                var text = $("a", this).text();
                o.init_data.query.call(o, text);
                return false;
            });
        }
    };

    // append value to page
    var init_view = {

    };

    $(document).ready(function(){
        var siteIndex=new SiteIndex();
        siteIndex.init.call(siteIndex);
    });
})();