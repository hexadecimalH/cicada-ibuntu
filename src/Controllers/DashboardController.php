<?php
/**
 * Created by PhpStorm.
 * User: haris
 * Date: 11.6.17
 * Time: 06:24
 */

namespace Ibuntu\Controllers;


use Ibuntu\Application;
use Ibuntu\Models\Course;
use Ibuntu\Services\DashboardService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class DashboardController
{
    /** @var  DashboardService $dashboardService */
    public $dashboardService;

    /** @var  \Twig_Environment $twig */
    public $twig;

    public function __construct($dashboardService, $twig)
    {
        $this->dashboardService = $dashboardService;
        $this->twig = $twig;
    }

    public function createCourse(Application $app, Request $request){
        $user = $request->get('user');
        $departmentId = $user['department_id'];
        $professorId = $user['id'];
        $all = $request->request->all();

        $course = $this->dashboardService->storeCourseData($all, $departmentId, $professorId);

        return new JsonResponse($course);
    }

    public function getProfessorCourses(Application $app, Request $request){
        $user = $request->get('user');
        $professorId = $user['id'];
        $courses = $this->dashboardService->retrieveProfessorCourses($professorId);

        return new JsonResponse($courses);
    }

    public function getStudentCourses(Application $app, Request $request){
        $user = $request->get('user');
        $departmentId = $user['department_id'];
        $courses = $this->dashboardService->retrieveStudentCourses($departmentId, $user['id']);

        return new JsonResponse($courses);
    }

    public function toCoursePage(Application $app, Request $request, $courseId){
        $user = $request->get('user');
        $course = $this->dashboardService->getCourse($courseId);

        return $this->twig->render($user['type'].'/course.twig', ['user' => $user, "page" => "course", "course" => $course, "department" => $course->department]);
    }

    public function createRequest(Application $app, Request $request, $courseId){
        $user = $request->get('user');

        $courseRequest = $this->dashboardService->storeRequest($user['id'], $courseId);

        return new JsonResponse($courseRequest);
    }

    public function removeCourseRequest(Application $app, Request $request, $requestId){
        $user = $request->get('user');
        $this->dashboardService->removeRequest($requestId);

        return new JsonResponse("Request Succesfully Deleted" , 200);
    }

    public function getRequestsForCourse(Application $app, Request $request, $courseId){
        $user = $request->get('user');

        $requests = $this->dashboardService->getRequestsForCourse($courseId);

        return new JsonResponse($requests);
    }

    public function approveRequest(Application $app, Request $request, $requestId){
        $user = $request->get('user');

        $courseRequest = $this->dashboardService->approveRequestForCourse($requestId);

        return new JsonResponse($courseRequest);
    }

    public function setCourseInfo(Application $app, Request $request, $courseId){
        $user = $request->get('user');
        $info = $request->request->get('info');

        $course = $this->dashboardService->storeCourseInfo($info, $courseId);

        return new JsonResponse($course);
    }

    public function getCourseData(Application $app, Request $request, $courseId){
        $user = $request->get('user');
        /** @var Course $course */
        $course = $this->dashboardService->getCourse($courseId);

        return new JsonResponse($course->serializeWithScheduleAndDepartment());
    }

    public function uploadFiles(Application $app, Request $request, $courseId){
        $user = $request->get('user');

        $files = $request->files->all();
        $fileName = $request->request->get('file_name');
        $zippedFile = $this->dashboardService->storeFiles($courseId, $files['file'], $fileName);

        return new JsonResponse($zippedFile);
    }

    public function deleteFiles(Application $app, Request $request, $fileId){
        $user = $request->get('user');

        $zippedFile = $this->dashboardService->deleteFile($fileId);
    }

    public function createAssignment(Application $app, Request $request, $courseId){
        $user = $request->get('user');
        $title = $request->request->get('title');
        $description = $request->request->get('description');
        $date = $request->request->get('due_date');
        $files = $request->files->all();

        $assignment = $this->dashboardService->createCourseAssignment($courseId, $title, $description, $date, $files);

        return new JsonResponse($assignment);
    }

    public function deleteAssignment(Application $app, Request $request, $assignmentId){
        $user = $request->get('user');
        $success = $this->dashboardService->deleteAssignment($assignmentId);

        return $success ? new JsonResponse("", 200) : new JsonResponse("Error", 500);
    }

    public function updateAssignment(Application $app, Request $request){
        $user = $request->get('user');
        $title = $request->request->get('title');
        $description = $request->request->get('description');
        $date = $request->request->get('due_date');
        var_dump($request);die();
        $result = $this->dashboardService->updateAssignment($id, $title, $description, $date);

        return new JsonResponse($result);
    }


}