/**
 * Created by jianghaifeng on 2016/1/5.
 */
var deviceGroup={
    "峰会官网防护监测":{
        "defense":[//边界防护区
            {name:"防火墙",num:2,keys:"deviceId_40023,deviceId_40020","icon":"firewall.png",type:"firewall"},
            {name:"抗DDOS",num:2,keys:"deviceId_40038,deviceId_40035","icon":"server1.png",type:"ddos"},
            {name:"绿盟防病毒",num:2,keys:"deviceId_40008,deviceId_40011","icon":"server1.png",type:"antivirus"},
            {name:"WAF",num:2,keys:"deviceId_40026,deviceId_40029","icon":"server1.png",type:"waf"},
            {name:"绿盟IPS",num:2,keys:"deviceId_40002,deviceId_40005","icon":"server2.png",type:"ips"}
        ],
        "application":[//应用区
            {name:"媒体注册服务器群",num:2,keys:"deviceId_40062,deviceId_40053",icon:"server3.png",type:"group"},
            {name:"代表注册服务器群",num:2,keys:"deviceId_40059,deviceId_40056",icon:"server3.png",type:"group"},
            {name:"工商注册服务器群",num:2,keys:"deviceId_40050,deviceId_40047",icon:"server3.png",type:"group"},
            {name:"防篡改",num:1,keys:"deviceId_40044",icon:"server2.png",type:"distort"}
        ],
        "datacenter":[//数据区
            {name:"数据库服务器1",num:1,keys:"deviceId_40014",icon:"server3.png",type:"group"},
            {name:"数据库服务器2",num:1,keys:"deviceId_40017",icon:"server3.png",type:"group"}
        ],
        "operation":[//运维区
            {name:"综合日志审计",num:1,keys:"deviceId_22",icon:"server1.png",type:"log-audit"},
            {name:"WEB应用审计",num:1,keys:"deviceId_40068",icon:"server1.png",type:"webapp-audit"},
            {name:"数据库审计",num:1,keys:"deviceId_40065",icon:"server1.png",type:"database-audit"},
            {name:"堡垒机",num:1,keys:"deviceId_40032",icon:"server1.png",type:"fort"}

        ]
    }
}
