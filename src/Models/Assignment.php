<?php
/**
 * Created by PhpStorm.
 * User: haris
 * Date: 17.6.17
 * Time: 00:56
 */

namespace Ibuntu\Models;


use ActiveRecord\Model;

class Assignment extends Model
{
    static $table_name = "assignments";

    public function serialize(){
        return $this->to_array();
    }
}