<?php
/**
 * Created by PhpStorm.
 * User: haris
 * Date: 11.6.17
 * Time: 06:29
 */

namespace Ibuntu\Services;



use Ibuntu\Libraries\FileZipper;
use Ibuntu\Models\Assignment;
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
        $courses = Course::find('all', ['include' => ['course_schedule', 'department', 'course_requests', 'course_files', 'users', 'assignments']]);//'assignments'
        $serializedCourses = [];

        foreach($courses as $course){
            if($course->professor_id == $professorId){
                $serializedCourses[] = $course->serializeWithScheduleDepartmentAndUser();
            }
        }

        return $serializedCourses;
    }

    public function retrieveStudentCourses($departmentId, $userId){
        /** @var Course[] $courses */
        $courses = Course::all(['include' => ['course_schedule', 'department', 'course_requests', 'course_files', 'users', 'assignments']]);
        $serializedCourses = [];
        foreach($courses as $course){
            if($course->department_id == $departmentId){
                $userRequest = '';
                foreach($course->course_requests as $request){
                    if($request->send_by_user_id == $userId){
                        $userRequest = $request->serialize();
                    }
                }
                $course = $course->serializeWithScheduleDepartmentAndUser();
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

    public function storeAssignmentFiles($courseId, $files, $fileName){
        /** @var Course $course */
        $course = Course::find($courseId);

        $courseName = explode(" ", $course->course_name);
        $courseName = implode("_", $courseName)."Assignemnt";

        $path = $this->fileZipper->zipFiles($courseName, $files, $fileName);

        return $path;
    }

    public function createCourseAssignment($courseId, $title, $description, $date, $files){
        $fileName = explode(" ", $title);
        $fileName = implode("_", $fileName)."assignemnt";

        $time = strtotime($date);

        $newformat = date('Y-m-d',$time);

        $path = $this->storeAssignmentFiles($courseId, $files['file'], $fileName);

        /** @var Assignment $assignment */
        $assignment = Assignment::create([
            "name" => $title,
            "description" => $description,
            "course_id" => $courseId,
            "due_date" => $newformat,
            "url" => $path
        ]);

        return $assignment->serialize();
    }

    public function deleteAssignment($assignmentId)
    {
        try{
            /** @var Assignment $assignment */
            $assignment = Assignment::find($assignmentId);
            $this->fileZipper->deleteZippedFiles($assignment->url);
            $assignment->delete();
        }catch (Exception $e){
            return false;
        }

        return true;
    }

    public function updateAssignment($id, $title, $description, $date)
    {
        /** @var Assignment $assignment */
        $assignment = Assignment::find($id);
        $assignment->name = $title;
        $assignment->description = $description;
        $assignment->due_date = $date;
        $assignment->save();

        return $assignment->serialize();
    }
}