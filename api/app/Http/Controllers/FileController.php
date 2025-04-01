<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Services\FileService;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class FileController extends Controller
{
    public function __construct(private FileService $fileService)
    {
    }

    public function destroy(File $file)
    {
        $this->authorize('delete', $file);

        try {
            $this->fileService->removeFileFromStorage($file);
            return response()->noContent();
        } catch (FileException $e) {
            return response()->json(['message' => $e->getMessage()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }
}
