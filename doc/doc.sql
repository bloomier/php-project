-- create database 
drop database if exists doc;  -- 如果存在doc则删除
create database doc;  -- 建立库school
use doc;  -- 打开库SCHOOL

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for catalog
-- ----------------------------
DROP TABLE IF EXISTS `catalog`;
CREATE TABLE `catalog` (
  `cat_id` int(10) NOT NULL AUTO_INCREMENT COMMENT '目录id',
  `cat_name` varchar(20) NOT NULL DEFAULT '' COMMENT '目录名',
  `item_id` int(10) NOT NULL DEFAULT '0' COMMENT '所在的项目id',
  `order` int(10) NOT NULL DEFAULT '99' COMMENT '顺序号。数字越小越靠前。若此值全部相等时则按id排序',
  `addtime` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`cat_id`),
  KEY `order` (`order`),
  KEY `addtime` (`addtime`)
) ENGINE=MyISAM AUTO_INCREMENT=27 DEFAULT CHARSET=utf8 COMMENT='目录表';

-- ----------------------------
-- Records of catalog
-- ----------------------------
-- INSERT INTO `catalog` VALUES ('24', '前端页面', '13', '1', '1466770363');
-- INSERT INTO `catalog` VALUES ('25', '后端接口', '13', '2', '1466770385');
-- INSERT INTO `catalog` VALUES ('26', '数据库表结构', '13', '99', '1466770470');

