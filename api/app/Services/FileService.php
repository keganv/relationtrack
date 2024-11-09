<?php

namespace app\Services;

use App\Models\File;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Symfony\Component\HttpFoundation\File\Exception\UploadException;

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
}
