<?php

/**
 * Created by PhpStorm.
 * User: haris
 * Date: 1.6.17
 * Time: 01:12
 */

namespace  Ibuntu\Services;

use GuzzleHttp\Psr7\Request;
use Ibuntu\Application;
use Ibuntu\Models\Professor;
use Ibuntu\Models\Student;
use Ibuntu\Models\User;
use Symfony\Component\HttpFoundation\Response;

class LoginService
{
    /** @var  ImageStorageService $imageStorageService */
    public $imageStorageService;

    public function __construct($imageStorageService)
    {
        $this->imageStorageService = $imageStorageService;
    }

    public function checkUser($email){
        $user = $this->findUser($email);
        return empty($user);
    }

    public function createUser($user, $type){
        $user = User::create([
            "first_name" => $user['first_name'],
            "last_name" => $user['last_name'],
            "email" => $user['email'],
            "link" => $user['link'],
            "picture" => $user['picture'],
            "oauth_provider" => $user['oauth_provider'],
            "oauth_uid" => $user['oauth_uid'],
            "type" => $type
        ]);

        return $user->to_array();
    }

    public function findUser($email){
        $user = User::first(['conditions' => ['email LIKE ?', $email]]);

        return $user;
    }

    public function getUserAsArray($email){
        $user = User::first(['conditions' => ['email LIKE ?', $email]]);

        if(empty($user)){
            return "Wrong Credentials";
        }
        return $user->to_array();
    }

    public function findStudentByUser($user){
        $user = $this->findUser($user['email']);
        /** @var Student $student */
        $student = Student::first(['conditions' => ['user_id = ?', $user->id]]);

        return $student;
    }

    public function findStudentByUserId($id){
        $student = Student::first(['conditions' =>['user_id = ?', $id ]]);
        return $student;
    }

    public function findProfessorByUserId($id){
        $professor = Professor::first(['conditions' =>['user_id = ?', $id ]]);

        return $professor;
    }

    public function findProfessorByUser($user)
    {
        $user = $this->findUser($user['email']);
        /** @var Professor $professor */
        $professor = Professor::first(['conditions' => ['user_id = ?', $user->id]]);

        return $professor;
    }

    public function customRegisterUser($name, $surname, $email, $imageUrl, $type){
        $exists = $this->findUser($email);
        $id=1;
        if(empty($exists)){
            // storing user values in DB
            /** @var User $user */
            $user = User::create([
                "first_name" => $name,
                "last_name" => $surname,
                "email" => $email,
                "type" => $type
            ]);
            // retreaving values from DB
            $user = User::find($id);

            $url = $this->imageStorageService->moveAndRenameImage($type, $imageUrl, $user->id);
            $user->picture = $url;
            $user->save();

            return $user->serialize();
        }

        return "User with same E-mail already exists";
    }
    public function getUserWithDepartment($user){
        /** @var User $user */
        $user = User::find($user['id'],['include' => [ $user['type']]]);
        if($user->type == "student"){
            return $user->serializeWithStudent();
        }
        else{
            return $user->serializeWithProfessor();
        }

    }

}

