<?php

namespace app\Services;

use App\Models\File;
use App\Models\Relationship;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\Exception\UploadException;
use Symfony\Component\HttpFoundation\Response;

class FileService
{
    public function storePrivateFileToStorage(User $user, UploadedFile $uploadedFile): string
    {
        $path = $uploadedFile->store("uploads/users/$user->id", 'private');

        if (!$path) {
            $message = sprintf('Failed to upload the image %s to storage.', $uploadedFile->getClientOriginalName());
            throw new UploadException($message, Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $path;
    }

    public function removeFileFromStorage(string $path): bool
    {
        if (Storage::exists($path) && Storage::delete($path)) {
            return true;
        }

        $message = 'Failed to remove the file from storage.';
        throw new UploadException($message, Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    /**
     * @param User $user
     * @param UploadedFile $uploadedFile
     * @param string $path
     * @return File
     * @throws \Exception
     */
    public function createNewUserFile(User $user, UploadedFile $uploadedFile, string $path): File
    {
        $file = new File([
            'user_id' => $user->id,
            'name' => $uploadedFile->getClientOriginalName(),
            'extension' => $uploadedFile->extension(),
            'path' => $path,
            'size' => $uploadedFile->getSize(),
        ]);

        if ($file->save()) {
            return $file;
        }

        $message = sprintf('Failed to save the file %s.', $uploadedFile->getClientOriginalName());
        throw new \Exception($message, Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    /**
     * @param File $file
     * @param array $data
     * @return File
     * @throws \Exception
     */
    public function updateFile(File $file, array $data): File
    {
        $file->name = $data['name'] ?? $file->name;
        $file->extension = $data['extension'] ?? $file->extension;
        $file->path = $data['path'] ?? $file->path;
        $file->size = $data['size'] ?? $file->size;

        if (!$file->save()) {
            $message = sprintf('Failed to update the file %s.', $file->name);
            throw new \Exception($message, Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $file;
    }

    public function servePrivateFile(User $user, string $path)
    {
        Gate::authorize('view', $user);

        if (!Storage::disk('s3')->exists($path)) {
            throw new FileNotFoundException($path, Response::HTTP_NOT_FOUND);
        }

        return Storage::disk('s3')->path($path);
    }

    /**
     * Send back a collection of Files after they are saved and stored or an JSON response error.
     *
     * @param UploadedFile[] $images
     * @param Relationship $relationship
     * @param User $user
     * @return bool
     */
    public function addFilesToRelationship(array $images, Relationship $relationship, User $user): bool
    {
        /** @var Collection $files */
        $files = $relationship->files ?? new Collection();

        // First check to see that the User is not over the 10 files per Relationship limit.
        if ((count($images) + count($files)) > 10) {
            throw new FileException(
                "Sorry, only 10 images can be uploaded per relationship.",
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        // Gather a list of existing file names associated with the Relationship.
        $existingFileNames = $files->pluck('name')->toArray();

        foreach ($images as $upload) {
            // Check if the user has already uploaded a file with the same name.
            if (in_array($upload->getClientOriginalName(), $existingFileNames)) {
                throw new FileException(
                    "The file {$upload->getClientOriginalName()} has already been uploaded.",
                    Response::HTTP_UNPROCESSABLE_ENTITY
                );
            }

            if ($upload->getSize() > 2147483648) {
                throw new FileException(
                    "The file {$upload->getClientOriginalName()} is too large. {$upload->getSize()}",
                    Response::HTTP_UNPROCESSABLE_ENTITY
                );
            }

            if ($path = Storage::disk('s3')->putFile('/uploads/users/' . $user->id . '/relationships', $upload)) {
                $file = new File();
                $file->user_id = $user->id;
                $file->relationship_id = $relationship->id;
                $file->name = $upload->getClientOriginalName();
                $file->extension = $upload->extension();
                $file->path = $path;
                $file->size = $upload->getSize();

                if (!$file->save()) {
                    throw new \RuntimeException(
                        "The file {$upload->getClientOriginalName()} could not be saved.",
                        Response::HTTP_INTERNAL_SERVER_ERROR
                    );
                }

                $files->add($file);
            } else {
                // The file could not be uploaded
                throw new \RuntimeException(
                    "The file {$upload->getClientOriginalName()} could not be uploaded.",
                    Response::HTTP_INTERNAL_SERVER_ERROR
                );
            }

            // Set the Primary Image if the Relationship does not already have one
            if (!$relationship->primary_image_id) {
                $relationship->primary_image_id = $files->first()->id;
            }
        }

        return true;
    }
}