-- ----------------------------
-- Table structure for item
-- ----------------------------
DROP TABLE IF EXISTS `item`;
CREATE TABLE `item` (
  `item_id` int(10) NOT NULL AUTO_INCREMENT,
  `item_name` varchar(50) NOT NULL DEFAULT '',
  `item_description` varchar(225) NOT NULL DEFAULT '' COMMENT '项目描述',
  `uid` int(10) NOT NULL DEFAULT '0',
  `username` varchar(50) NOT NULL DEFAULT '',
  `password` varchar(50) NOT NULL DEFAULT '',
  `addtime` int(11) NOT NULL DEFAULT '0',
  `last_update_time` int(11) NOT NULL DEFAULT '0' COMMENT '最后更新时间',
  PRIMARY KEY (`item_id`),
  KEY `addtime` (`addtime`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COMMENT='项目表';

-- ----------------------------
-- Records of item
-- ----------------------------
-- INSERT INTO `item` VALUES ('13', '玄武盾', '相关接口文档', '2', 'admin', '', '1466770331', '1466987706');

-- ----------------------------
-- Table structure for item_member
-- ----------------------------
DROP TABLE IF EXISTS `item_member`;
CREATE TABLE `item_member` (
  `item_member_id` int(10) NOT NULL AUTO_INCREMENT,
  `item_id` int(10) NOT NULL DEFAULT '0',
  `uid` int(10) NOT NULL DEFAULT '0',
  `username` varchar(50) NOT NULL DEFAULT '',
  `addtime` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`item_member_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COMMENT='项目成员表';

-- ----------------------------
-- Records of item_member
-- ----------------------------

-- ----------------------------
-- Table structure for page
-- ----------------------------
DROP TABLE IF EXISTS `page`;
CREATE TABLE `page` (
  `page_id` int(10) NOT NULL AUTO_INCREMENT,
  `author_uid` int(10) NOT NULL DEFAULT '0' COMMENT '页面作者uid',
  `author_username` varchar(50) NOT NULL DEFAULT '' COMMENT '页面作者名字',
  `item_id` int(10) NOT NULL DEFAULT '0',
  `cat_id` int(10) NOT NULL DEFAULT '0',
  `page_title` varchar(50) NOT NULL DEFAULT '',
  `page_content` text NOT NULL,
  `order` int(10) NOT NULL DEFAULT '99' COMMENT '顺序号。数字越小越靠前。若此值全部相等时则按id排序',
  `addtime` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`page_id`),
  KEY `order` (`order`),
  KEY `addtime` (`addtime`)
) ENGINE=MyISAM AUTO_INCREMENT=99 DEFAULT CHARSET=utf8 COMMENT='文章页面表';

-- ----------------------------
-- Records of page
-- ----------------------------
-- INSERT INTO `page` VALUES ('97', '2', 'admin', '13', '0', '默认页面', '    \n**数据库表结构简要描述：** \n\n    \n-  用户信息表，储存用户信息\n\n|字段|类型|空|默认|注释|\n|:----    |:-------    |:--- |-- -|------      |\n|_id	  |int(10)     |是	|	 |主键	           |\n|username |varchar(20) |是	|    |	 用户名	|\n|name |varchar(50) |是   |    |	 昵称		 |\n|roles     |array |是   |    |    角色列表支持多选     |\n|phone |varchar(20)     |是   |   |   电话号码  |\n|password |varchar(64)     |是   |   |   密码  |\n\n\n\n\n', '99', '1466987386');
-- INSERT INTO `page` VALUES ('98', '2', 'admin', '13', '26', '用户表', '    \n**数据库表结构简要描述：** \n\n    \n-  用户信息表，储存用户信息\n\n|字段|类型|空|默认|注释|\n|:----    |:-------    |:--- |-- -|------      |\n|_id	  |int(10)     |是	|	 |主键	           |\n|username |varchar(20) |是	|    |	 用户名	|\n|name |varchar(50) |是   |    |	 昵称		 |\n|roles     |array |是   |    |    角色列表支持多选     |\n|phone |varchar(20)     |是   |   |   电话号码  |\n|password |varchar(64)     |是   |   |   密码  |\n', '1', '1466987706');

-- ----------------------------
-- Table structure for page_history
-- ----------------------------
DROP TABLE IF EXISTS `page_history`;
CREATE TABLE `page_history` (
  `page_history_id` int(10) NOT NULL AUTO_INCREMENT,
  `page_id` int(10) NOT NULL DEFAULT '0',
  `author_uid` int(10) NOT NULL DEFAULT '0' COMMENT '页面作者uid',
  `author_username` varchar(50) NOT NULL DEFAULT '' COMMENT '页面作者名字',
  `item_id` int(10) NOT NULL DEFAULT '0',
  `cat_id` int(10) NOT NULL DEFAULT '0',
  `page_title` varchar(50) NOT NULL DEFAULT '',
  `page_content` text NOT NULL,
  `order` int(10) NOT NULL DEFAULT '99' COMMENT '顺序号。数字越小越靠前。若此值全部为0则按时间排序',
  `addtime` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`page_history_id`),
  KEY `page_id` (`page_id`),
  KEY `addtime` (`addtime`)
) ENGINE=MyISAM AUTO_INCREMENT=165 DEFAULT CHARSET=utf8 COMMENT='页面历史表';

-- ----------------------------
-- Records of page_history
-- ----------------------------
-- INSERT INTO `page_history` VALUES ('164', '97', '2', 'admin', '13', '0', '默认页面', '\n    \n**数据库表结构简要描述：** \n\n    \n-  用户信息表，储存用户信息\n\n|字段|类型|空|默认|注释|\n|:----    |:-------    |:--- |-- -|------      |\n|_id	  |int(10)     |是	|	 |主键	           |\n|username |varchar(20) |是	|    |	 用户名	|\n|name |varchar(50) |是   |    |	 昵称		 |\n|roles     |array |是   |    |    角色列表支持多选     |\n|phone |varchar(20)     |是   | 0  |   电话号码  |\n|password |varchar(64)     |是   | 0  |   密码  |\n\n\n\n\n', '99', '1466771275');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` int(10) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL DEFAULT '',
  `groupid` tinyint(2) NOT NULL DEFAULT '2' COMMENT '1为超级管理员，2为普通用户',
  `name` varchar(15) DEFAULT '',
  `avatar` varchar(200) DEFAULT '' COMMENT '头像',
  `avatar_small` varchar(200) CHARACTER SET latin1 DEFAULT '',
  `email` varchar(50) DEFAULT '',
  `password` varchar(50) NOT NULL,
  `cookie_token` varchar(50) NOT NULL DEFAULT '' COMMENT '实现cookie自动登录的token凭证',
  `cookie_token_expire` int(11) NOT NULL DEFAULT '0',
  `reg_time` int(11) NOT NULL DEFAULT '0',
  `last_login_time` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`uid`),
  UNIQUE KEY `username` (`username`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='用户表';

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'admin', '1', '', '', '', '', '3dffb490809233f921e2b51372625b87', 'adb09fe016d06deb1b2cf9382275f665', '1474545894', '1461723886', '1466769894');

