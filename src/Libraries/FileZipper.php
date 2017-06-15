<?php
/**
 * Created by PhpStorm.
 * User: haris
 * Date: 15.6.17
 * Time: 03:08
 */

namespace Ibuntu\Libraries;


use ZipArchive;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class FileZipper
{

    public $basePath;

    function __construct($basePath)
    {
        $this->basePath = $basePath;
    }
    /**
     * @param $courseName string
     * @param $files UploadedFile[]
     * @param $zipName string
     * @return string
     */
    public function zipFiles($courseName, $files, $zipName){
        $path = $this->basePath."/uploads/".$courseName;

        $zip = new ZipArchive();
        if(!file_exists($path)) {
            mkdir($path, 0777, true);

        }
        chmod($path, 0777);
        $zipPath = $path."/".$zipName.".zip";
        $returnPath = "/uploads/".$courseName."/".$zipName.".zip";
        if($zip->open($zipPath, ZipArchive::CREATE)){
            $filePaths = [];
            foreach($files as $file){
                //setting new name for files
                $fileName = explode(" ",$file->getClientOriginalName());
                $fileName = implode("_", $fileName);

                //storing files on server
                $newPath = $this->storeFileContents($path."/".$fileName, file_get_contents($file->getRealPath()));

                //adding files to zip
                $zip->addFile($newPath, $fileName);
                // saving file paths so it can be deleted after zipping
                $filePaths[] = $newPath;
            }
            //create zip file and add permisions
            $zip->close();
            chmod($zipPath, 0777);

            // delete files
            $this->deleteAllZippedFiles($filePaths);
        }

        return $returnPath;

    }

    public function deleteZippedFiles($url){
        unlink($this->basePath.$url);
    }

    private function storeFileContents($path, $content){
        file_put_contents($path, $content);
        chmod($path, 0777);
        return $path;
    }

    private function deleteAllZippedFiles($files){
        foreach($files as $file){
            unlink($file);
        }
    }
}