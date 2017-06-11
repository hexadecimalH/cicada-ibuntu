<?php
/**
 * Created by PhpStorm.
 * User: haris
 * Date: 2.6.17
 * Time: 00:16
 */

namespace Ibuntu\Controllers;


use Ibuntu\Application;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;

class SessionController
{
    /** @var  \Twig_Environment $twig */
    private $twig;

    function __construct($twig)
    {
        $this->twig = $twig;
    }

    public function index(Application $app, Request $request){
        $user = $request->request->get('user');
        if(empty($user)){
            return new RedirectResponse('/');
        }
        return $this->twig->render('dashboard.twig', [ 'user' => $user, 'active' => 1]);
    }


}