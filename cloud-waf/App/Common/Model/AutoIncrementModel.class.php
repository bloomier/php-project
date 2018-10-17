<?php

namespace Common\Model;
use Think\Model\MongoModel;
Class AutoIncrementModel extends MongoModel {
    Protected $_idType = self::TYPE_INT;
    protected $_autoinc =  true;
    // 插入数据前的回调方法
    protected function _before_insert(&$data,$options) {
        // 写入数据到数据库
        if($this->_autoinc && $this->_idType== self::TYPE_INT) { // 主键自动增长
            $pk   =  $this->getPk();
            if(!isset($data[$pk])) {
                $data[$pk]   =  $this->db->getMongoNextId($pk);
            }else{
                $data[$pk]=intval($data[$pk]);
            }
        }
    }
    // 表达式过滤回调方法
    protected function _options_filter(&$options) {
        $id = $this->getPk();
        if(isset($options['where'][$id]) && is_scalar($options['where'][$id]) && $this->_idType== self::TYPE_OBJECT) {
            $options['where'][$id] = new \MongoId($options['where'][$id]);
        }
        if(isset($options['where'][$id])&& $this->_idType== self::TYPE_INT) {
            if(is_string($options['where'][$id])){
                $options['where'][$id]=intval($options['where'][$id]);
            }

        }
    }

    protected function _before_update(&$data,&$options) {
        $id = $this->getPk();
        if(isset($options['where'][$id])&& $this->_idType== self::TYPE_INT) {
            $options['where'][$id]=intval($options['where'][$id]);
        }
    }
    protected function _before_delete(&$options)
    {
        $id = $this->getPk();
        if (isset($options['where'][$id]) && $this->_idType == self::TYPE_INT) {
            if (is_string($options['where'][$id])) {
                $options['where'][$id] = intval($options['where'][$id]);
            }

        }
    }



}