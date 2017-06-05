<?php
use Ibuntu\Services\ImageStorageService;

/**
 * Created by PhpStorm.
 * User: haris
 * Date: 4.6.17
 * Time: 22:13
 */

namespace Ibuntu\Controllers;


use Ibuntu\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class RegistrationController
{
    /* @var ImageStorageService $imageStorageService */
    private $imageStorageService;

    function __construct($imageStorageService)
    {
        $this->imageStorageService = $imageStorageService;
    }

    public function uploadProfessorImage(Application $app, Request $request){
        $image = $request->files->get('image');

        $path = $this->imageStorageService->storeImage($image,'professor', 500, 500);

        return new Response($path, 500);
    }
}