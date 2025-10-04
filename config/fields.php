<?php

return [
    'yngrk-media-library' => [
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
                $bucket = $this->bucket ?? 'images';

                $accept = $this->accept ?? match ($bucket) {
                    'videos'    => 'video/*',
                    'documents' => 'application/*',
                    default     => 'image/*',
                };

                $template = match ($bucket) {
                    'videos' => 'yngrk-media-video',
                    'documents' => 'yngrk-media-document',
                    default => 'yngrk-media-image',
                };

                return [
                    'parent'   => 'page("' . $this->libUid . '/' . sanitizeBucket($bucket) . '")',
                    'template' => $template,
                    'accept'   => $accept,
                ];
            },
            'label' => function ($label = null) {
                return ($label ?? 'Media Library');
            }
        ],
    ]
];