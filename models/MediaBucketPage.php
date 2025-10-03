<?php

namespace Yngrk\MediaLibrary\Models;

use Kirby\Cms\Page;
use Kirby\Toolkit\Str;

class MediaBucketPage extends Page {
    protected function canManage(): bool {
        $user = kirby()->user();
        $role = option('yngrk.media-library.role', 'admin');
        return $user && $user->role()->name() === $role;
    }

    public function isReadable(): bool
    {
        return true;
    }

    public function reportCount() {
        $count = $this->files()->count();
        return [
            'label' => 'files uploaded',
            'value' => $count === 0 ? '–' : $count,
        ];
    }

    public function reportTotalFileSize() {
        return [
            'label' => 'total filesize',
            'value' => $this->files()?->niceSize() ?? '-',
        ];
    }

    public function reportAvgFileSize() {
        $files = $this->files();

        if ($files->isEmpty()) {
            return [
                'label' => 'Average file size',
                'value' => '–'
            ];
        }

        $totalSize = $this->files()->size();
        $avgSize = $totalSize / $files->count();

        $niceSize = $avgSize > (1024*1024)
            ? round($avgSize / (1024*1024), 2) . ' MB'
            : round($avgSize / 1000, 2) . ' KB';

        return [
            'label' => 'average filesize',
            'value' => $niceSize,
        ];
    }

    public function reportLargestFileSize() {
        $file = $this->files()->sortBy('size', 'desc')->first();

        if (!$file) {
            return [
                'label' => 'Largest file',
                'value' => '–'
            ];
        }

        return [
            'label' => 'largest filesize',
            'value' => $file->niceSize(),
            'info' => $file->filename(),
            'theme' => $file->size() > 1000000 ? 'negative' : 'positive',
        ];
    }


    public function isListed(): bool
    {
        return false;
    }
}