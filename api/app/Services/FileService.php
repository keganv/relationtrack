<?php

namespace App\Services;

use App\Models\File;
use App\Models\Relationship;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\Exception\UploadException;
use Symfony\Component\HttpFoundation\Response;

class FileService
{
    public function storeFileToStorage(User $user, UploadedFile $uploadedFile): string
    {
        $path = $uploadedFile->store("uploads/users/$user->id", 'private');

        if (!$path) {
            $message = sprintf('Failed to upload the image %s to storage.', $uploadedFile->getClientOriginalName());
            throw new UploadException($message, Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $path;
    }

    /**
     * @param File $files
     * @return bool
     */
    public function removeFilesFromStorage(File $files): bool
    {
        /** @var File $file */
        foreach ($files as $file) {
            $file->delete(); // Delete the database record

            if (Storage::disk('s3')->exists($file->path)) {
                // Remove the actual file from S3
                $deleteSuccess = Storage::disk('s3')->delete($file->path);

                // Important to Log the file that didn't get deleted for audits and removing from S3
                if (!$deleteSuccess) {
                    $message = "Failed to remove the file {$file->path} from storage.";
                    Log::channel('single')->error($message); // TODO: Write to custom FileLogger
                    throw new UploadException($message, Response::HTTP_INTERNAL_SERVER_ERROR);
                }
            }
        }

        return true;
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
     * Returns true if the Files are saved and stored or throws an Exception response error.
     *
     * @param UploadedFile[] $images
     * @param Relationship $relationship
     * @param User $user
     * @return bool
     * @throws FileException
     */
    public function addFilesToRelationship(array $images, Relationship $relationship, User $user): bool
    {
        /**
         * We need a collection to keep a count of the total files and to prevent duplicate uploads
         * @var Collection $files
         */
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
                    sprintf("The file %s has already been uploaded.", $upload->getClientOriginalName()),
                    Response::HTTP_UNPROCESSABLE_ENTITY
                );
            }

            if ($upload->getSize() > 2097152) {
                throw new FileException(
                    sprintf("The file %s is too large.", $upload->getClientOriginalName()),
                    Response::HTTP_UNPROCESSABLE_ENTITY
                );
            }

            // Upload the UploadedFile to S3 and save the File (model) record to the database
            if ($path = Storage::disk('s3')->putFile('/uploads/users/' . $user->id . '/relationships', $upload)) {
                $file = new File();
                $file->user_id = $user->id;
                $file->relationship_id = $relationship->id;
                $file->name = $upload->getClientOriginalName();
                $file->extension = $upload->extension();
                $file->path = $path;
                $file->size = $upload->getSize();

                if (!$file->save()) {
                    throw new FileException(
                        "The file {$upload->getClientOriginalName()} could not be saved.",
                        Response::HTTP_INTERNAL_SERVER_ERROR
                    );
                }

                $files->add($file); // Add to the temporary File Collection
            } else {
                // The File could not be uploaded or saved
                throw new FileException(
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
