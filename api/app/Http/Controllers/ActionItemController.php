<?php

namespace App\Http\Controllers;

use App\Models\ActionItem;
use App\Models\Relationship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ActionItemController extends Controller
{
    public function store(Request $request)
    {
        $this->validateRequest($request);

        $actionItem = new ActionItem();

        return $this->save($actionItem, $request);
    }

    public function update(Request $request, ActionItem $actionItem)
    {
        $this->validateRequest($request);

        return $this->save($actionItem, $request);
    }

    public function delete(ActionItem $actionItem)
    {
        try {
            $relationship = $actionItem->relationship;
            $this->authorize('update', $relationship);
            $actionItem->delete();

            return response()->json($relationship->actionItems, Response::HTTP_OK);
        } catch (\Exception $e) {
            return response(['error' => 'Could not delete the Action Item.'], 404);
        }
    }

    public function getByRelationship(Relationship $relationship)
    {
        $this->authorize('view', $relationship);

        return response()->json($relationship->actionItems, Response::HTTP_OK);
    }

    /**
     * Validate the given request with the given rules.
     *
     * @param Request $request
     * @return array
     * @throws \Illuminate\Validation\ValidationException
     */
    private function validateRequest(Request $request): array
    {
        return $request->validate([
            'action' => 'required|min:10|max:50',
            'complete' => 'boolean',
            'relationship_id' => ['required', 'string']
        ], [
            'action.min' => 'The action item must be at least 10 characters.',
            'action.max' => 'Action items must be less than 50 characters.',
            'relationship_id' => 'There was no relationship provided for the action item.'
        ]);
    }

    private function save(ActionItem $actionItem, Request $request)
    {
        $relationship = Relationship::findOrFail($request->get('relationship_id'));

        $this->authorize('update', $relationship);

        $actionItem->action = $request->get('action');
        $actionItem->complete = $request->get('complete') ?? false;
        $actionItem->user_id = Auth::id();
        $actionItem->relationship_id = $request->get('relationship_id');

        try {
            $actionItem->save();

            return response()->json([
                'message' => 'Successfully saved Action Item.',
                'data' => $relationship->actionItems,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
