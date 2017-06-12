<?php
/**
 * Created by PhpStorm.
 * User: haris
 * Date: 11.6.17
 * Time: 06:29
 */

namespace Ibuntu\Services;



use Ibuntu\Models\Course;
use Ibuntu\Models\CourseSchedule;

class DashboardService
{
    function __construct()
    {
    }

    public function storeCourseData($all, $departmentId, $professorId){
        /** @var Course $course */
        $course = Course::create([
            'course_name' => $all['course_name'],
            'department_id' => $departmentId,
            'year' => $all['year'],
            'professor_id' => $professorId,
            'semester' => $all['semester']
        ]);

        $scheduledDays = explode(',', $all['scheduled_days']);

        $this->createWorkingTimeForCourse($course->id, $scheduledDays, $all);
        $course = Course::find($course->id,['include' => ['course_schedule', 'department'] ]);
        return $course->serializeWithScheduleAndDepartment();

    }
    public function createWorkingTimeForCourse($courseId, $scheduledDays, $all){
        foreach($scheduledDays as $day){
            CourseSchedule::create([
                'day' => $day,
                'duration' => $all[$day],
                'course_id' => $courseId
            ]);
        }
    }

    public function retrieveProfessorCourses($professorId){
        /** @var Course[] $courses */
        $courses = Course::all(['include' => ['course_schedule', 'department']]);
        $serializedCourses = [];
        foreach($courses as $course){
            if($course->professor_id == $professorId){
                $serializedCourses[] = $course->serializeWithScheduleAndDepartment();
            }
        }
        return $serializedCourses;
    }

    public function getCourse($id){
        $course = Course::find($id, ['include' => ['course_schedule', 'department']]);
        return $course;
    }
}