<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Relationship;
use App\Models\RelationshipType;
use App\Models\User;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

use Symfony\Component\HttpFoundation\FileBag;

class RelationshipController extends Controller
{
    public function index()
    {
        $relationships = Relationship::with(['primaryImage', 'type', 'files', 'actionItems'])
            ->where('user_id', Auth::id())->get();

        return response()->json($relationships, Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        $relationship = new Relationship();

        $this->authorize('create', $relationship);

        return $this->save($request, $relationship);
    }

    public function update(Request $request, Relationship $relationship)
    {
        // Check for both the relationship and a security test to make sure that
        // the requested relationship belongs to the user.
        if (!$relationship || !$this->authorize('update', $relationship)) {
            return response()->json(
                ['message' => 'The requested relationship does not exist.'],
                Response::HTTP_NOT_FOUND
            );
        }

        return $this->save($request, $relationship);
    }

    public function getTypes()
    {
        $types = DB::table('relationship_types')->get();

        return response()->json($types, Response::HTTP_OK);
    }

    private function save(Request $request, Relationship $relationship)
    {
        $request->validate([
            'type' => 'required|exists:relationship_types,id',
            'name' => 'required|max:55',
            'title' => 'required|max:55',
            'health' => 'required|numeric|min:0|max:10',
            'birthday' => 'nullable|date|before:today',
            'images' => 'nullable|array|max:10',
            'images.*' => 'image|max:2048'
        ]);

        $relationship->fill([
            'type_id' => $request->input('type'),
            'name' => $request->input('name'),
            'title' => $request->input('title'),
            'health' => $request->input('health'),
            'birthday' => $request->input('birthday'),
            'description' => $request->input('description')
        ]);
        $relationship->user_id = Auth::id();
        $relationship->save();

        if ($request->file('images')) {
            if ((count($request->file('images')) + count($relationship->files)) >= 10) {
                return response()->json([
                    'errors' => [
                        'images' => ["Sorry, only 10 images can be uploaded per relationship."]
                    ]
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $addImgResponse = $this->addImagesToRelationship($request->file('images'), $relationship, $user);

            // If there is an error
            if (!is_array($addImgResponse)) {
                return $addImgResponse;
            }

            // Set the Primary Image if the Relationship does not already have one
            if (!$relationship->primary_image_id) {
                $relationship->primary_image_id = $addImgResponse[0]->id;
                $relationship->save();
            }
        }

        $successMessage = "Your relationship was saved successfully!";

        return response()->json(['message' => $successMessage], Response::HTTP_CREATED);
    }

    public function delete(string $id)
    {
        /** @var Relationship|null $relationship */
        $relationship = Relationship::findOrFail($id);
        /** @var User $user */
        $user = Auth::user();

        // Check if the current User and the Relationship is correct
        if ($relationship?->user_id === $user->id) {
            /**
             * Remove the existing Files
             * @var File $file
             */
            foreach ($relationship->files() as $file) {
                $file->delete();
                if (Storage::exists($file->path)) {
                    Storage::delete($file->path);
                }
            }

            $relationship->delete();

            return response()->json(['message' => 'Successfully deleted the Relationship.'], 201);
        }

        return response()->json(['message' => 'Could not find the Relationship.'], 404);
    }

    public function getRelationshipImage(string $userId, string $id, string $file)
    {
        $path = "/uploads/users/{$userId}/relationships/$id/{$file}";

        return response()->file(Storage::disk('private')->path($path)) ?? response('Not found.', 404);
    }

    public function updatePrimaryImage(Request $request, $id)
    {
        /** @var Relationship|null $relationship */
        $relationship = Relationship::findOrFail($id);
        /** @var User $user */
        $user = Auth::user();
        $data = $request->getPayload();

        // Check for both the relationship and a security test to make sure that
        // the requested relationship belongs to the user.
        if (!$relationship || ($relationship?->user_id !== $user->id)) {
            return response()->json([
                'message' => 'The requested relationship does not exist.', Response::HTTP_NOT_FOUND
            ]);
        }

        try {
            $relationship->primary_image_id = $data->get('id');
            $relationship->save();

            return response()->json(['message' => 'Successfully updated primary image.'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode());
        }
    }

    /**
     * @param FileBag $images
     * @return File[]|JsonResponse
     */
    private function addImagesToRelationship(array $images, Relationship $relationship, User $user): array|JsonResponse
    {
        // Send back a collection of Files or a redirect response after they are saved and stored or an error.
        $files = [];
        // Existing file names for the Relationship
        $existingFileNames = array_map(fn($img) => $img['name'], $relationship->files()->get()->toArray());
        /** @var UploadedFile $upload */
        foreach ($images as $upload) {
            if (in_array($upload->getClientOriginalName(), $existingFileNames)) {
                return response()->json([
                    'message' => "The file {$upload->getClientOriginalName()} has already been uploaded."
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            if ($upload->getSize() > 2147483648) {
                return response()->json([
                    'message' => "The file {$upload->getClientOriginalName()} is too large. {$upload->getSize()}"
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            if (!$upload->isValid()) {
                return response()->json([
                    'message' => "File {$upload->getClientOriginalName()}: {$upload->getErrorMessage()}."
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $file = new File();
            $path = $upload->store('uploads/users/' . $user->id . '/relationships/' . $relationship->id, 'private');
            $file->user_id = $user->id;
            $file->relationship_id = $relationship->id;
            $file->name = $upload->getClientOriginalName();
            $file->extension = $upload->extension();
            $file->path = $path;
            $file->size = $upload->getSize();

            if (!$file->save()) {
                return response()->json([
                    'message' => "The file {$upload->getClientOriginalName()} could not be uploaded."
                ], 500);
            }

            $files[] = $file;
        }

        return $files;
    }

    private function handlePrimaryImage(Relationship $relationship, UploadedFile $file) {
        $previous = $relationship->primaryImage();
        try {
            /** @var File $previous */
            if ($previous) {
                $previous->delete();
                if (Storage::exists($previous->path)) {
                    Storage::delete($previous->path);
                }
            }
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
