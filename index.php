<?php

use Kirby\Cms\App as Kirby;
use Kirby\Toolkit\Str;

load([
    'Yngrk\MediaLibrary\Models\MediaLibraryPage' => 'src/php/models/MediaLibraryPage.php',
    'Yngrk\MediaLibrary\Models\MediaBucketPage' => 'src/php/models/MediaBucketPage.php'
], __DIR__);


function sanitizeBucket($bucket) {
    $allowed = option('yngrk.media-library.buckets', ['images','videos','documents']);
    return in_array($bucket, $allowed, true) ? $bucket : 'images';
}

Kirby::plugin('yngrk/media-library', [
    'options' => [
        'uid' => 'media-library',
        'buckets' => ['images', 'documents', 'videos'],
        'autocreate' => true,
        'role' => 'admin'
    ],

    'pageModels' => [
        'media-library' => \Yngrk\MediaLibrary\Models\MediaLibraryPage::class,
        'media-bucket' => \Yngrk\MediaLibrary\Models\MediaBucketPage::class,
    ],

//    'routes' => [
//        [
//            'pattern' => option('yngrk.media-library.uid', 'media-library') . '(:all)?',
//            'method'  => 'ALL',
//            'action'  => function () {
//                return site()->errorPage();
//            }
//        ]
//    ],

    'hooks' => [
        'system.loadPlugins:after' => function () {
            if (!option('yngrk.media-library.autocreate')) return;

            kirby()->impersonate('kirby');

            $uid = option('yngrk.media-library.uid');
            $tplLib = 'media-library';
            $tplBuck =  'media-bucket';

            if (!page($uid)) {
                $library = site()->createChild([
                   'slug' => $uid,
                   'template' => $tplLib,
                   'content' => [
                       'title' => 'Media Library',
                       'label'  => 'Media Library',
                       'categories' => '',
                   ],
                    'isDraft' => false,
                ]);

                foreach ((array) option('yngrk.media-library.buckets', []) as $bucket) {
                    if (!$library->find($bucket)) {
                        $library->createChild([
                            'slug' => \Kirby\Toolkit\Str::slug($bucket),
                            'template' => $tplBuck,
                            'content' => [
                                'title' => ucfirst($bucket),
                                'label' => ucfirst($bucket),
                            ],
                            'isDraft' => false,
                        ]);
                    }
                }
            }
        },
    ],

    'fields' => [
        'media-library' => [
            'extends' => 'files',
            'props' => [
                'bucket' => function () {
                    return $this->bucket ?? 'images';
                },
                'libUid' => function () {
                    return option('yngrk.media-library.uid', 'media-library');
                },
                'query' => function () {
                    return 'page("' . $this->libUid . '/' . sanitizeBucket($this->bucket ?? 'images') . '").files';
                },
                'uploads' => function () {
                    return [
                        'parent' => 'page("' . $this->libUid . '/'. sanitizeBucket($this->bucket ?? 'images') . '")',
                    ];
                },
                'label' => function ($label = null) {
                    return ($label ?? 'Media Library') . ' (' . sanitizeBucket($this->bucket ?? 'images') . ')';
                }
            ],
        ]
    ],

    'api' => [
        'routes' => [
            [
                'pattern' => 'yngrk-media-library/categories',
                'auth' => false,
                'method'  => 'GET',
                'action'  => function () {
                    $uid = option('yngrk.media-library.uid', 'media-library');
                    if ($lib = page($uid)) {
                        return ['categories' => $lib->content()->get('categories')?->split() ?? []];
                    }
                    return ['categories' => []];
                }
            ],
        ],
    ]
]);