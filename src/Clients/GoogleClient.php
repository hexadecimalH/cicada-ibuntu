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

    public $professorRedirectUrl;

    public static $SCOPE = "email";

    public function __construct(array $config = array(), $professorRedirectUrl)
    {
        parent::__construct($config);
        $this->setScopes($this::$SCOPE);
        $this->professorRedirectUrl = $professorRedirectUrl;
        $this->googleAuthService = new Google_Service_Oauth2($this);
    }

    public function getUserData($code, $type){
        $this->authenticate($code);
        $token = $this->getAccessToken();
        $this->setAccessToken($token);
        $data = $this->googleAuthService->userinfo->get();
        return $this->createUserObject($data, $type);
    }

    public function setProfessorRedirect(){
        $this->setRedirectUri($this->professorRedirectUrl);
    }

    public function createUserObject($data, $type){
        $userData = [
            "first_name" => $data['givenName'],
            "last_name" => $data['familyName'],
            "email" => $data['email'],
            "link" => $data['link'],
            "picture" => $data['picture'],
            "oauth_provider" => "Google",
            "oauth_uid" => $data['id'],
            "type" => $type
        ];
        return $userData;
    }


}