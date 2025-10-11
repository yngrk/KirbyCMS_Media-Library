<?php

return [
    'media-library' => function ($kirby) {
        return [
            'label' => 'Media Library',
            'icon' => 'image',
            'menu' => true,

            'views' => [
                [
                    'pattern' => 'media-library',
                    'action' => function () {
                        return [
                            'component' => 'yngrk-media-library-panel-view',
                            'title' => 'Media Library',
                            'props' => [
                                'greeting' => 'Hello world!',
                            ]
                        ];
                    }
                ]
            ]
        ];
    }
];