<?php

namespace Tests\Unit\User\Profile;

use App\User;
use PHPUnit\Framework\TestCase;

class ProfileImageUploadTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function test_example()
    {
        $user = factory(User::class)->create();
        $this->assertTrue(true);
    }
}
