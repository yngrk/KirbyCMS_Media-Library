<?php

return [
    'routes' => [
        [
            'pattern' => 'yngrk-media-library/categories',
            'method'  => 'GET',
            'auth' => false,
            'action'  => function () {
                $uid = option('yngrk.media-library.uid', 'media-library');

                if (!$lib = page($uid)) {
                    return [
                        'categories' => ['uncategorized'],
                        'count' => ['uncategorized' => 0],
                    ];
                }

                $root = $lib->find('categories') ?? page($uid . '/categories');

                if (!$root) {
                    return [];
                }

                $options = [];

                foreach ($root->index() as $category) {
                    $chain = $category->parents()->flip()->add($category);

                    $start = $chain->indexOf($root);
                    if ($start !== null) {
                        $chain = $chain->slice($start + 1);
                    }

                    $text = implode('/', $chain->pluck('title', null, true));

                    $value = $chain->last()->uuid()->toString();

                    $options[] = [
                        'text' => $text,
                        'value' => $value,
                        'id' => $category->id(),
                    ];
                }

                return $options;
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
                    if (!$cat) {
                        $files = $files->filterBy('category', '');
                    } else {
                        $files = $files->filter(fn ($file) => in_array($cat, $file->category()->yaml()));
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
];