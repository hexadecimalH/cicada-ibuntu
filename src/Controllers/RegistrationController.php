<?php
use Ibuntu\Services\ImageStorageService;
use Ibuntu\Services\RegistrationService;

/**
 * Created by PhpStorm.
 * User: haris
 * Date: 4.6.17
 * Time: 22:13
 */

namespace Ibuntu\Controllers;


use Ibuntu\Application;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class RegistrationController
{
    /* @var ImageStorageService $imageStorageService */
    private $imageStorageService;

    /* @var RegistrationService $registrationService */
    private $registrationService;

    /** @var  \Twig_Environment $twig */
    public $twig;

    function __construct($imageStorageService, $registrationService, $twig)
    {
        $this->imageStorageService = $imageStorageService;
        $this->registrationService = $registrationService;
        $this->twig = $twig;
    }

    // '/professor' Routes

    public function signupProfessors(){
        return $this->twig->render('signup-professor.twig');
    }

    public function uploadProfessorImage(Application $app, Request $request){
        $image = $request->files->get('image');

        $path = $this->imageStorageService->storeImage($image,'professor', 500, 500);
        if(strpos($path, '/uploads/professor') === false){
            return new Response($path, 500);
        }
        return new Response($path);
    }

    public function registerUniversity(Application $app, Request $request){
        $univarsityName = $request->request->get('university_name');
        $univarsityAddress = $request->request->get('university_address');
        $univarsityEmail = $request->request->get('university_email');
        $univarsitySite = $request->request->get('university_site');
        $univarsityCountry = $request->request->get('university_country');
        $univarsityCity = $request->request->get('university_city');

        $university = $this->registrationService->createUniversity($univarsityName,$univarsityAddress,$univarsityCity,
                                                    $univarsityCountry, $univarsityEmail, $univarsitySite);

        return new JsonResponse($university);
    }

    public function getAllUniversities(){
        $universities = $this->registrationService->getUniversities();
        return new JsonResponse($universities);
    }

    public function registerFaculty(Application $app, Request $request){
        $universityId = $request->request->get('university_id');
        $facultyName = $request->request->get('faculty_name');
        $facultyBranch = $request->request->get('faculty_branch');
        $facultyInfo = $request->request->get('faculty_info');

        $faculty = $this->registrationService->createFaculty($universityId, $facultyName, $facultyBranch, $facultyInfo);

        return new JsonResponse($faculty);
    }

    public function registerDepartment(Application $app, Request $request){
        $universityId = $request->request->get('university_id');
        $facultyId = $request->request->get('faculty_id');
        $departmentName = $request->request->get('department_name');
        $departmentInfo = $request->request->get('department_info');

        $department = $this->registrationService->createDepartment($universityId, $facultyId, $departmentName, $departmentInfo);

        return new JsonResponse($department);
    }

}