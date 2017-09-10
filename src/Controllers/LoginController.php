<?php

/**
 * Created by PhpStorm.
 * User: haris
 * Date: 31.5.17
 * Time: 00:02
 */

namespace Ibuntu\Controllers;

use Ibuntu\Application;
use Ibuntu\Clients\FacebookClient;
use Ibuntu\Clients\GoogleClient;
use Ibuntu\Services\LoginService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;

class LoginController
{
    /** @var  GoogleClient $googleClient */
    public $googleClient;

    /** @var  FacebookClient $facebookClient */
    public $facebookClient;

    /** @var  \Twig_Environment $twig */
    public $twig;

    /** @var  LoginService $loginService */
    public $loginService;


    public function __construct($googleClient, $facebookClient, $twig, $loginService)
    {
        $this->googleClient = $googleClient;
        $this->facebookClient = $facebookClient;
        $this->loginService = $loginService;
        $this->twig = $twig;

    }

    public function index(Application $app, Request $request){
        session_unset();
        session_destroy();
        $_SESSION = array();
        $urls = $this->getClientUrl();
        $message = $request->query->get('message');
        return $this->twig->render("index.twig", ['google' => $urls['gp'], 'fb' => $urls['fb'], 'professor' => false, 'message'=> $message]);

    }

    public function indexProfessor(Application $app, Request $request){
        $this->googleClient->setProfessorRedirect();
        $this->facebookClient->setProfessorRedirect();
        $urls = $this->getClientUrl();

        return $this->twig->render("index.twig", ['google' => $urls['gp'], 'fb' => $urls['fb'], 'professor' => true]);

    }

    public function profile(Application $app, Request $request){

        $userExists = $request->request->get('user_exists');
        if($userExists) {
            $user = $request->request->get('user');
            return $this->twig->render($user['type'].'/landing.twig', ['user' => $user, "page" => 'dashboard']);
        }

        return new RedirectResponse('/');
    }

    public function login(Application $app, Request $request){
        $userExists = $request->request->get('user_exists');
        $user = $request->request->get('user');
        if($userExists){

            return new RedirectResponse("/profile");

        }

        return new RedirectResponse('/'.$user['type'].'/signup?email='.$user['email'] );

    }

    public function logOut(Application $app, Request $request){
        session_unset();
        session_destroy();
        $_SESSION = array();
        $response = new RedirectResponse("/");
        $response->headers->addCacheControlDirective('no-cache', true);
        $response->headers->addCacheControlDirective('max-age', 0);
        $response->headers->addCacheControlDirective('must-revalidate', true);
        $response->headers->addCacheControlDirective('no-store', true);

        return $response;
    }

    protected function getClientUrl(){
        $gpUrl = $this->googleClient->createAuthUrl();
        $fbUrl = $this->facebookClient->fbHelper->getLoginUrl($this->facebookClient->getRedirectUrl(), $this->facebookClient->getPermissions());
        return ['gp' => $gpUrl, 'fb' => $fbUrl];
    }

}