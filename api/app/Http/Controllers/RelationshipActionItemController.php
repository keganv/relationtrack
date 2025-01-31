<?php

namespace App\Http\Controllers;

use App\Models\Relationship;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RelationshipActionItemController extends Controller
{
    public function __invoke(Request $request, Relationship $relationship)
    {
        $this->authorize('view', $relationship);

        return response()->json($relationship->actionItems ?? [], Response::HTTP_OK);
    }
}
