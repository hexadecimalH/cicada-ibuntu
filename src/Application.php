<?php
/**
 * Created by PhpStorm.
 * User: haris
 * Date: 31.5.17
 * Time: 00:00
 */

namespace Ibuntu;


use Ibuntu\Clients\FacebookClient;
use Ibuntu\Clients\GoogleClient;
use Ibuntu\Libraries\FileZipper;
use Ibuntu\Middleware\Authentication;
use Ibuntu\Libraries\ImageManipulationLibrary;
use Ibuntu\Services\DashboardService;
use Ibuntu\Services\ImageStorageService;
use Ibuntu\Services\LoginService;
use Ibuntu\Services\RegistrationService;
use Twig_Environment;
use Twig_SimpleFunction;
use Twig_Loader_Filesystem;

class Application extends \Cicada\Application
{
    public $basePath;
    public $domain;
    public $protocol;

    public function __construct($configPath, $domain, $protocol)
    {
        parent::__construct();
        $this->configure($configPath);

        $this->configureDatabase();
        $this->setupLibraries();
        $this->setupServices();
        $this->createClients();
        $this->setupMiddleware();
        $this->setupTwig();

        $this->basePath = $this['config']->getPathToUpload();
        $this->domain = $domain;
        $this->protocol = $protocol;

    }

    protected function configure($configPath) {
        $this['config'] = function () use ($configPath) {
            return new Configuration($configPath);
        };
    }

    protected function setupLibraries(){
        $this['imageManipulationLibrary'] = function () {
            return new ImageManipulationLibrary();
        };

        $this['fileZipper'] = function (){
            return new FileZipper($this->basePath);
        };
    }

    protected function setupServices(){
        $this['imageStorageService'] = function () {
            return new ImageStorageService($this->basePath, $this->protocol, $this->domain, $this['imageManipulationLibrary']);
        };

        $this['loginService'] = function (){
            return new LoginService($this['imageStorageService']);
        };

        $this['registrationService'] = function () {
            return new RegistrationService($this['imageStorageService']);
        };

        $this['dashboardService'] = function() {
            return new DashboardService($this['fileZipper']);
        };


    }

    protected function configureDatabase()
    {
        $dbConfig = $this['config']->getDbConfig();
        \ActiveRecord\Config::initialize(function (\ActiveRecord\Config $cfg) use ($dbConfig) {
            $cfg->set_model_directory('src/Models');
            $cfg->set_connections([
                'main' => sprintf('mysql://%s:%s@%s/%s',
                    $dbConfig['user'], $dbConfig['password'], $dbConfig['host'], $dbConfig['name']
                )
            ]);
            $cfg->set_default_connection('main');
        });
    }

    protected function createClients(){
        $googleCredentials = $this['config']->getGoogleCredentials();
        $googleProfessorRedirect = $this['config']->getGoogleProfessorRedirect();
        $this['googleClient'] = function() use ($googleCredentials, $googleProfessorRedirect) {
            return new GoogleClient($googleCredentials, $googleProfessorRedirect);
        };

        $facebookCredentials = $this['config']->getFacebookCredentials();
        $facebookRedirectLoginUrl = $this['config']->getFacebookRedirectUrl();
        $facebookProfessorRedirect = $this['config']->getFacebookProfessorRedirectUrl();
        $this['facebookClient'] = function() use ($facebookCredentials, $facebookRedirectLoginUrl, $facebookProfessorRedirect) {
            return new FacebookClient($facebookCredentials, $facebookRedirectLoginUrl, $facebookProfessorRedirect);
        };
    }

    private function setupTwig() {
        $this['twig'] = function() {
            $loader = new \Twig_Loader_Filesystem('front-end/templates');
            $twig = new  \Twig_Environment($loader, array(//
//                'cache' => 'cache',
            ));

            $pathFunction = function ($name, $params = []) {
                /** @var Route $route */
                $route = $this['router']->getRoute($name);
                return $route->getRealPath($params);
            };
            $twig->addFunction(new Twig_SimpleFunction('path', $pathFunction));


            return $twig;
        };
    }

    private function setupMiddleware(){
        $googleClient = $this['googleClient'];
        $facebookClient = $this['facebookClient'];
        $this['authentication'] = function() use ($googleClient, $facebookClient){
            new Authentication($googleClient, $facebookClient, $this['loginService']);
        };
    }
}