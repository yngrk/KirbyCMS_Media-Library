<?php

use Kirby\Cms\App as Kirby;

load([
    'Yngrk\MediaLibrary\Models\MediaLibraryPage' => 'src/php/models/MediaLibraryPage.php',
    'Yngrk\MediaLibrary\Models\MediaBucketPage' => 'src/php/models/MediaBucketPage.php'
], __DIR__);

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

    'routes' => [
        [
            'pattern' => option('yngrk.media-library.uid', 'media-library') . '(:all)?',
            'method'  => 'ALL',
            'action'  => function () {
                return site()->errorPage();
            }
        ]
    ],

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
        '' => function (\Kirby\Cms\File $file) {
            $uid = option('yngrk.media-library.uid');
            $library = page($uid);

            if (!$library) return;

            if (!$file->parent()->is($library)) return;

            $map = [
                'image' => 'images',
                'document' => 'documents',
                'video' => 'videos'
            ];

            $type = $file->type();
            $bucketSlug = $map[$type] ?? null;

            if (!$bucketSlug) return;

            $bucket = $library->find($bucketSlug);
            if (!$bucket || $file->parent()->is($bucket)) return;

            try {
                $file->move($bucket);
            } catch (\Throwable $e) {
                error_log('[Media Library] ' . $e->getMessage());
            }
        }
    ],
]);