<?php

namespace Yngrk\MediaLibrary\Models;

use Kirby\Cms\Page;

class MediaBucketPage extends Page {
    protected function canManage(): bool {
        $user = kirby()->user();
        $role = option('yngrk.media-library.role', 'admin');
        return $user && $user->role()->name() === $role;
    }

    public function isReadable(): bool
    {
        return $this->canManage();
    }

    public function isListed(): bool
    {
        return false;
    }
}