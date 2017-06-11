<?php
/**
 * Created by PhpStorm.
 * User: haris
 * Date: 7.6.17
 * Time: 01:38
 */

namespace Ibuntu\Models;


use ActiveRecord\Model;

class Faculty extends Model
{
    static $table_name = "faculty";

    static $has_many = [
        [
            'department',
            'class_name' => 'Department'
        ]
    ];

    public function serialize(){
        return $this->to_array();
    }
}