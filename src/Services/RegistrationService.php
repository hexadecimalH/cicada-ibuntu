<?php
/**
 * Created by PhpStorm.
 * User: haris
 * Date: 7.6.17
 * Time: 00:01
 */

namespace Ibuntu\Services;

use Ibuntu\Models\Department;
use Ibuntu\Models\Faculty;
use Ibuntu\Models\Professor;
use Ibuntu\Models\Student;
use Ibuntu\Models\University;
use Ibuntu\Models\User;

class RegistrationService
{
    /** @var  ImageStorageService $imageStorageService */
    public $imageStorageService;

    public function __construct($imageStorageService)
    {
        $this->imageStorageService = $imageStorageService;
    }

    public function getUniversities(){
        /** @var University[] $universities */
        $universities = University::find('all', ['include' => ['faculty' => ['include' => 'department']]]);
        $serializedUniversities = [];
        foreach($universities as $university){
            $serializedUniversities[] = $university->serialize();
        }
        return $serializedUniversities;
    }

    public function createUniversity($uniName, $uniAddress, $uniCity, $uniCountry, $uniSite, $uniEmail){
        /** @var University $university */
        $university = University::create([
            'name' => $uniName,
            'street_address' => $uniAddress,
            'city' => $uniCity,
            'country' => $uniCountry,
            'email' => $uniEmail,
            'uni_website' => $uniSite
        ]);
        return $university->serialize();
    }

    public function createFaculty($uniId, $facultyName, $facultyBranch, $facultyInfo){
        /** @var Faculty $faculty */
        $faculty = Faculty::create([
            "university_id" => $uniId,
            "name" => $facultyName,
            "branch" => $facultyBranch,
            "info" => $facultyInfo
        ]);

        return $faculty->serialize();
    }

    public function createDepartment($uniId, $facultyId, $departmentName, $departmentInfo){
        /** @var Department $department */
        $department = Department::create([
            "university_id" => $uniId,
            "faculty_id" => $facultyId,
            "name" => $departmentName,
            "info" => $departmentInfo
        ]);

        return $department->serialize();
    }
    public function createCustomUser($imageUrl, $name, $surname, $password, $email){
        /** @var User $user */
        $user = User::create([
            "first_name" => $name,
            "last_name" => $surname,
            "email" => $email,
            "picture" => $imageUrl
        ]);
        return $user;
    }

    public function createProfessor($universityId, $facultyId, $departmentId, $userId){
        /** @var Professor $professor */
        $professor = Professor::create([
            "university_id" => (int)$universityId,
            "faculty_id" => (int)$facultyId,
            "department_id" => (int)$departmentId,
            "user_id" => (int)$userId
        ]);

        //implent response
    }
    public function createStudent($universityId, $facultyId, $departmentId, $userId){
        /** @var Student $student */
        $student = Student::create([
            "university_id" => $universityId,
            "faculty_id" => $facultyId,
            "department_id" => $departmentId,
            "user_id" => $userId
        ]);
        //implent response
    }

    public function customRegisterUser($name, $surname, $email, $password,
                                       $imageUrl, $type, $universityId, $facultyId, $departmentId){
        // storing user values in DB
        /** @var User $user */
        $user = $this->createUser($name, $surname, $email, $password,$imageUrl, $type, $universityId, $facultyId, $departmentId);

        $url = $this->imageStorageService->moveAndRenameImage($type, $imageUrl, $user->id);

        $user->picture = $url;
        $user->save();

        return $user->serialize();
    }

    public function findUser($email){
        /** @var User $user */
        $user = User::first(['conditions' => ['email LIKE ?', $email]]);

        return $user;
    }

    private function createUser($name, $surname, $email, $password,
                                $imageUrl, $type, $universityId, $facultyId, $departmentId){
        // hashing the password
        $password = password_hash($password, PASSWORD_DEFAULT);

        /** @var User $user */
        $user = User::create([
            "first_name" => $name,
            "last_name" => $surname,
            "email" => $email,
            "password" => $password,
            "type" => $type,
            "picture" => $imageUrl,
            "university_id" => (int) $universityId,
            "faculty_id" => (int) $facultyId,
            "department_id" => (int) $departmentId,
        ]);

        return $user;
    }


}