<?php
/**
 * Created by PhpStorm.
 * User: haris
 * Date: 11.6.17
 * Time: 21:30
 */

namespace Ibuntu\Models;


use ActiveRecord\Model;

class Course extends Model
{
    static $table_name = "course";

    static $has_many = [
        [
            "course_schedule",
            "class_name" => 'CourseSchedule'
        ]
    ];
    static $belongs_to = [
        ['department']
    ];

    public function serialize(){
        return $this->to_array();
    }

    public function serializeWithScheduleAndDepartment(){
        return $this->to_array([
            'include'=> ['course_schedule', 'department']
        ]);
    }
}