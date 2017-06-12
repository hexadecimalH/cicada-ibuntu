<?php
/**
 * Created by PhpStorm.
 * User: haris
 * Date: 7.6.17
 * Time: 00:02
 */

namespace Ibuntu\Models;


use ActiveRecord\Model;

class University extends Model
{
    static $table_name = "university";

    static $has_many = [
        [
            'faculty',
            'class_name' => 'Faculty'
        ]
    ];

    public function serialize(){
        return $this->to_array([
            'include' =>
                [ 'faculty' =>
                    [
                        'include' =>
                            [
                                'department'
                            ]
                    ]
                ]
            ]);
    }
}