<?php
/**
 * Created by PhpStorm.
 * User: haris
 * Date: 15.6.17
 * Time: 02:56
 */

namespace Ibuntu\Models;


use ActiveRecord\Model;

class CourseFiles extends Model
{
    static $table_name = "course_files";

    public function serialize(){
        return $this->to_array();
    }
}