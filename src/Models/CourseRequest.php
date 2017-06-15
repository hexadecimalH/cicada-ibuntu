<?php
/**
 * Created by PhpStorm.
 * User: haris
 * Date: 12.6.17
 * Time: 23:13
 */

namespace Ibuntu\Models;


use ActiveRecord\Model;

class CourseRequest extends Model
{
    static $table_name = "course_requests";

    static $belongs_to = [
        ['users', 'class_name' => 'User', 'foreign_key' => 'send_by_user_id'],
        ['course', 'class_name' => 'Course', 'foreign_key' => 'for_course_id']
    ];

    public function serialize(){
        return $this->to_array();
    }

    public function serializeWithUsers(){
        return $this->to_array([
            'include' => ['users' => ['include' => ['student' => ['include' => ['department']]]]]
        ]);
    }
}