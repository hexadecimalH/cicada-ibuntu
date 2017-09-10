<?php
/**
 * Created by PhpStorm.
 * User: haris
 * Date: 31.5.17
 * Time: 21:31
 */

namespace Ibuntu\Clients;

use Facebook\Exceptions\FacebookResponseException;
use Facebook\Exceptions\FacebookSDKException;
use Facebook\Facebook;
use Facebook\Helpers\FacebookRedirectLoginHelper;

class FacebookClient extends Facebook
{

    protected $permisions = ['email'];

    protected $redirectUrl;

    protected $professorRedirect;

    /** @var FacebookRedirectLoginHelper $fbHelper */
    public $fbHelper;

    public function __construct(array $config = [], $redirectUrl, $professorRedirect)
    {
        parent::__construct($config);

        $this->redirectUrl = $redirectUrl;

        $this->professorRedirect = $professorRedirect;

        $this->fbHelper = $this->getRedirectLoginHelper();
    }

    public function getPermissions(){
        return $this->permisions;
    }

    public function getRedirectUrl(){
        return $this->redirectUrl;
    }

    public function setProfessorRedirect(){
        $this->redirectUrl = $this->professorRedirect;
    }

    public function getUserData($state, $type){
        try {
            $this->fbHelper->getPersistentDataHandler()->set('state', $state);
            $accessToken = $this->fbHelper->getAccessToken();
            $me = $this->get('/me?fields=name,first_name,last_name,email,link,gender,locale,picture.width(500).height(500)',
                            $accessToken->getValue());
        } catch(FacebookResponseException $e) {
            // When Graph returns an error
            var_dump($this->fbHelper->getError());
            echo 'Graph returned an error: ' . $e->getMessage();
            exit;
        } catch(FacebookSDKException $e) {
            // There was an error communicating with Graph
            echo $e->getMessage();
            exit;
        }

        return $this->createUserObject($me, $type);
    }

    public function createUserObject($data, $type){
        $data = json_decode($data->getBody());
        $userData = [
            "first_name" => $data->first_name,
            "last_name" => $data->last_name,
            "email" => $data->email,
            "link" => $data->link,
            "picture" => $data->picture->data->url,
            "oauth_provider" => "Facebook",
            "oauth_uid" => $data->id,
            "type" => $type
        ];
        return $userData;
    }
}