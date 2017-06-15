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

    static $has_many = [
        [
            'professor',
            'class_name' => 'Professor'
        ],
        [
            'student',
            'class_name' => 'Student'
        ]
    ];

    public function serialize(){
        return $this->to_array();
    }

    public function serializeWithProfessor(){
        return $this->to_array([
            'include'=> ['professor']
        ]);
    }
    public function serializeWithStudent(){
        return $this->to_array([
            'include'=> ['student']
        ]);
    }
}