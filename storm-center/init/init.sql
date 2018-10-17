-- phpMyAdmin SQL Dump
-- version 4.1.6
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 2015-06-30 07:56:18
-- 服务器版本： 5.6.16
-- PHP Version: 5.5.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `stormcenter`
--
CREATE DATABASE IF NOT EXISTS `stormcenter` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `stormcenter`;

-- --------------------------------------------------------

--
-- 表的结构 `storm_auth_group`
--

CREATE TABLE IF NOT EXISTS `storm_auth_group` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `title` char(100) NOT NULL DEFAULT '',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `rules` char(80) NOT NULL DEFAULT '',
  `pid` int(11) NOT NULL DEFAULT '0',
  `type` int(11) NOT NULL DEFAULT '0' COMMENT '0:模块  1:操作权限',
  `page_action` varchar(128) NOT NULL,
  `m_type` int(1) NOT NULL COMMENT '0:操作模块 1:系统管理 2:Home 3:安全事件',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=25 ;

--
-- 转存表中的数据 `storm_auth_group`
--

INSERT INTO `storm_auth_group` (`id`, `title`, `status`, `rules`, `pid`, `type`, `page_action`, `m_type`) VALUES
(1, '智能节点', 1, '2,3,4,5', 6, 0, 'Home/InfoCenter/index', 2),
(2, '攻击态势', 1, '6,7', 6, 0, 'Home/InfoCenter/attackEvent', 2),
(3, '网站普查', 1, '8', 6, 0, 'Home/InfoCenter/siteAvail', 2),
(4, '安全事件', 1, '9,10,11,12,13', 6, 0, 'Home/InfoCenter/securityEvent', 2),
(5, '搜索', 1, '15,32', 0, 0, 'Home/Search/index', 2),
(6, '云观测', 1, '', 0, 0, '', 2),
(7, '报告', 1, '', 0, 1, '', 0),
(8, '查看报告', 1, '33,37,36', 7, 1, '', 0),
(9, '导出报告', 1, '34,38', 7, 1, '', 0),
(10, '发送报告', 1, '35,39', 7, 1, '', 0),
(11, '系统管理', 1, '', 0, 0, '', 1),
(12, '用户管理', 1, '22,23,24,25,26', 11, 0, 'Admin/User/index', 1),
(13, '角色管理', 1, '16,17,18,19,20,21', 11, 0, 'Admin/Role/index', 1),
(14, '漏洞策略管理', 1, '28,29,30,31', 11, 0, 'Admin/VulsPolicy/index', 1),
(15, '首页', 1, '40', 0, 0, 'Security/Index/index', 3),
(16, '事件管理', 1, '', 0, 0, '', 3),
(17, '事件登记', 1, '41', 16, 0, 'Security/Event/record', 3),
(18, '事件审核', 1, '42', 16, 0, 'Security/Event/verify', 3),
(19, '事件跟踪', 1, '44', 16, 0, 'Security/Event/trace', 3),
(20, '事件查询', 1, '45', 0, 0, 'Security/ESearch/index', 3),
(21, '系统管理', 1, '', 0, 0, '', 3),
(22, '通报用户', 1, '46', 21, 0, 'Security/NotifyUser/index', 3),
(23, '通报群组', 1, '47', 21, 0, 'Security/NotifyGroup/index', 3),
(24, '数字字典', 1, '48', 21, 0, 'Security/Dic/index', 3);

-- --------------------------------------------------------

--
-- 表的结构 `storm_auth_group_access`
--

