<?php
/**
 * Created by PhpStorm.
 * User: haris
 * Date: 7.6.17
 * Time: 15:27
 */

namespace Ibuntu\Models;


use ActiveRecord\Model;

class Professor extends Model
{
    static $table_name = "professor";
    static $has_many = [
        'user',
        'class_name' => 'User'
    ];
    static $belongs_to = [
        [
            'department'
        ],
        [
            'user'
        ]
    ];
}