<?php
/**
 * Created by PhpStorm.
 * User: haris
 * Date: 11.6.17
 * Time: 06:24
 */

namespace Ibuntu\Controllers;


use Ibuntu\Application;
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

    protected function checkIfAuthorised($request){
        $user = $request->get('user');
        if(gettype($user) == 'string'){
            return new Response('Unauthorised User',401);
        }

        return $user;
    }

    public function toCoursePage(Application $app, Request $request, $courseId){
        $user = $request->request->get('user');
        $course = $this->dashboardService->getCourse($courseId);

        return $this->twig->render($user['type'].'/landing.twig', ['user' => $user, "page" => "course", "course" => $course, "department" => $course->department]);
    }

}