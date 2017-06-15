<?php
/**
 * Created by PhpStorm.
 * User: haris
 * Date: 11.6.17
 * Time: 06:29
 */

namespace Ibuntu\Services;



use Ibuntu\Libraries\FileZipper;
use Ibuntu\Models\Course;
use Ibuntu\Models\CourseFiles;
use Ibuntu\Models\CourseRequest;
use Ibuntu\Models\CourseSchedule;
use Symfony\Component\Config\Definition\Exception\Exception;

class DashboardService
{
    /** @var  FileZipper $fileZipper */
    public $fileZipper;

    function __construct($fileZipper)
    {
        $this->fileZipper = $fileZipper;
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
        $courses = Course::all(['include' => ['course_schedule', 'department', 'course_files' ]]);
        $serializedCourses = [];
        foreach($courses as $course){
            if($course->professor_id == $professorId){
                $serializedCourses[] = $course->serializeWithScheduleAndDepartment();
            }
        }
        return $serializedCourses;
    }

    public function retrieveStudentCourses($departmentId, $userId){
        /** @var Course[] $courses */
        $courses = Course::all(['include' => ['course_schedule', 'department', 'course_requests', 'professor' => ['include' => 'user']]]);
        $serializedCourses = [];
        foreach($courses as $course){
            if($course->department_id == $departmentId){
                $userRequest = '';
                foreach($course->course_requests as $request){
                    if($request->send_by_user_id == $userId){
                        $userRequest = $request->serialize();
                    }
                }
                $course = $course->serializeWithScheduleAndDepartment();
                $course['request'] = $userRequest;
                $serializedCourses[] = $course;
            }
        }
        return $serializedCourses;
    }

    public function getCourse($id){
        $course = Course::find($id, ['include' => ['course_schedule', 'department']]);
        return $course;
    }

    public function storeRequest($userId, $courseId){
        /** @var CourseRequest $courseRequest */
        $courseRequest = CourseRequest::create([
            'send_by_user_id' => $userId,
            'for_course_id' => (int)$courseId,
            'status' => 'pending'
        ]);

        return $courseRequest->serialize();
    }

    public function removeRequest($requestId){
        /** @var CourseRequest $courseRequest */
        $courseRequest = CourseRequest::find($requestId);
        $courseRequest->delete();
    }

    public function getRequestsForCourse($courseId){
        /** @var CourseRequest[] $courseRequest */
        $courseRequest = CourseRequest::all(['include' => ['users' ]]);
        $requestSerialized = [];
        foreach($courseRequest as $request){
            if($request->for_course_id == $courseId){
                $requestSerialized[] = $request->serializeWithUsers();
            }
        }

        return $requestSerialized;
    }

    public function approveRequestForCourse($requestId){
        /** @var CourseRequest $courseRequest */
        $courseRequest = CourseRequest::find($requestId);
        $courseRequest->status = "approved";
        $courseRequest->save();
        return $courseRequest->serialize();
    }

    public function storeCourseInfo($info, $courseId){
        /** @var Course $course */
        $course = Course::find($courseId);
        $course->info = $info;
        $course->save();

        return $course->serialize();
    }

    public function storeFiles($courseId, $files, $fileName){
        /** @var Course $course */
        $course = Course::find($courseId);

        $courseName = explode(" ", $course->course_name);
        $courseName = implode("_", $courseName);

        $path = $this->fileZipper->zipFiles($courseName, $files, $fileName);

        /** @var CourseFiles $zippedFiles */
        $zippedFiles = CourseFiles::create([
            "course_id" => $courseId,
            "file_name" => $fileName,
            "url" => $path
        ]);

        return $zippedFiles->serialize();
    }

    public function deleteFile($fileId){
        try{
            /** @var CourseFiles $courseFiles */
            $courseFiles = CourseFiles::find($fileId);
            $this->fileZipper->deleteZippedFiles($courseFiles->url);
            $courseFiles->delete();
        }catch (Exception $e){
            return false;
        }

        return true;
    }
}