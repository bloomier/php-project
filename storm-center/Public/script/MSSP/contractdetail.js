/**
 *@name
 *@author Sean.xiang
 *@date 2015/8/5
 *@example
 */

(function(){
    var Index = {

        init: function(){
            var w = this;

            var contractBaseDataSrc = $("#contractBaseDataSrc").val();
            contractBaseDataSrc = decodeURIComponent(contractBaseDataSrc);
            w.contractBaseDataSrc = $.parseJSON(contractBaseDataSrc);

            var contractDomainListSrc = $("#contractDomainListSrc").val();
            contractDomainListSrc = decodeURIComponent(contractDomainListSrc);
            w.contractDomainListSrc = $.parseJSON(contractDomainListSrc);

            var contactList = $("#contactList").val();
            contactList = decodeURIComponent(contactList);
            w.contactList = $.parseJSON(contactList);

            var contractContactListSrc = $("#contractContactListSrc").val();
            contractContactListSrc = decodeURIComponent(contractContactListSrc);
            w.contractContactListSrc = $.parseJSON(contractContactListSrc);

            w.initHtml();
            w.initEvent();
            w.initDomainTable();

        },
        initHtml: function(){
            var w = this;
            // 服务套餐
            var packages = w.contractBaseDataSrc['packages'];
            var text = "";
            if(1 & packages){
                text += " 漏洞扫描 ";
            }
            if(8 & packages){
                text += " 安全事件 ";
            }
            if(2 & packages){
                text += " 服务监测 ";
            }
            if(4 & packages){
                text += " 云防护 ";
            }
            $(".packages").html(text);

            var contact = [];

            // 联系人
            $.each(w.contractContactListSrc, function(point, item){
                for(var i = 0; i < w.contactList.length; i++){
                    var tmp = w.contactList[i];
                    if(tmp['id'] == item['user_id']){
                        contact.push({
                            userName:tmp['name'],
                            userEmail:tmp['email'],
                            userPhone:tmp['username'],
                            userAlert:item['warning_type']
                        });
                    }
                }
            });

            var count = Math.ceil(contact.length / 2);
            var tmp = 0;
            if(count){
                for(var i = 0; i < count; i++){
                    var wraper = $("#one-result").clone().removeAttr("id");
                    if(tmp < contact.length){
                        var left = $(".left-info-value", wraper);
                        var tmpValue = contact[tmp];
                        w.initContactInfo(tmpValue, left);
                    }else{
                        break;
                    }
                    if(tmp + 1 < contact.length){
                        var right = $(".right-info-value", wraper);
                        var tmpValue = contact[tmp + 1];
                        w.initContactInfo(tmpValue, right);
                    }else{
                        $(".right-info-value", wraper).hide();
                        wraper.show().appendTo($(".contact-list"));
                        break;
                    }
                    tmp = tmp + 2;
                    wraper.show().appendTo($(".contact-list"));
                }
            }
        },

        initContactInfo : function(value, element){
            $(".customer-contact-name", element).html(value['userName']);
            $(".contact-name", element).html("姓名");
            $(".contact-name-value", element).html(value['userName']);
            $(".phone", element).html("电话");
            $(".phone-value", element).html(value['userPhone']);
            $(".email", element).html("邮箱");
            $(".email-value", element).html(value['userEmail']);
            var method = "";
            if(1 & value['userAlert']){
                method += " 短信 ";
            }
            if(2 & value['userAlert']){
                method += " 密信 ";
            }
            if(4 & value['userAlert']){
                method += " 邮件 ";
            }
            $(".contact-method", element).html("通知方式");
            $(".contact-method-value", element).html(method);
        },
        initEvent: function(){
            var w = this;
        },

        initDomainTable : function(){// 初始化
            var w = this;
            var table=$("#contract-domain-table");
            var webScan = "未开启";
            var server = "未开启";
            var waf = "未开启";
            var security = "未开启";
            if(1 & w.contractBaseDataSrc['packages']){
                webScan = "开启";
            }
            if(2 & w.contractBaseDataSrc['packages']){
                server = "开启";
            }
            if(4 & w.contractBaseDataSrc['packages']){
                waf = "开启";
            }
            if(8 & w.contractBaseDataSrc['packages']){
                security = "开启";
            }
            $.each(w.contractDomainListSrc, function(point, item){
                if(item['domain']){
                    var tr = $("<tr></tr>");
                    tr.append($("<td></td>").html(item['domain']));
                    tr.append($("<td></td>").html(item['title']));
                    tr.append($("<td></td>").html(item['ip']));
                    tr.append($("<td></td>").html(webScan));
                    tr.append($("<td></td>").html(security));
                    tr.append($("<td></td>").html(server));
                    tr.append($("<td></td>").html(waf));
                    $(".contract-contact-domain-list",table).append(tr);
                }
            });
            table.dataTable(storm.defaultStaticGridSetting());
        }

    };

    $(function(){
       Index.init();
    })
})();