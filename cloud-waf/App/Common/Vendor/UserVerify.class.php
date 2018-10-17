<?php
namespace Common\Vendor;
use Common\Model\AutoIncrementModel;

class UserVerify  {
    public function checkActions($user,$withCommon){
        //如果是系统管理员或者用户id等于1，将拥有所有权限
        if($user['_id']==1 || $user['isSystemRole']){
            $md=new AutoIncrementModel(Constants::$DB_AUTH_ACTION);
            $action=$md->where(array(status=>1))->order("seq asc")->select();
            $actions= array_values($action);
        }else{

            $md=new AutoIncrementModel(Constants::$DB_AUTH_ROLE);
            $role_ids=$user['roles'];
            $where=array();
            $where["_id"]=array("in",$role_ids);
            $roles=$md->where($where)->select();
            $rule_ids=array();
            foreach(array_values($roles) as $role){
                $rule_ids=array_merge($rule_ids,$role['rules']);
            }
            $rule_ids=array_unique($rule_ids);
            $md=new AutoIncrementModel(Constants::$DB_AUTH_ACTION);
            $where=array();
            $where["_id"]=array("in",array_values($rule_ids));
            $where['status']=1;
            $where['_logic']='and';
            $action=$md->where($where)->order("seq asc")->select();
            $actions= array_values($action);
        }
        if($withCommon){

            //所有用户都要加上个人设置的权限
            $actions[]= array(
                _id=>1098,name=>"Admin/Setting/index",title=>"个人设置",is_menu=>0,pid=>1000,seq=>1098,status=>1
            );
            $actions[]= array(
                _id=>109801,name=>"Admin/Setting/update",title=>"更新个人设置",is_menu=>0,pid=>1098,seq=>109801,status=>1
            );
        }

        return $actions;


    }

    public function  checkMenus($actions){
        $menus=array();
        foreach($actions as $ac ){
            if($ac['is_menu']==1){
                $menus[]=$ac;
            }
        }
        return $menus;
    }

    public function getFirstAction($menus){
        foreach($menus as $menu){
            if($menu['name']){
                return $menu['name'];
            }
        }
        return "Admin/Setting/index";
    }

    public function checkPermissions($actions){
        $permissions=array();
        foreach($actions as $ac){
            $name=strtolower($ac['name']);
            if($name){
                $permissions[]=$name;
            }
            if($ac['child_actions']){
                foreach($ac['child_actions'] as $c_ac){
                    if($c_ac['name']){
                        $permissions[]=strtolower($c_ac['name']);
                    }
                }
            }
        }
        return $permissions;
    }


}