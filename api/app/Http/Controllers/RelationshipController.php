<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Relationship;
use App\Models\User;
use App\Services\FileService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class RelationshipController extends Controller
{
    public function __construct(private FileService $fileService)
    {
    }

    public function index()
    {
        $relationships = Relationship::with(['primaryImage', 'files', 'actionItems'])
            ->where('user_id', Auth::id())->get()->toArray();

        return response()->json($relationships, Response::HTTP_OK);
    }

    /**
     * @throws AuthorizationException
     */
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
        if (! $relationship || ! $this->authorize('update', $relationship)) {
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
        ], [
            'images.max' => 'You may not upload more than 10 images per relationship.',
            'images.*.image' => 'The file :attribute must be a valid image (jpg, jpeg, png, bmp, gif, svg, or webp).',
        ]);

        // Remove the id to pass fillable mass assignment
        $data = array_filter($request->request->all(), fn ($key) => $key !== 'id', ARRAY_FILTER_USE_KEY);
        $relationship->fill([...$data]);

        try {
            if ($request->file('images')) {
                $this->fileService->addFilesToRelationship($request->file('images'), $relationship, Auth::user());
            }

            $relationship->user_id = Auth::id(); //
            $relationship->save();
            $successMessage = 'Your relationship was saved successfully!';

            return response()->json(['message' => $successMessage], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json(
                ['message' => $e->getMessage()],
                $e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * @throws AuthorizationException
     */
    public function delete(Relationship $relationship): JsonResponse
    {
        // Check for both the relationship and a security test to make sure that
        // the requested relationship belongs to the user.
        if (! $relationship || ! $this->authorize('delete', $relationship)) {
            return response()->json(
                ['message' => 'The requested relationship does not exist.'],
                Response::HTTP_NOT_FOUND
            );
        }

        if ($files = $relationship->files) {
            $this->fileService->removeFilesFromStorage($files);
        }

        $relationship->delete();

        return response()->json(['message' => 'Successfully deleted the Relationship.'], 201);
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
        if (! $relationship || ($relationship?->user_id !== $user->id)) {
            return response()->json([
                'message' => 'The requested relationship does not exist.', Response::HTTP_NOT_FOUND,
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

    private function handlePrimaryImage(Relationship $relationship, UploadedFile $file)
    {
        $previous = $relationship->primaryImage;
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
