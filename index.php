<?php

use Kirby\Cms\App as Kirby;

load([
    'Yngrk\MediaLibrary\Models\MediaLibraryPage' => 'models/MediaLibraryPage.php',
    'Yngrk\MediaLibrary\Models\MediaBucketPage' => 'models/MediaBucketPage.php',
    'Yngrk\MediaLibrary\Models\MediaCategoryPage' => 'models/MediaCategoryPage.php',
], __DIR__);


function sanitizeBucket($bucket) {
    $allowed = option('yngrk.media-library.buckets', ['images','videos','documents']);
    return in_array($bucket, $allowed, true) ? $bucket : 'images';
}

Kirby::plugin('yngrk/media-library', [
    'options' => require __DIR__ . '/config/options.php',
    'areas' => require __DIR__ . '/config/areas.php',
    'blueprints' => require __DIR__ . '/config/blueprints.php',
    'templates' => require __DIR__ . '/config/templates.php',
    'pageModels' => require __DIR__ . '/config/pageModels.php',
    'routes' => require __DIR__ . '/config/routes.php',
    'hooks' => require __DIR__ . '/config/hooks.php',
    'fields' => require __DIR__ . '/config/fields.php',
    'api' => require __DIR__ . '/config/api.php',
]);