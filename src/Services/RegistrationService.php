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
    function __construct()
    {
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
}