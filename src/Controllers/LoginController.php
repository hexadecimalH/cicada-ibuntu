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
        $urls = $this->getClientUrl();

        return $this->twig->render("index.twig", ['google' => $urls['gp'], 'fb' => $urls['fb'], 'professor' => false]);

    }

    public function indexProfessor(Application $app, Request $request){
        $this->googleClient->setProfessorRedirect();
        $this->facebookClient->setProfessorRedirect();
        $urls = $this->getClientUrl();

        return $this->twig->render("index.twig", ['google' => $urls['gp'], 'fb' => $urls['fb'], 'professor' => true]);

    }

    public function studentLogin(Application $app, Request $request){
        $user = $request->request->get('user');
        if(empty($user)){
            $urls = $this->getClientUrl();
            return $this->twig->render('index.twig', ['google' => $urls['gp'], 'fb' => $urls['fb'],'message' => "Wrong Credentials"]);
        }
        $student = $this->loginService->findStudentByUser($user);
        if(empty($student)){
            return $this->twig->render('signup-student.twig', ['customSignup' => "non-custom", "user" => $user]);
        }
        return $this->twig->render('landing.twig', ['user' => $user, 'active' => 0]);
    }

    public function professorLogin(Application $app, Request $request){
        $user = $request->request->get('user');
        if(empty($user)){
            $urls = $this->getClientUrl();
            return $this->twig->render('index.twig', ['google' => $urls['gp'], 'fb' => $urls['fb'],'message' => "Wrong Credentials"]);
        }

        $professor = $this->loginService->findProfessorByUser($user);
        if(empty($professor)){
            return $this->twig->render('signup-professor.twig', ['customSignup' => "non-custom", "user" => $user]);
        }
        return $this->twig->render('landing.twig', ['user' => $user, 'active' => 0]);
    }


    public function logOut(Application $app, Request $request){
        session_unset();
        return new RedirectResponse("/");
    }

    protected function getClientUrl(){
        $gpUrl = $this->googleClient->createAuthUrl();
        $fbUrl = $this->facebookClient->fbHelper->getLoginUrl($this->facebookClient->getRedirectUrl(), $this->facebookClient->getPermissions());
        return ['gp' => $gpUrl, 'fb' => $fbUrl];
    }

    public function studentCustomSignup(Application $app, Request $request){
        return $this->twig->render('signup-student.twig', ['customSignup' => "custom"]);
    }

    public function professorCustomSignup(Application $app, Request $request){
        return $this->twig->render('signup-professor.twig', ['customSignup' => "custom"]);
    }

    public function createCustomUser(Application $app, Request $request){
        $name = $request->request->get('user_name');
        $surname = $request->request->get('user_surname');
        $email = $request->request->get('user_email');
        $gender = $request->request->get('gender');
        $imageUrl = $request->request->get('image_url');
        $type = $request->request->get('type');

        $responseData = $this->loginService->customRegisterUser($name,$surname,$email, $gender, $imageUrl, $type);
        if(gettype($responseData) == "string"){
            return new Response($responseData, Response::HTTP_CONFLICT);
        }
        return new JsonResponse($responseData);
    }

}