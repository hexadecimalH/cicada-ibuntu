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

$app = new Application($_SERVER['HOME'], $_SERVER['HTTP_HOST'], getProtocol().'://');

$authentication = new Authentication($app['googleClient'],$app['facebookClient'], $app['loginService']);
$loginController = new LoginController($app['googleClient'],$app['facebookClient'], $app['twig'], $app['loginService']);
$registrationController = new RegistrationController($app['imageStorageService'], $app['registrationService'], $app['twig']);
$dashboardController = new DashboardController($app['dashboardService'], $app['twig']);
$sessionController = new SessionController($app['twig']);

/** @var RouteCollection $loginRouteCollection */
$loginRouteCollection = $app['collection_factory'];

/** @var RouteCollection $professorRegistrationRouteCollection */
$professorRegistrationRouteCollection = $app['collection_factory']->prefix('/professor');

/** @var RouteCollection $studentRegistrationRouteCollection */
$studentRegistrationRouteCollection = $app['collection_factory']->prefix('/student');

/** @var RouteCollection $dashboardRouteCollection */
$dashboardRouteCollection = $app['collection_factory']->prefix('/dashboard');
// dashboard routes for creating and managing academic data
$dashboardRouteCollection->post('/course/create', [$dashboardController, 'createCourse'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->validateUser($app,$request);
    });

$dashboardRouteCollection->get('/course/professor', [$dashboardController, 'getProfessorCourses'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->validateUser($app,$request);
    });

$dashboardRouteCollection->get('/course/student', [$dashboardController, 'getStudentCourses'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->validateUser($app,$request);
    });

$dashboardRouteCollection->get('/course/{courseId}', [$dashboardController, 'toCoursePage'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->validateUser($app,$request);
    });

$dashboardRouteCollection->post('/course/info/{courseId}', [$dashboardController, 'setCourseInfo'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->validateUser($app,$request);
    });

$dashboardRouteCollection->get('/course-info/{courseId}', [$dashboardController, 'getCourseData'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->validateUser($app,$request);
    });

$dashboardRouteCollection->post('/request/{courseId}', [$dashboardController, 'createRequest'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->validateUser($app,$request);
    });

$dashboardRouteCollection->put('/request/approve/{requestId}', [$dashboardController, 'approveRequest'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->validateUser($app,$request);
    });

$dashboardRouteCollection->get('/request/{courseId}', [$dashboardController, 'getRequestsForCourse'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->validateUser($app,$request);
    });

$dashboardRouteCollection->delete('/request/{requestId}', [$dashboardController, 'removeCourseRequest'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->validateUser($app,$request);
    });

$dashboardRouteCollection->post('/upload/{courseId}', [$dashboardController, 'uploadFiles'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->validateUser($app,$request);
    });

$dashboardRouteCollection->delete('/files/{fileId}', [$dashboardController, 'deleteFiles'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->validateUser($app,$request);
    });

// start page Log in/ Sign up
$loginRouteCollection->get('/',                         [$loginController, 'index']);
$loginRouteCollection->get('/professor',                [$loginController, 'indexProfessor']);

//callback routes after third party client authorization
$loginRouteCollection->get('/oauth2callback/student',   [$loginController, 'login'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->authorizeUser($app, $request,'student');
    });
$loginRouteCollection->get('/oauth2callback/professor', [$loginController, 'login'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $app['googleClient']->setProfessorRedirect();
        $app['facebookClient']->setProfessorRedirect();
        $authentication->authorizeUser($app, $request,'professor');
    });

// login with email and password
$loginRouteCollection->post('/login',                [$loginController, 'studentLogin'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->checkCredentials($app, $request);
    });

//log out as a client
$loginRouteCollection->get('/logout',               [$loginController, 'logOut']);

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
$professorRegistrationRouteCollection->post('/image',           [$registrationController, "uploadImage"]);
$professorRegistrationRouteCollection->post('/university',      [$registrationController, "registerUniversity"]);
$professorRegistrationRouteCollection->get('/university/all',   [$registrationController, "getAllUniversities"]);
$professorRegistrationRouteCollection->post('/faculty',         [$registrationController, "registerFaculty"]);
$professorRegistrationRouteCollection->post('/department',      [$registrationController, "registerDepartment"]);
$professorRegistrationRouteCollection->post('/create',          [$registrationController, "registerProfessor"]);

// custom sign up routes for student and professor
$professorRegistrationRouteCollection->get('/signup',           [$loginController, 'professorCustomSignup']);
$studentRegistrationRouteCollection->get('/signup',             [$loginController, 'studentCustomSignup']);

// custom sign up create user
$loginRouteCollection->post('/user/create',                     [$loginController, "createCustomUser"]);

$loginRouteCollection->post('/academic/create',                 [$registrationController, "registarUserAsProfessorOrStudent"]);

$app->addRouteCollection($loginRouteCollection);
$app->addRouteCollection($dashboardRouteCollection);
$app->addRouteCollection($studentRegistrationRouteCollection);
$app->addRouteCollection($professorRegistrationRouteCollection);

$app->run();