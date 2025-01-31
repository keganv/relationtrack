<?php

use App\Http\Controllers\ActionItemController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RelationshipController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// https://laravel.com/docs/11.x/sanctum#protecting-routes
Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    // ACTION ITEM ROUTES
    Route::post('/action-items', [ActionItemController::class, 'store']);
    Route::post('/action-items/{actionItem}', [ActionItemController::class, 'update']);
    Route::delete('/action-items/{actionItem}', [ActionItemController::class, 'delete']);
    Route::get('/action-items/{relationship}', [ActionItemController::class, 'getByRelationship']);

    // ADMIN ROUTES
    Route::get('/user', fn (Request $request) => Auth::user()->load('profileImage'));
    Route::post('/update-profile-image', [AdminController::class, 'updateProfileImage']);
    Route::get('/uploads/users/{user}/{path}', [AdminController::class, 'getPrivateFile'])->where('path', '.*');

    // RELATIONSHIP ROUTES
    Route::get('/relationships', [RelationshipController::class, 'index']);
    Route::get('/relationships/types', [RelationshipController::class, 'getTypes']);
    Route::post('/relationships', [RelationshipController::class, 'store']);
    Route::post('/relationships/{relationship}', [RelationshipController::class, 'update']);
    Route::post('/relationships/{id}/primary-image', [RelationshipController::class, 'updatePrimaryImage']);
    Route::delete('/relationships/{relationship}', [RelationshipController::class, 'delete']);
});
