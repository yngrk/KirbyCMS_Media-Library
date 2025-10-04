<?php

return [
    [
        'pattern' => option('yngrk.media-library.uid', 'media-library') . '(:all)?',
        'method'  => 'ALL',
        'action'  => function () {
            return site()->errorPage();
        }
    ]
];