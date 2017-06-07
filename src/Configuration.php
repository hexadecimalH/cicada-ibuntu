<?php
/**
 * Created by PhpStorm.
 * User: haris
 * Date: 31.5.17
 * Time: 00:29
 */

namespace Ibuntu;


class Configuration
{
    private $fullConfigPath;
    private $config;
    private $environment;

    public function __construct($configPath)
    {
        $this->fullConfigPath = $configPath."/config.json";
        $this->config = json_decode(file_get_contents($this->fullConfigPath), true);
    }

    public function getDbConfig() {
        return $this->config['database'];
    }
    public function getPathToUpload(){
        return $this->config['path'];
    }

    public function getGoogleCredentials(){
        return $this->config['google-api'];
    }

    public function getFacebookCredentials(){
        return $this->config['facebook-api'];
    }

    public function getFacebookRedirectUrl(){
        return $this->config['facebook-api-redirect-url'];
    }
}