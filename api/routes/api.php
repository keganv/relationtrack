<?php

use App\Http\Controllers\ActionItemController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RelationshipController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    // ACTION ITEM ROUTES
    Route::post('/action-items', [ActionItemController::class, 'store']);
    Route::post('/action-items/{id}', [ActionItemController::class, 'update']);
    Route::delete('/action-items/{id}', [ActionItemController::class, 'delete']);

    // ADMIN ROUTES
    Route::get('/user', fn (Request $request) => $request->user()->load('profileImage'));
    Route::post('/update-profile-image', [AdminController::class, 'updateProfileImage']);
    Route::get('/uploads/users/{userId}/profile/{file}', [AdminController::class, 'getProfileImage']);

    // RELATIONSHIP ROUTES
    Route::get('/relationships', [RelationshipController::class, 'index']);
    Route::get('/relationships/types', [RelationshipController::class, 'getTypes']);
    Route::get('/uploads/users/{userId}/relationships/{relationshipId}/{file}', [RelationshipController::class, 'getRelationshipImage']);
    Route::post('/relationships', [RelationshipController::class, 'store']);
    Route::post('/relationships/{id}', [RelationshipController::class, 'update']);
    Route::post('/relationships/{id}/primary-image', [RelationshipController::class, 'updatePrimaryImage']);
    Route::delete('/relationships/{id}', [RelationshipController::class, 'delete']);
});
