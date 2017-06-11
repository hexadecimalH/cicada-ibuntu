<?php
/**
 * Created by PhpStorm.
 * User: haris
 * Date: 11.6.17
 * Time: 06:24
 */

namespace Ibuntu\Controllers;


use Ibuntu\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class DashboardController
{

    public $dashboardService;

    public function __construct($dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function createCourse(Application $app, Request $request){
        $user = $request->get('user');
        if(gettype($user) == 'string'){
            return new Response('Unauthorised User',401);
        }

        $courseName = $request->request->get('course_name');
        $scheduledDays = $request->request->get('scheduled_days');
        $courseSemester = $request->request->get('semester');
        $year = $request->request->get('year');
    }

}