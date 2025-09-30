<?php

use Kirby\Cms\App as Kirby;
use Kirby\Toolkit\Str;

load([
    'Yngrk\MediaLibrary\Models\MediaLibraryPage' => 'models/MediaLibraryPage.php',
    'Yngrk\MediaLibrary\Models\MediaBucketPage' => 'models/MediaBucketPage.php'
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

    'blueprints' => [
        'files/yngrk-media-library-file' => __DIR__ . '/blueprints/files/yngrk-media-library-file.yml',
        'pages/yngrk-media-library-page' => __DIR__ . '/blueprints/pages/yngrk-media-library-page.yml',
        'pages/yngrk-media-bucket-page' => __DIR__ . '/blueprints/pages/yngrk-media-bucket-page.yml'
    ],

    'templates' => [
        'yngrk-media-library-page' => __DIR__ . '/templates/yngrk-media-library-page.php',
        'yngrk-media-bucket-page'  => __DIR__ . '/templates/yngrk-media-bucket-page.php',
    ],

    'pageModels' => [
        'yngrk-media-library-page' => \Yngrk\MediaLibrary\Models\MediaLibraryPage::class,
        'yngrk-media-bucket-page' => \Yngrk\MediaLibrary\Models\MediaBucketPage::class,
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
            $tplLib = 'yngrk-media-library-page';
            $tplBuck =  'yngrk-media-bucket-page';

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
                        'template' => 'yngrk-media-library-file'
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

                    if (!$lib = page($uid)) {
                        return [
                            'categories' => ['uncategorized'],
                            'count' => ['uncategorized' => 0],
                        ];
                    }

                    $categories = $lib->content()->get('categories')?->split() ?? [];
                    $categories[] = 'uncategorized';
                    $categories = array_values(array_unique(array_filter($categories)));

                    $files = $lib->index()->files();

                    $count = [];
                    foreach ($categories as $category) {
                        $count[$category] = 0;
                    }

                    foreach($files as $file) {
                        $c = (string) $file->category()->value();
                        if ($c === '') {
                            $count['uncategorized']++;
                            continue;
                        }

                        if (!in_array($c, $categories, true)) {
                            $categories[] = $c;
                        }

                        $count[$c] = ($count[$c] ?? 0) + 1;
                    }

                    return [
                        'categories' => $categories,
                        'count' => $count,
                    ];
                }
            ],
            [
                'pattern' => 'yngrk-media-library/files',
                'method' => 'GET',
                'auth' => false,
                'action' => function () {
                    $pageNum = max(1, (int)get('page', 1));
                    $limit   = min(100, max(1, (int)get('limit', 20)));
                    $q       = trim((string)get('search', ''));
                    $bucket = sanitizeBucket(get('bucket'));
                    $cat = get('category');

                    $libUid = option('yngrk.media-library.uid', 'media-library');
                    $parent = page($libUid . '/' . $bucket);

                    if (!$parent) {
                        return [
                            'data' => [],
                            'pagination' => [
                                'page' => 1,
                                'pages' => 1,
                                'offset' => 0,
                                'limit' => $limit,
                                'total' => 0,
                            ]
                        ];
                    }

                    $files = $parent->files()->sortBy('filename', 'asc');

                    if ($cat) {
                        if ($cat === 'uncategorized') {
                            $files = $files->filterBy('category', '');
                        } else {
                            $files = $files->filterBy('category', $cat);
                        }
                    }

                    if ($q !== '') {
                        $files = $files->search($q);
                    }

                    $paginated = $files->paginate($limit, ['page' => $pageNum]);

                    $data = $paginated->map(function ($file) {
                        return [
                            'id' => $file->id(),
                            'text' =>  $file->filename(),
                            'image' => $file->panel()->image()
                        ];
                    })->values();

                    $p = $paginated->pagination();

                    return [
                        'data' => $data,
                        'pagination' => [
                            'page' => $p->page(),
                            'pages' => $p->pages(),
                            'offset' => $p->offset(),
                            'limit' => $p->limit(),
                            'total' => $p->total(),
                        ]
                    ];
                }
            ]
        ],
    ]
]);