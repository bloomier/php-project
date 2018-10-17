<?php
namespace app\common\controller;

use think\Controller;
use app\common\model\User;
use app\common\model\Arctype;
use app\common\model\Navigation;
use app\common\model\Config;
use app\common\model\TokenUser;
use app\common\model\Music;

// 基础控制器

class Base extends Controller {

	//当前 UID
	public $uid;

    public function initialize() {
        $this->uid = session('userId');
    	define('H_NAME', request()->domain());	//获取当前域名,包含"http://"
        define('M_NAME', request()->module());	//当前模块名称
        define('C_NAME', request()->controller());	//当前控制器名称
        define('A_NAME', request()->action());	//当前操作名称
        $box_is_pjax = request()->isPjax();
        $this->assign('box_is_pjax', $box_is_pjax);
        $this->assign('empty', '<div class="media box box-solid x-p-10"><div class="media-body text-center">暂时没有数据</div></div>');   //没有数据模版
		if( !empty($this->uid) ){
			$user = User::get( ['id' => $this->uid] );
			$user->userInfo;
			$this->assign('user',$user);
		}else{
			$this->assign('user',$user['id']=0);
		}
		$this->jiaZaiDaoHang();
		$music = new Music();
		$bd_yinyue = $music->where(['status'=>1])->order('orderby ASC,id desc')->select();
		$bd_yinyue = json_encode($bd_yinyue);	//音乐源,本地

		$this->assign('is_music',confv('is_music','music'));	//是否开启音乐播放器
		$this->assign('is_AutoPlay',confv('is_AutoPlay','music'));	//是否自动播放
		$music_type = confv('music_type','music');	//音乐数据类型,网易/本地
		$wy_yinyue = confv('wy_yinyue','music');	//音乐源,网易
		if( $music_type == 'file' ){
			if( !empty($bd_yinyue) ){
				$this->assign('music_type',$music_type);
				$this->assign('YinYueData',$bd_yinyue);
			}else{
				$this->assign('YinYueData',$wy_yinyue);
				$this->assign('music_type','cloud');
			}
		}else{
			$this->assign('music_type',$music_type);
			$this->assign('YinYueData',$wy_yinyue);
		}
        $is_login = $this->restLogin();
		if( !empty($is_login) ){
			return true;
		}

	}

	protected function jiaZaiDaoHang(){//加载导航
		$Navigation = new Navigation();
		if(!empty($this->uid)){
			$this->assign('mDaoHangList', $Navigation->daoHang( [2,4]) );//网站导航/会员中心网站导航
		}else{
			$this->assign('mDaoHangList', $Navigation->daoHang([2]) );//网站导航
		}
		$list = cache('DB_COMMIN_ARCTYPE');
		if(!$list){
	        $list = Arctype::where(['status'=>1,'is_daohang'=>1])->order('sorts ASC,id ASC')->select();
	        foreach ($list as $k => $v){
	            $v->arctypeMod;
				$lists = Arctype::where(['pid'=>$v['id'],'status'=>1,'is_daohang'=>1])->order('sorts ASC,id ASC')->count();
				if( $lists > 0 ){
					$v['dirs'] = null;
					$v['jumplink'] = null;
				}
	        }
	        $treeClass = new \expand\Tree();
	        $list = $treeClass->create($list);
			cache('DB_COMMIN_ARCTYPE', $list);
		}
		$this->assign('arcList', $list );	//文章导航
	}

    protected function restLogin() {
        if (empty($this->uid)){   //未登录
            session('userId', null);
        	session('user_token', null);
			return '请登录';
        }
        $config = new Config();
        $login_time = $config->where(['type'=>'system', 'k'=>'login_time'])->value('v');
        $now_token = session('user_token');   //当前token
        $tkModel = new TokenUser();
        $db_token = $tkModel->where(['uid'=>$this->uid, 'type'=>'1'])->find();   //数据库token
        if ($db_token['token'] != $now_token){   //其他地方登录
            session('userId', null);
        	session('user_token', null);
			return '其他地方登录';
        }else{
            if ($db_token['token_time'] < time()){   //登录超时
                session('userId', null);
        		session('user_token', null);
				return '登录超时';
            }else{
                $token_time = time() + $login_time;
                $data = ['token_time' => $token_time];
                $tkModel->where(['uid'=>$this->uid, 'type'=>'1'])->update($data);
				return false;
            }
        }
    }

}
