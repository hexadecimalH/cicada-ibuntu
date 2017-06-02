<?php

/**
 * Created by PhpStorm.
 * User: haris
 * Date: 31.5.17
 * Time: 00:22
 */

namespace Ibuntu\Clients;

use Google_Client;
use Google_Service_Oauth2;

class GoogleClient extends Google_Client
{
    /** @var Google_Service_Oauth2 $googleAuthService */
    public $googleAuthService;

    public function __construct(array $config = array())
    {
        parent::__construct($config);
        $this->setScopes('email');
        $this->googleAuthService = new Google_Service_Oauth2($this);
    }

    public function getUserData($code){
        $this->authenticate($code);
        $token = $this->getAccessToken();
        $this->setAccessToken($token);
        $data = $this->googleAuthService->userinfo->get();
        return $this->createUserObject($data);
    }

    public function createUserObject($data){
        $userData = [
            "first_name" => $data['givenName'],
            "last_name" => $data['familyName'],
            "email" => $data['email'],
            "link" => $data['link'],
            "picture" => $data['picture'],
            "oauth_provider" => "Google",
            "oauth_uid" => $data['id']
        ];
        return $userData;
    }


}