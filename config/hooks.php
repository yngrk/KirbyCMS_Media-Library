<?php

return [
    'user.login:after' => function () {
        if (!option('yngrk.media-library.autocreate')) return;
        if (!kirby()->user()) return;

        kirby()->impersonate('kirby');

        $uid = option('yngrk.media-library.uid', 'media-library');
        $tplLib = 'yngrk-media-library';
        $tplBuck =  'yngrk-media-bucket';

        $library = page($uid) ?? site()->createChild([
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

        if (!$library->find('categories')) {
            $library->createChild([
                'slug' => 'categories',
                'template' => 'yngrk-media-category',
                'content' => [
                    'title' => 'Categories',
                    'label'  => 'Categories',
                ],
                'isDraft' => false,
            ]);
        }
    },
];