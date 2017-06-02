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
use Ibuntu\Models\User;

class LoginService
{
    public function __construct()
    {

    }

    public function checkUser($email){
        $user = $this->findUser($email);
        return empty($user);
    }

    public function createUser($user){
        $user = User::create([
            "first_name" => $user['first_name'],
            "last_name" => $user['last_name'],
            "email" => $user['email'],
            "link" => $user['link'],
            "picture" => $user['picture'],
            "oauth_provider" => $user['oauth_provider'],
            "oauth_uid" => $user['oauth_uid']
        ]);
        return $user;
    }

    public function findUser($email){
        $user = User::first(['conditions' => ['email LIKE ?', $email]]);

        return $user;
    }


}