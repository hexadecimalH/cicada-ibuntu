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
use Symfony\Component\HttpFoundation\RedirectResponse;
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

    public function uploadImage(Application $app, Request $request){
        $image = $request->files->get('image');

        $path = $this->imageStorageService->storeImage($image,'chunk', 500, 500);
        if(strpos($path, '/uploads/chunk') === false){
            return new Response($path, 500);
        }
        return new Response($path);
    }

    public function registerUniversity(Application $app, Request $request){
        $universityName = $request->request->get('university_name');
        $universityAddress = $request->request->get('university_address');
        $universityEmail = $request->request->get('university_email');
        $universitySite = $request->request->get('university_site');
        $universityCountry = $request->request->get('university_country');
        $universityCity = $request->request->get('university_city');

        $university = $this->registrationService->createUniversity($universityName,$universityAddress,$universityEmail,
                                                            $universityCountry, $universityCity, $universitySite);

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

    public function registarUserAsProfessorOrStudent(Application $app, Request $request){
        $universityId = $request->request->get("university");
        $facultyId = $request->request->get('faculty');
        $departmentId = $request->request->get('department');
        $type = $request->request->get('type');

        $userId = $request->request->get('user_id');

        if( $userId == ""){
            $user = $_SESSION['_sf2_attributes']['user'];
            $userId = $user['id'];

        }
        if($type == "student"){
            $this->registrationService->createStudent($universityId, $facultyId, $departmentId, $userId);
        }
        else{
            $this->registrationService->createProfessor($universityId, $facultyId, $departmentId, $userId);
        }


    }

}