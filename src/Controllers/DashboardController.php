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
        $user = $this->checkIfAuthorised($request);
        $departmentId = $user['professor'][0]['department_id'];
        $professorId = $user['professor'][0]['id'];
        $all = $request->request->all();

        $course = $this->dashboardService->storeCourseData($all, $departmentId, $professorId);

        return new JsonResponse($course);
    }

    public function getProfessorCourses(Application $app, Request $request){
        $user = $this->checkIfAuthorised($request);
        $professorId = $user['professor'][0]['id'];
        $courses = $this->dashboardService->retrieveProfessorCourses($professorId);

        return new JsonResponse($courses);
    }

    public function getStudentCourses(Application $app, Request $request){
        $user = $this->checkIfAuthorised($request);
        $departmentId = $user['student'][0]['department_id'];
        $courses = $this->dashboardService->retrieveStudentCourses($departmentId, $user['id']);

        return new JsonResponse($courses);
    }

    protected function checkIfAuthorised($request){
        $user = $request->get('user');
        if(gettype($user) == 'string'){
            return new Response('Unauthorised User',401);
        }

        return $user;
    }

    public function toCoursePage(Application $app, Request $request, $courseId){
        $user = $this->checkIfAuthorised($request);
        $course = $this->dashboardService->getCourse($courseId);

        return $this->twig->render($user['type'].'/landing.twig', ['user' => $user, "page" => "course", "course" => $course, "department" => $course->department]);
    }

    public function createRequest(Application $app, Request $request, $courseId){
        $user = $this->checkIfAuthorised($request);

        $courseRequest = $this->dashboardService->storeRequest($user['id'], $courseId);

        return new JsonResponse($courseRequest);
    }

    public function removeCourseRequest(Application $app, Request $request, $requestId){
        $user = $this->checkIfAuthorised($request);
        $this->dashboardService->removeRequest($requestId);

        return new JsonResponse("Request Succesfully Deleted" , 200);
    }

    public function getRequestsForCourse(Application $app, Request $request, $courseId){
        $user = $this->checkIfAuthorised($request);

        $requests = $this->dashboardService->getRequestsForCourse($courseId);

        return new JsonResponse($requests);
    }

    public function approveRequest(Application $app, Request $request, $requestId){
        $user = $this->checkIfAuthorised($request);

        $courseRequest = $this->dashboardService->approveRequestForCourse($requestId);

        return new JsonResponse($courseRequest);
    }

    public function setCourseInfo(Application $app, Request $request, $courseId){
        $user = $this->checkIfAuthorised($request);
        $info = $request->request->get('info');

        $course = $this->dashboardService->storeCourseInfo($info, $courseId);

        return new JsonResponse($course);
    }

    public function getCourseData(Application $app, Request $request, $courseId){
        $user = $this->checkIfAuthorised($request);
        /** @var Course $course */
        $course = $this->dashboardService->getCourse($courseId);

        return new JsonResponse($course->serializeWithScheduleAndDepartment());
    }

    public function uploadFiles(Application $app, Request $request, $courseId){
        $user = $this->checkIfAuthorised($request);

        $files = $request->files->all();
        $fileName = $request->request->get('file_name');
        $zippedFile = $this->dashboardService->storeFiles($courseId, $files['file'], $fileName);

        return new JsonResponse($zippedFile);
    }

    public function deleteFiles(Application $app, Request $request, $fileId){
        $user = $this->checkIfAuthorised($request);

        $zippedFile = $this->dashboardService->deleteFile($fileId);
    }


}