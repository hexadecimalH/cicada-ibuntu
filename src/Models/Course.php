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
            "class_name" => 'CourseSchedule',
        ],
        [
            "course_requests",
            "class_name" => "CourseRequest",
            'foreign_key' => 'for_course_id'
        ],
        [
            "course_files",
            "class_name" => "CourseFiles",
            'foreign_key' => 'course_id'
        ],
        [
            "assignments",
            "class_name" => "Assignment",
            'foreign_key' => 'course_id'
        ]
    ];
    static $belongs_to = [
        ['department'],
        [
            "users",
            "class_name" => "User",
            'foreign_key' => 'professor_id'
        ],
    ];

    public function serialize(){
        return $this->to_array();
    }

    public function serializeWithScheduleAndDepartment(){
        return $this->to_array([
            'include'=> ['course_schedule', 'department']
        ]);
    }

    public function serializeWithScheduleDepartmentAndUser(){
        return $this->to_array([
            'include'=> ['course_schedule', 'department', 'course_requests', 'course_files', 'users', 'assignments' ]
        ]);
    }

}
