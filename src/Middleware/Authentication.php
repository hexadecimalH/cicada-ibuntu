<?php

/**
 * Created by PhpStorm.
 * User: haris
 * Date: 1.6.17
 * Time: 01:32
 */

namespace Ibuntu\Middleware;

use Ibuntu\Application;
use Ibuntu\Clients\GoogleClient;
use Ibuntu\Clients\FacebookClient;
use Ibuntu\Models\User;
use Ibuntu\Services\LoginService;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;

class Authentication
{
    /** @var  GoogleClient $googleClient */
    public $googleClient;

    /** @var  FacebookClient $facebookClient */
    public $facebookClient;

    /** @var  LoginService $loginService */
    public $loginService;

    /** @var Session $session */
    public $session;

    public function __construct($googleClient, $facebookClient, $loginService)
    {
        $this->googleClient = $googleClient;
        $this->facebookClient = $facebookClient;
        $this->loginService = $loginService;
        $this->session = new Session();
        $this->session->start();

    }
    public function authorizeUser(Application $app, Request $request, $type){
        // get user information from Third party
        $user = $this->getUserData($request, $type);
        $userFromDb = $this->loginService->getUserAsArray($user['email']);
        $this->session->set('userVendor', $user);
        $request->request->set('user', $user);
        $request->request->set('user_exists', !empty($userFromDb));
        if(!empty($userFromDb)){
            $this->loginService->getUserAsArray($user['email']);
            $request->request->set('user', $userFromDb);
            $this->session->set("user", $userFromDb);
        }
    }

    public function getUserData(Request $request, $type){
        if(empty($request->get('state'))){

            $code = $request->get('code');
            return $this->googleClient->getUserData($code, $type);
        }

        $state = $request->get('state');
        return $this->facebookClient->getUserData($state, $type);

    }

    public function checkCredentials(Application $app, Request $request)
    {
        if(!isset($_SESSION['_sf2_attributes']['user'])){
            $email = $request->get('email');
            $user = $this->loginService->getUserAsArray($email);
            if(gettype($user) == "array"){
                $this->session->set("user", $user);
            }
            $request->request->set('user', $user);
        }
        else{
            $user = $_SESSION['_sf2_attributes']['user'];
            $request->request->set('user', $user);
        }
    }

    public function isLoggedIn(Application $app, Request $request){
        $request->request->set('user_exists', true);
        if (!isset($_SESSION['_sf2_attributes']['user'])) {

            $this->checkUserInformation($app, $request);

        } else {
            $user = $_SESSION['_sf2_attributes']['user'];
            $request->request->set('user', $user);
        }

    }

    public function check(){

        return isset($_SESSION['user']);
    }

    public function checkUserInformation(Application $app, Request $request){
        $isValid = false;
        $email = $request->get('email');

        $user = $this->loginService->getUserAsArray($email);
        $_SESSION['_sf2_attributes']['user'] = $user;
        if(!empty($user)){

            $postPassword = $request->get('password');
            $isValid = password_verify($postPassword, $user['password']);

        }

        $request->request->set('user_exists', $isValid);
        $request->request->set('user', $user);

    }


    public function userExists($email){

         $user = $this->loginService->findUser($email);

         return empty($user);
    }

}