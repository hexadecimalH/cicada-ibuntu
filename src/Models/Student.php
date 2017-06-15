<?php
/**
 * Created by PhpStorm.
 * User: haris
 * Date: 7.6.17
 * Time: 17:37
 */

namespace Ibuntu\Models;


use ActiveRecord\Model;

class Student extends Model
{
    static $table_name = "student";

    static $belongs_to = [
        [
            'department'
        ],
        [
            'user'
        ]
    ];
}