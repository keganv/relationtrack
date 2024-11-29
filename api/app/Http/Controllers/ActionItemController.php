<?php

namespace App\Http\Controllers;

use App\Models\ActionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ActionItemController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'action' => 'required|min:10|max:100',
            'complete' => 'boolean',
            'relationship_id' => ['required', 'string']
        ], [
            'action.min' => 'The action item must be at least 10 characters.',
            'action.max' => 'Action items must be less than 100 characters.',
            'relationship_id' => 'There was no relationship provided for the action item.'
        ]);

        $actionItem = new ActionItem();

        return $this->save($actionItem, $request);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|min:0|max:100',
            'complete' => 'boolean',
            'relationship_id' => ['required', 'string']
        ], [
            'action.min' => 'Action must be at least 20 characters.',
            'action.max' => 'Please shorten the action to less than 100 characters.',
            'relationship_id' => 'There was no relationship provided for the action item.'
        ]);

        $actionItem = ActionItem::findOrFail($id);

        return $this->save($actionItem, $request);
    }

    public function delete($id)
    {
        $actionItem = ActionItem::findOrFail($id);

        try {
            $actionItem->delete();

            return response([], 302);
        } catch (\Exception $e) {
            return response(['Could not delete the Action Item.'], 404);
        }
    }

    private function save(ActionItem $actionItem, Request $request)
    {
        $actionItem->action = $request->get('action');
        $actionItem->complete = $request->get('complete');
        $actionItem->user_id = Auth::id();
        // TODO: make migration so that relationship_id cannot be null
        $actionItem->relationship_id = $request->get('relationship_id');

//
//        $actionItem->action = $request->get('action');
//        $actionItem->complete = false;

        try {
            $actionItem->save();

            return response()->json(['message' => 'Successfully saved Action Item.'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
