<?php
// enable Error printing
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require 'vendor/autoload.php';


use Ibuntu\Application;
use Ibuntu\Controllers\DashboardController;
use Ibuntu\Controllers\LoginController;
use Cicada\Routing\RouteCollection;
use Ibuntu\Controllers\RegistrationController;
use Ibuntu\Controllers\SessionController;
use Ibuntu\Middleware\Authentication;
use Ibuntu\Models\User;
use Symfony\Component\HttpFoundation\Request;

function getProtocol()
{
    $isSecure = false;
    if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') {
        $isSecure = true;
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https' || !empty($_SERVER['HTTP_X_FORWARDED_SSL']) && $_SERVER['HTTP_X_FORWARDED_SSL'] == 'on') {
        $isSecure = true;
    }
    return $isSecure ? 'https' : 'http';
}

// Creates all dependencies
$app = new Application($_SERVER['HOME'], $_SERVER['HTTP_HOST'], getProtocol().'://');

$authentication = new Authentication($app['googleClient'],$app['facebookClient'], $app['loginService']);
//Controllers
$loginController = new LoginController($app['googleClient'],$app['facebookClient'], $app['twig'], $app['loginService']);
$registrationController = new RegistrationController($app['imageStorageService'], $app['registrationService'], $app['twig']);
$dashboardController = new DashboardController($app['dashboardService'], $app['twig']);
$sessionController = new SessionController($app['loginService']);

/** @var RouteCollection $loginRouteCollection */
$loginRouteCollection = $app['collection_factory'];

/** @var RouteCollection $professorRegistrationRouteCollection */
$professorRegistrationRouteCollection = $app['collection_factory']->prefix('/professor');

/** @var RouteCollection $studentRegistrationRouteCollection */
$studentRegistrationRouteCollection = $app['collection_factory']->prefix('/student');

/** @var RouteCollection $dashboardRouteCollection */
$dashboardRouteCollection = $app['collection_factory']
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->checkCredentials($app, $request);
    })->prefix('/dashboard');
// dashboard routes for creating and managing academic data
$dashboardRouteCollection->post('/course/create', [$dashboardController, 'createCourse']);
$dashboardRouteCollection->get('/course/professor', [$dashboardController, 'getProfessorCourses']);
$dashboardRouteCollection->get('/course/student', [$dashboardController, 'getStudentCourses']);
$dashboardRouteCollection->get('/course/{courseId}', [$dashboardController, 'toCoursePage']);
$dashboardRouteCollection->post('/course/info/{courseId}', [$dashboardController, 'setCourseInfo']);
$dashboardRouteCollection->get('/course-info/{courseId}', [$dashboardController, 'getCourseData']);
$dashboardRouteCollection->post('/request/{courseId}', [$dashboardController, 'createRequest']);
$dashboardRouteCollection->put('/request/approve/{requestId}', [$dashboardController, 'approveRequest']);
$dashboardRouteCollection->get('/request/{courseId}', [$dashboardController, 'getRequestsForCourse']);
$dashboardRouteCollection->delete('/request/{requestId}', [$dashboardController, 'removeCourseRequest']);
$dashboardRouteCollection->post('/upload/{courseId}', [$dashboardController, 'uploadFiles']);
$dashboardRouteCollection->delete('/files/{fileId}', [$dashboardController, 'deleteFiles']);
$dashboardRouteCollection->post('/assignment/{courseId}', [$dashboardController, 'createAssignment']);
$dashboardRouteCollection->delete('/assignment/{assignmentId}', [$dashboardController, 'deleteAssignment']);
$dashboardRouteCollection->put('/assignment', [$dashboardController, 'updateAssignment']);

// start page Log in/ Sign up
$loginRouteCollection->get('/',                         [$loginController, 'index']);
$loginRouteCollection->get('/professor',                [$loginController, 'indexProfessor']);

//callback routes after third party client authorization
$loginRouteCollection->get('/oauth2callback/student',   [$loginController, 'login'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->authorizeUser($app, $request, User::$USER_TYPE_STUDENT);
    });
$loginRouteCollection->get('/oauth2callback/professor', [$loginController, 'login'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $app['googleClient']->setProfessorRedirect();
        $app['facebookClient']->setProfessorRedirect();
        $authentication->authorizeUser($app, $request, User::$USER_TYPE_PROFESSOR);
    });

// login with email and password
$loginRouteCollection->post('/login',                [$loginController, 'studentLogin'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->checkCredentials($app, $request);
    });

//log out as a client
$app->get('/logout',               [$loginController, 'logOut']);

$app->get('/dashboard', [$sessionController, 'index'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->isLoggedIn($app, $request);
    });
$app->post('/profile', [$loginController, 'profile'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->isLoggedIn($app, $request);
    });
$app->get('/profile', [$loginController, 'profile'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->isLoggedIn($app, $request);

    });


// registration routes
//$professorRegistrationRouteCollection->post('/image',           [$registrationController, "uploadImage"]);
$professorRegistrationRouteCollection->post('/university',      [$registrationController, "registerUniversity"]);
$professorRegistrationRouteCollection->get('/university/all',   [$registrationController, "getAllUniversities"]);
$professorRegistrationRouteCollection->post('/faculty',         [$registrationController, "registerFaculty"]);
$professorRegistrationRouteCollection->post('/department',      [$registrationController, "registerDepartment"]);
$professorRegistrationRouteCollection->post('/create',          [$registrationController, "registerProfessor"]);

// custom sign up routes for student and professor
$professorRegistrationRouteCollection->get('/signup',           [$registrationController, 'professorCustomSignup']);
$studentRegistrationRouteCollection->get('/signup',             [$registrationController, 'studentCustomSignup']);

// custom sign up create user
$loginRouteCollection->post('/user/create',                     [$registrationController, "createCustomUser"]);

// check if user with same E-mail exists
$loginRouteCollection->post('/user/email',                      [$registrationController, "userWithEmailExists"]);

// store image on the disk
$loginRouteCollection->post('/image',                           [$registrationController, "uploadImage"]);

$loginRouteCollection->post('/academic/create',                 [$registrationController, "registarUserAsProfessorOrStudent"]);

$app->post('/session/{email}',                                [$sessionController, "saveSession"]);
$app->get('/session/{email}',                                 [$sessionController, "sessionUser"]);
$app->addRouteCollection($loginRouteCollection);
$app->addRouteCollection($dashboardRouteCollection);
$app->addRouteCollection($studentRegistrationRouteCollection);
$app->addRouteCollection($professorRegistrationRouteCollection);

$app->run();