CREATE TABLE IF NOT EXISTS `storm_auth_group_access` (
  `uid` mediumint(8) unsigned NOT NULL,
  `group_id` mediumint(8) unsigned NOT NULL,
  UNIQUE KEY `uid_group_id` (`uid`,`group_id`),
  KEY `uid` (`uid`),
  KEY `group_id` (`group_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `storm_auth_group_access`
--

INSERT INTO `storm_auth_group_access` (`uid`, `group_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(1, 19),
(1, 20),
(1, 21),
(1, 22),
(1, 23),
(1, 24),
(27, 5),
(27, 7),
(27, 8),
(27, 9),
(27, 10),
(28, 1),
(28, 2),
(28, 3),
(28, 4),
(28, 5),
(28, 6),
(29, 15),
(29, 16),
(29, 17),
(29, 18),
(29, 19),
(29, 20),
(29, 21),
(29, 22),
(29, 23),
(29, 24);

-- --------------------------------------------------------

--
-- 表的结构 `storm_auth_rule`
--

CREATE TABLE IF NOT EXISTS `storm_auth_rule` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `name` char(80) NOT NULL DEFAULT '',
  `title` char(20) NOT NULL DEFAULT '',
  `type` tinyint(1) NOT NULL DEFAULT '1',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `condition` char(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=49 ;

--
-- 转存表中的数据 `storm_auth_rule`
--

INSERT INTO `storm_auth_rule` (`id`, `name`, `title`, `type`, `status`, `condition`) VALUES
(32, 'Home/Search/queryByParam', '搜索-按搜索条件查询', 1, 1, ''),
(2, 'Home/InfoCenter/index', '智能节点', 1, 1, ''),
(3, 'Home/InfoCenter/getIndexBarData', '智能节点-获取省网站数排行', 1, 1, ''),
(4, 'Home/InfoCenter/getIndexPieData', '智能节点-网页安全等级统计', 1, 1, ''),
(5, 'Home/InfoCenter/getIndexCount', '智能节点-存储容量统计', 1, 1, ''),
(6, 'Home/InfoCenter/attackEvent', '攻击态势', 1, 1, ''),
(7, 'Home/InfoCenter/getAttackEventJson', '攻击态势-获取SOC数据', 1, 1, ''),
(8, 'Home/InfoCenter/siteAvail', '网站普查', 1, 1, ''),
(9, 'Home/InfoCenter/securityEvent', '安全事件', 1, 1, ''),
(10, 'Home/InfoCenter/getCountSecurityEvent', '安全事件-安全事件总数', 1, 1, ''),
(11, 'Home/InfoCenter/getIndexSecurityEventMap', '安全事件-全国各省份统计数据', 1, 1, ''),
(12, 'Home/InfoCenter/getIndexSecurityEventTop', '安全事件-全国各省安全事件统计Top', 1, 1, ''),
(13, 'Home/InfoCenter/getImg', '安全事件-获取图片', 1, 1, ''),
(16, 'Admin/Role/index', '角色管理', 1, 1, ''),
(15, 'Home/Search/queryResult', '搜索-搜索结果', 1, 1, ''),
(17, 'Admin/Role/listRole', '角色管理-分页查询', 1, 1, ''),
(18, 'Admin/Role/listAllRoleGroup', '角色管理-获取所有权限', 1, 1, ''),
(19, 'Admin/Role/addOrUpdateRole', '角色管理-添加更新角色', 1, 1, ''),
(20, 'Admin/Role/delete', '角色管理-删除角色', 1, 1, ''),
(21, 'Admin/Role/getRoleById', '角色管理-查询角色详情', 1, 1, ''),
(22, 'Admin/User/index', '用户管理', 1, 1, ''),
(23, 'Admin/User/listUser', '用户管理-分页查询', 1, 1, ''),
(24, 'Admin/Role/listAllRole', '用户管理-查询所有角色', 1, 1, ''),
(25, 'Admin/User/getUserById', '用户管理-查询用户详情', 1, 1, ''),
(26, 'Admin/User/addOrUpdateUser', '用户管理-添加更新用户', 1, 1, ''),
(27, 'Admin/User/delete', '删除用户', 1, 1, ''),
(28, 'Admin/VulsPolicy/index', '漏洞策略管理', 1, 1, ''),
(29, 'Admin/VulsPolicy/showlist', '漏洞策略管理-漏洞策略列表', 1, 1, ''),
(30, 'Admin/VulsPolicy/insertOrUpdate', '漏洞策略管理-漏洞策略新增或更新', 1, 1, ''),
(31, 'Admin/VulsPolicy/getOneByVid', '漏洞策略管理-获取漏洞策略', 1, 1, ''),
(33, 'Home/Report/showReport', '查看报告-查看搜索结果报告', 1, 1, ''),
(34, 'Home/Report/exportReport', '查看报告-导出搜索结果报告', 1, 1, ''),
(35, 'Home/Report/sendReport', '查看报告-发送搜索结果报告', 1, 1, ''),
(36, 'Home/Report/getAutoEmailList', '查看报告-获取联系人列表', 1, 1, ''),
(37, 'Home/Report/domainReport', '查看报告-查看单域名报告', 1, 1, ''),
(38, 'Home/Report/exportDomainReport', '查看报告-导出单域名报告', 1, 1, ''),
(39, 'Home/Report/emailDomainReport', '查看报告-发送单域名报告', 1, 1, ''),
(40, 'Security/Index/index', '安全事件-首页', 1, 1, ''),
(41, 'Security/Event/record', '安全事件-事件管理-事件登记', 1, 1, ''),
(42, 'Security/Event/verify', '安全事件-事件管理-事件审核', 1, 1, ''),
(44, 'Security/Event/trace', '安全事件-事件管理-事件跟踪', 1, 1, ''),
(45, 'Security/ESearch/index', '安全事件-事件查询', 1, 1, ''),
(46, 'Security/NotifyUser/index', '安全事件-系统管理-通报用户', 1, 1, ''),
(47, 'Security/NotifyGroup/index', '安全事件-系统管理-通报群组', 1, 1, ''),
(48, 'Security/Dic/index', '安全事件-数字字典', 1, 1, '');

-- --------------------------------------------------------

--
-- 表的结构 `storm_email`
--

CREATE TABLE IF NOT EXISTS `storm_email` (
  `id` int(12) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `address` varchar(128) NOT NULL,
  `group_id` int(12) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `K_EMIAL_GROUP_ID` (`group_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- 转存表中的数据 `storm_email`
--

INSERT INTO `storm_email` (`id`, `name`, `address`, `group_id`) VALUES
(1, '蒋海峰', 'sakoo.jiang@dbappsecurity.com.cn', 1),
(2, '杨勃', 'bob.yang@dbappsecurity.com.cn', 1),
(3, '宋建昌', 'jianchang.song@dbappsecurity.com.cn', 1),
(4, '向超', 'sean.xiang@dbappsecurity.com.cn', 1),
(5, '金丽慧', 'cathrine.jin@dbappsecurity.com.cn', 1),
(6, '俞斌', 'jack.yu@dbappsecurity.com.cn', 1);

-- --------------------------------------------------------

--
-- 表的结构 `storm_email_group`
--

CREATE TABLE IF NOT EXISTS `storm_email_group` (
  `id` int(12) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `storm_email_group`
--

INSERT INTO `storm_email_group` (`id`, `name`) VALUES
(1, '默认分组');

-- --------------------------------------------------------

--
-- 表的结构 `storm_log`
--

CREATE TABLE IF NOT EXISTS `storm_log` (
  `id` int(12) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `handle_type` int(3) DEFAULT NULL,
  `content` text COMMENT '日志内容和备注信息',
  `req_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '请求时间',
  `req_ip` varchar(32) DEFAULT NULL COMMENT '请求的客户端IP',
  `user_id` int(12) DEFAULT '0' COMMENT '操作用户',
  `result` int(1) DEFAULT '0' COMMENT '操作结果 1:成功 2:失败',
  PRIMARY KEY (`id`),
  KEY `K_HANDLE_TYPE` (`handle_type`),
  KEY `K_LOG_USER_ID` (`user_id`),
  KEY `K_LOG_RESULT` (`result`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=29 ;

--
-- 转存表中的数据 `storm_log`
--

INSERT INTO `storm_log` (`id`, `handle_type`, `content`, `req_time`, `req_ip`, `user_id`, `result`) VALUES
(2, 2, './report/zip/15-05-20/export_15-05-20_15-01-47.zip', '2015-05-20 07:01:47', '0.0.0.0', 1, 1),
(3, 1, '{"list":["sakoo.jiang@dbappsecurity.com.cn",null],"file":".\\/report\\/zip\\/15-05-20\\/email_15-05-20_15-09-30.zip"}', '2015-05-20 07:09:43', '0.0.0.0', 1, 1),
(4, 1, '{"list":["sakoo.jiang@dbappsecurity.com.cn",null],"file":".\\/report\\/zip\\/15-05-20\\/email_15-05-20_15-11-50.zip"}', '2015-05-20 07:12:00', '0.0.0.0', 1, 1),
(5, 1, '{"list":["sakoo.jiang@dbappsecurity.com.cn",null],"file":".\\/report\\/zip\\/15-05-20\\/email_15-05-20_15-13-28.zip"}', '2015-05-20 07:13:36', '0.0.0.0', 1, 1),
(6, 1, '{"list":["sakoo.jiang@dbappsecurity.com.cn",null],"file":".\\/report\\/zip\\/15-05-20\\/email_15-05-20_15-16-14.zip"}', '2015-05-20 07:16:22', '0.0.0.0', 1, 1),
(7, 1, '{"list":["sakoo.jiang@dbappsecurity.com.cn","17317070@qq.com",null],"file":".\\/report\\/zip\\/15-05-20\\/email_15-05-20_15-21-36.zip"}', '2015-05-20 07:21:42', '0.0.0.0', 1, 1),
(8, 2, './report/zip/15-05-20/export_15-05-20_17-15-35.zip', '2015-05-20 09:15:35', '0.0.0.0', 2, 1),
(9, 2, './report/zip/15-05-20/export_15-05-20_17-34-26.zip', '2015-05-20 09:34:26', '0.0.0.0', 1, 1),
(10, 2, './report/zip/15-05-21/export_15-05-21_18-58-58.zip', '2015-05-21 10:58:58', '0.0.0.0', 2, 1),
(11, 1, '{"list":["jianchang.song@dbappsecurity.com.cn","sakoo.jiang@dbappsecurity.com.cn"],"file":".\\/report\\/zip\\/15-05-27\\/email_15-05-27_18-48-08.zip"}', '2015-05-27 10:48:10', '0.0.0.0', 1, 1),
(12, 11, '{"data":{"code":1,"total":0,"msg":null,"items":[],"data":{"title":"\\u9ad8\\u90ae\\u5e02\\u56fd\\u571f\\u8d44\\u6e90\\u5c40","province":"\\u6d59\\u6c5f\\u7701","domain":"www.gygt.gov.cn","RegistrantId":"hc550613025-cn","server":"Apache-Coyote\\/1.1","RegistrantName":"\\u9ad8\\u90ae\\u5e02\\u56fd\\u571f\\u8d44\\u6e90\\u5c40","city":"\\u676d\\u5dde\\u5e02"},"other":null},"actionName":"webInfo"}', '2015-06-18 03:02:09', '127.0.0.1', 0, 1),
(13, 11, '{"data":{"code":1,"total":0,"msg":null,"items":[],"data":[],"other":null},"actionName":"webScoreInfo"}', '2015-06-18 03:02:09', '127.0.0.1', 0, 1),
(14, 11, '{"data":{"code":1,"total":0,"msg":null,"items":[],"data":[],"other":null},"actionName":"webAvailStatistics"}', '2015-06-18 03:02:11', '127.0.0.1', 0, 1),
(15, 11, '{"data":{"code":1,"total":0,"msg":null,"items":[],"data":[],"other":null},"actionName":"webServerStatistics"}', '2015-06-18 03:02:11', '127.0.0.1', 0, 1),
(16, 11, '{"data":{"code":0,"total":0,"msg":"\\u672a\\u67e5\\u8be2\\u5230\\u8be5web\\u670d\\u52a1\\u5668\\u5bf9\\u5e94\\u7684\\u6307\\u7eb9\\u4fe1\\u606f","items":[],"data":[],"other":null},"actionName":"webServerVersionStatistics"}', '2015-06-18 03:02:11', '127.0.0.1', 0, 1),
(17, 11, '{"data":{"code":1,"total":0,"msg":null,"items":[],"data":{"title":"\\u9ad8\\u90ae\\u5e02\\u56fd\\u571f\\u8d44\\u6e90\\u5c40","province":"\\u6d59\\u6c5f\\u7701","domain":"www.gygt.gov.cn","RegistrantId":"hc550613025-cn","server":"Apache-Coyote\\/1.1","RegistrantName":"\\u9ad8\\u90ae\\u5e02\\u56fd\\u571f\\u8d44\\u6e90\\u5c40","city":"\\u676d\\u5dde\\u5e02"},"other":null},"actionName":"webInfo","user":"outerUser1"}', '2015-06-18 03:03:53', '127.0.0.1', 0, 1),
(18, 11, '{"data":{"code":1,"total":0,"msg":null,"items":[],"data":[],"other":null},"actionName":"webScoreInfo","user":"outerUser1"}', '2015-06-18 03:03:53', '127.0.0.1', 0, 1),
(19, 11, '{"data":{"code":1,"total":0,"msg":null,"items":[],"data":[],"other":null},"actionName":"webAvailStatistics","user":"outerUser1"}', '2015-06-18 03:03:55', '127.0.0.1', 0, 1),
(20, 11, '{"data":{"code":1,"total":0,"msg":null,"items":[],"data":[],"other":null},"actionName":"webServerStatistics","user":"outerUser1"}', '2015-06-18 03:03:55', '127.0.0.1', 0, 1),
(21, 11, '{"data":{"code":0,"total":0,"msg":"\\u672a\\u67e5\\u8be2\\u5230\\u8be5web\\u670d\\u52a1\\u5668\\u5bf9\\u5e94\\u7684\\u6307\\u7eb9\\u4fe1\\u606f","items":[],"data":[],"other":null},"actionName":"webServerVersionStatistics","user":"outerUser1"}', '2015-06-18 03:03:55', '127.0.0.1', 0, 1),
(22, 11, '{"data":{"code":1,"total":0,"msg":null,"items":[],"data":{"title":"\\u9ad8\\u90ae\\u5e02\\u56fd\\u571f\\u8d44\\u6e90\\u5c40","province":"\\u6d59\\u6c5f\\u7701","domain":"www.gygt.gov.cn","RegistrantId":"hc550613025-cn","server":"Apache-Coyote\\/1.1","RegistrantName":"\\u9ad8\\u90ae\\u5e02\\u56fd\\u571f\\u8d44\\u6e90\\u5c40","city":"\\u676d\\u5dde\\u5e02"},"other":null},"actionName":"webInfo","user":"outerUser1"}', '2015-06-18 03:34:44', '127.0.0.1', 0, 1),
(23, 11, '{"data":{"code":0,"total":0,"msg":null,"items":[],"data":[],"other":null},"actionName":"webInfo","user":"outerUser1"}', '2015-06-18 03:35:35', '127.0.0.1', 0, 1),
(24, 11, '{"data":{"code":0,"total":0,"msg":null,"items":[],"data":[],"other":null},"actionName":"webInfo","user":"outerUser1"}', '2015-06-18 03:36:19', '127.0.0.1', 0, 1),
(25, 11, '{"data":{"code":1,"total":0,"msg":null,"items":[],"data":{"domain":"www.hzbank.gov.cn","RegistrantId":"UNKNOW","RegistrantName":"UNKNOW"},"other":null},"actionName":"webInfo","user":"outerUser1"}', '2015-06-18 03:37:18', '127.0.0.1', 0, 1),
(26, 11, '{"data":{"code":1,"total":0,"msg":null,"items":[],"data":{"domain":"hzbank.gov.cn","RegistrantId":"UNKNOW","RegistrantName":"UNKNOW"},"other":null},"actionName":"webInfo","user":"outerUser1"}', '2015-06-18 03:37:29', '127.0.0.1', 0, 1),
(27, 11, '{"data":{"code":1,"total":0,"msg":null,"items":[],"data":{"title":"\\u9ad8\\u90ae\\u5e02\\u56fd\\u571f\\u8d44\\u6e90\\u5c40","province":"\\u6d59\\u6c5f\\u7701","domain":"www.gygt.gov.cn","RegistrantId":"hc550613025-cn","server":"Apache-Coyote\\/1.1","RegistrantName":"\\u9ad8\\u90ae\\u5e02\\u56fd\\u571f\\u8d44\\u6e90\\u5c40","city":"\\u676d\\u5dde\\u5e02"},"other":null},"actionName":"webInfo","user":"outerUser1"}', '2015-06-18 03:37:42', '127.0.0.1', 0, 1),
(28, 11, '{"data":[],"actionName":"webinfo","user":""}', '2015-06-22 07:13:05', '127.0.0.1', 0, 1);

-- --------------------------------------------------------

--
-- 表的结构 `storm_role`
--

CREATE TABLE IF NOT EXISTS `storm_role` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=30 ;

--
-- 转存表中的数据 `storm_role`
--

INSERT INTO `storm_role` (`id`, `name`) VALUES
(1, '管理员'),
(27, '值班人员'),
(28, '普通用户'),
(29, '安全事件管理员');

-- --------------------------------------------------------

--
-- 表的结构 `storm_security_event`
--

CREATE TABLE IF NOT EXISTS `storm_security_event` (
  `security_event_id` int(11) NOT NULL AUTO_INCREMENT,
  `security_event_img_path` varchar(255) DEFAULT NULL,
  `security_event_type` varchar(255) DEFAULT NULL COMMENT '1博彩，2反共，3暗链',
  `security_event_domain` varchar(255) DEFAULT NULL,
  `security_event_title` varchar(255) DEFAULT NULL,
  `security_event_time` datetime DEFAULT NULL,
  `security_event_province` varchar(255) DEFAULT NULL,
  `security_event_city` varchar(255) DEFAULT NULL,
  `security_event_sender` varchar(255) DEFAULT NULL,
  `security_event_description` varchar(255) DEFAULT NULL,
  `security_event_status` varchar(255) DEFAULT NULL COMMENT '1未处理,2审核通过,3审核不通过,4提交失败',
  `security_event_error_info` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`security_event_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- 转存表中的数据 `storm_security_event`
--

INSERT INTO `storm_security_event` (`security_event_id`, `security_event_img_path`, `security_event_type`, `security_event_domain`, `security_event_title`, `security_event_time`, `security_event_province`, `security_event_city`, `security_event_sender`, `security_event_description`, `security_event_status`, `security_event_error_info`) VALUES
(2, 'D:/upload/2015-06-17/1434529688682__10.jpg', '2', 'www.baidu.com', '百度', '2015-06-17 15:30:00', '北京', '东城区', 'admin', '该网站存在非法内容', '2', NULL),
(4, 'D:/upload/2015-06-18/1434621202102__123.jpg', '1', 'sxazj.gov.cn', '绍兴县建设工程安全质量监督站', '2014-07-18 17:50:00', '浙江', '绍兴', 'admin', '被黑', '3', '域名表不存在该安全事件域名！');

-- --------------------------------------------------------

--
-- 表的结构 `storm_user`
--

CREATE TABLE IF NOT EXISTS `storm_user` (
  `id` int(12) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `name` varchar(64) NOT NULL,
  `password` char(32) NOT NULL,
  `email` varchar(40) DEFAULT NULL,
  `role_id` int(12) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `K_ROLE_ID` (`role_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=26 ;

--
-- 转存表中的数据 `storm_user`
--

INSERT INTO `storm_user` (`id`, `username`, `name`, `password`, `email`, `role_id`) VALUES
(1, 'admin', '风暴中心', 'b181f1c2422af48382282a1036dbac5b', '', 1),
(21, 'sakoo', 'sakoo.jiang', 'e10adc3949ba59abbe56e057f20f883e', 'sakoo.jiang@dbappsecurity.com.cn', 1),
(22, 'jcxy', '警察学院', '6f31a23082bfc8d21ac18c68201641c3', '', 28),
(23, 'zhiban', '值班', 'e10adc3949ba59abbe56e057f20f883e', '', 27),
(24, 'bob', 'bob.yang', '86b28c0a1c4b56afaf3fd42133b3c250', 'bob.yang@dbappsecurity.com.cn', 1),
(25, 'security', 'security', 'e10adc3949ba59abbe56e057f20f883e', '', 29);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
