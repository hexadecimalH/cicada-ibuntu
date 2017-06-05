<?php
// enable Error printing
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require 'vendor/autoload.php';


use Ibuntu\Application;
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
$registrationController = new RegistrationController($app['imageStorageService']);
$sessionController = new SessionController($app['twig']);

/** @var RouteCollection $loginRouteCollection */
$loginRouteCollection = $app['collection_factory'];

/** @var RouteCollection $professorRegistrationRouteCollection */
$professorRegistrationRouteCollection = $app['collection_factory']->prefix('/professor');

/** @var RouteCollection $studentRegistrationRouteCollection */
$studentRegistrationRouteCollection = $app['collection_factory']->prefix('/student');

$loginRouteCollection->get('/',                     [$loginController, 'index']);
$loginRouteCollection->get('/oauth2callback',       [$loginController, 'clientLogin'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->authorizeUser($app, $request);
    });
$loginRouteCollection->post('/login',                [$loginController, 'clientLogin'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->checkCredentials($app, $request);
    });
$loginRouteCollection->get('/logout',               [$loginController, 'logOut']);

$app->get('/dashboard', [$sessionController, 'index'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->isLoggedIn($app, $request);
    });
$app->get('/profile', [$sessionController, 'profile'])
    ->before(function(Application $app, Request $request) use ($authentication){
        $authentication->isLoggedIn($app, $request);
    });
// registration routes
$professorRegistrationRouteCollection->post('/image', [$registrationController, "uploadProfessorImage"]);
$app->get('/signup', [$loginController, 'signup']);
$app->get('/signup-professor', [$loginController, 'signupProfessors']);

$app->addRouteCollection($loginRouteCollection);
$app->addRouteCollection($studentRegistrationRouteCollection);
$app->addRouteCollection($professorRegistrationRouteCollection);

$app->run();