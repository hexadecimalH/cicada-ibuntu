<?php
/**
 * Created by PhpStorm.
 * User: haris
 * Date: 2.6.17
 * Time: 00:16
 */

namespace Ibuntu\Controllers;


use Ibuntu\Application;
use Ibuntu\Services\LoginService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class SessionController
{
    /** @var  LoginService $twig */
    private $loginService;

    function __construct($loginService)
    {
        $this->loginService = $loginService;
    }

    public function saveSession(Application $app, Request $request, $email){

        $userExists = !$this->loginService->checkUser($email);
        if($userExists){
            $_SESSION['email'] = $email;
            return new Response("", 200);
        }

        return new Response("", 500);
    }

    public function sessionUser(Application $app, Request $request, $email){

        if(isset($_SESSION['_sf2_attributes']['userVendor'])){
            return new JsonResponse($_SESSION['_sf2_attributes']['userVendor']);
        }

        return new Response("Session Exceeded, please try again", 300);

    }


}