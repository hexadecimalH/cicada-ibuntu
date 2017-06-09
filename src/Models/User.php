<?php

/**
 * Created by PhpStorm.
 * User: haris
 * Date: 31.5.17
 * Time: 00:17
 */

namespace Ibuntu\Models;

use ActiveRecord\Model;

class User extends Model
{
    static $table_name = 'users';

    public function serialize(){
        return $this->to_array();
    }
}