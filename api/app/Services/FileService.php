<?php

namespace App\Services;

use App\Models\File;
use App\Models\Relationship;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\Exception\UploadException;
use Symfony\Component\HttpFoundation\Response;

class FileService
{
    public function uploadFileToStorage(UploadedFile $uploadedFile, string $path): string
    {
        $result = Storage::disk('s3')->putFile($path, $uploadedFile);

        // The File could not be uploaded or saved
        if (!$result) {
            throw new UploadException(
                "The file {$uploadedFile->getClientOriginalName()} could not be uploaded.",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }

        return $result;
    }

    /**
     * @param Collection<File> $files
     *
     * @return bool
     * @throws FileException
     */
    public function removeFilesFromStorage(Collection $files): bool
    {
        foreach ($files as $file) {
            $this->removeFileFromStorage($file);
        }

        return true;
    }

    /**
     * @param File $file
     * @return bool
     */
    public function removeFileFromStorage(File $file): bool
    {
        if (!Storage::disk('s3')->exists($file->path)) {
            return false; // If the file does not exist, don't worry about it
        }

        // Remove the actual file from S3
        $deleteSuccess = Storage::disk('s3')->delete($file->path);

        // Important to Log the file that didn't get deleted for audits and removing from S3
        if (!$deleteSuccess) {
            $message = "Failed to remove the file {$file->path} from storage.";
            Log::channel('single')->error($message); // TODO: Write to custom FileLogger
            throw new FileException($message, Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $file->delete(); // Always delete the database record, because the actual file has been removed

        return true;
    }

    /**
     * @throws FileException
     */
    public function createNewFile(
        User $user,
        UploadedFile $uploadedFile,
        string $path,
        Relationship $relationship = null
    ): File {
        $file = new File([
            'name' => $uploadedFile->getClientOriginalName(),
            'extension' => $uploadedFile->extension(),
            'path' => $path,
            'size' => $uploadedFile->getSize(),
        ]);

        // Set non-fillable attributes
        $file->user_id = $user->id;
        $file->relationship_id = $relationship?->id ?? null;

        if (!$file->save()) {
            $message = sprintf('Failed to save the file %s.', $uploadedFile->getClientOriginalName());
            throw new FileException($message, Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $file;
    }

    /**
     * @throws FileException
     */
    public function updateFile(File $file, array $data): File
    {
        $file->name = $data['name'] ?? $file->name;
        $file->extension = $data['extension'] ?? $file->extension;
        $file->path = $data['path'] ?? $file->path;
        $file->size = $data['size'] ?? $file->size;

        if (! $file->save()) {
            $message = sprintf('Failed to update the file %s.', $file->name);
            throw new FileException($message, Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $file;
    }

    /**
     * Returns true if the Files are saved and stored or throws an Exception response error.
     *
     * @param  UploadedFile[] $uploads
     *
     * @throws FileException
     */
    public function addFilesToRelationship(array $uploads, Relationship $relationship, User $user): bool
    {
        /**
         * We need a collection to keep a count of the total files and to prevent duplicate uploads
         *
         * @var Collection<File> $files
         */
        $files = $relationship->files ?? new Collection();

        // First check to see that the User is not over the 10 files per Relationship limit.
        if ((count($uploads) + count($files)) > 10) {
            throw new FileException(
                'Sorry, only 10 images can be uploaded per relationship.',
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        // Gather a list of existing file names associated with the Relationship.
        $existingFileNames = $files->pluck('name')->toArray();

        foreach ($uploads as $upload) {
            // Check if the user has already uploaded a file with the same name.
            if (in_array($upload->getClientOriginalName(), $existingFileNames)) {
                throw new FileException(
                    sprintf('The file %s has already been uploaded.', $upload->getClientOriginalName()),
                    Response::HTTP_UNPROCESSABLE_ENTITY
                );
            }

            // Only allow 1MB for file size
            if ($upload->getSize() > 1048576) {
                throw new FileException(
                    sprintf('The file %s is too large.', $upload->getClientOriginalName()),
                    Response::HTTP_UNPROCESSABLE_ENTITY
                );
            }

            // Upload the UploadedFile to S3
            $path = $this->uploadFileToStorage($upload, '/files/users/'.$user->id.'/relationships');

            // Save the File (model) record to the database
            $file = $this->createNewFile($user, $upload, $path, $relationship);
            $files->add($file); // Add to the temporary File Collection
        }

        /**
         * Set the Primary Image if the Relationship does not already have one
         *
         * @var File $file
         */
        if (!$relationship->primary_image_id && ($file = $files->first())) {
            $relationship->primary_image_id = $file->id;
        }

        return true;
    }
}
