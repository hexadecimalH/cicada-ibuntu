<?php

/**
 * Created by PhpStorm.
 * User: haris
 * Date: 5.6.17
 * Time: 15:56
 */
namespace Ibuntu\Libraries;

use \Eventviva\ImageResize;

class ImageManipulationLibrary
{
    function __construct()
    {
    }

    public function resize($binaryContents){
        $image = ImageResize::createFromString($binaryContents);
        $image->resizeToWidth(200);
        $resizedBinaryContents = $image->getImageAsString();
        return $resizedBinaryContents;
    }

    public function resizeImage($binaryContents, $width, $height){
        $image = ImageResize::createFromString($binaryContents);
        $image->crop($width, $height);
        $resizedBinaryContents = $image->getImageAsString();
        return $resizedBinaryContents;
    }
}