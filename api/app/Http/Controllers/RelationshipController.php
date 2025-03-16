<?php

namespace App\Http\Controllers;

use App\Http\Requests\RelationshipRequest;
use App\Http\Resources\RelationshipResource;
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
use Symfony\Component\HttpFoundation\File\Exception\FileException;

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

    public function store(RelationshipRequest $request)
    {
        return $this->save($request, new Relationship());
    }

    public function update(RelationshipRequest $request, Relationship $relationship)
    {
        return $this->save($request, $relationship);
    }

    public function getTypes()
    {
        $types = DB::table('relationship_types')->get();

        return response()->json($types, Response::HTTP_OK);
    }

    private function save(RelationshipRequest $request, Relationship $relationship): JsonResponse
    {
        // Remove fields that should be excluded from mass assignment
        $data = array_filter(
            $request->all(),
            fn ($key) => !in_array($key, ['images', 'id', '_method']),
            ARRAY_FILTER_USE_KEY
        );

        $relationship->fill([...$data]);

        try {
            if ($request->hasFile('images')) {
                $this->fileService->addFilesToRelationship($request->file('images'), $relationship, Auth::user());
            }

            $relationship->user_id = Auth::id();
            $relationship->save();
            $successMessage = 'Your relationship was saved successfully!';
            $relationship->load(['files', 'actionItems', 'primaryImage', 'relationshipType']);

            return response()->json([
                'data' => new RelationshipResource($relationship),
                'message' => $successMessage
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            if ($e instanceof FileException) {
                return response()->json(
                    ['errors' => ['images' => [$e->getMessage()]]],
                    Response::HTTP_UNPROCESSABLE_ENTITY
                );
            }

            return response()->json(
                ['message' => $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
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

    public function updatePrimaryImage(Request $request, Relationship $relationship)
    {
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
