<?php

namespace App\Http\Controllers;

use App\Http\Requests\ActionItemRequest;
use App\Models\ActionItem;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ActionItemController extends Controller
{
    public function store(ActionItemRequest $request)
    {
        $data = $request->validated();

        return $this->save(new ActionItem(), $data);
    }

    public function update(ActionItemRequest $request, ActionItem $actionItem)
    {
        $data = $request->validated();

        return $this->save($actionItem, $data);
    }

    public function destroy(ActionItem $actionItem)
    {
        $relationship = $actionItem->relationship;
        $this->authorize('delete', $relationship);
        $actionItem->delete();

        return response()->noContent();
    }

    private function save(ActionItem $actionItem, array $validData)
    {
        $actionItem->fill([
            'action' => $validData['action'],
            'complete' => $validData['complete'] ?? false,
            'user_id' => Auth::id(),
            'relationship_id' => $validData['relationship_id'],
        ])->save();

        return response()->json([
            'message' => 'Successfully saved Action Item.',
            'data' => ActionItem::where('relationship_id', $validData['relationship_id'])->get(),
        ], 201);
    }
}
