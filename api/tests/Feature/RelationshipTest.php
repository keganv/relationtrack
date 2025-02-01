<?php

namespace Tests\Feature;

use App\Models\Relationship;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class RelationshipTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Relationship $relationship;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->relationship = Relationship::factory()->create(['user_id' => $this->user->id]);
    }

    public function test_a_relationship_can_be_created(): void
    {
        $this->assertTrue($this->relationship->exists());
    }

    public function test_relationship_relates_to_a_user(): void
    {
        $relationshipUser = $this->relationship->user;
        $this->assertEquals($this->user->id, $relationshipUser->id);
    }

    public function test_files_can_be_attached_to_a_relationship(): void
    {
        $fakeFile = UploadedFile::fake()->image('image1.jpg', 100);

        $file = $this->relationship->files()->create([
            'extension' => $fakeFile->extension(),
            'name' => $fakeFile->getClientOriginalName(),
            'path' => '/uploads/users/'.$this->user->id.'/relationships',
            'type' => $fakeFile->getMimeType(),
            'relationship_id' => $this->relationship->id,
            'size' => $fakeFile->getSize(),
            'user_id' => $this->user->id,
        ]);

        $this->assertEquals($file->id, $this->relationship->files->first()->id);
    }

    public function test_a_relationship_can_be_soft_deleted(): void
    {
        $this->relationship->delete();
        self::assertTrue($this->relationship->trashed());
    }

    public function test_a_relationship_deleted_at_can_be_updated(): void
    {
        $yesterday = (new \DateTime('now'))->sub(\DateInterval::createFromDateString('1 day'));
        $this->relationship->deleted_at = $yesterday;
        self::assertEquals($this->relationship->deleted_at->format('Y-m-d'), $yesterday->format('Y-m-d'));
    }
}
