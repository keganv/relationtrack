<?php

namespace App\Http\Controllers;

use App\Models\ActionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActionItemController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'action' => 'required|min:0|max:100',
            'complete' => 'boolean',
        ], [
            'action.min' => 'Action must be at least 20 characters.',
            'action.max' => 'Please shorten the action to less than 100 characters.'
        ]);

        $actionItem = new ActionItem();

        return $this->save($actionItem, $request);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|min:0|max:100',
            'complete' => 'boolean',
        ], [
            'action.min' => 'Action must be at least 20 characters.',
            'action.max' => 'Please shorten the action to less than 100 characters.'
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
        $actionItem->user_id = Auth::id();
        $actionItem->relationship_id = $request->get('relationship');
        $actionItem->action = $request->get('action');
        $actionItem->complete = false;

        try {
            $actionItem->save();

            return response()->json(['message' => 'Successfully saved Action Item.'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
