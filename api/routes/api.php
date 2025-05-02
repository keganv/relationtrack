<?php

use App\Http\Controllers\ActionItemController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\PrivateFileController;
use App\Http\Controllers\RelationshipActionItemController;
use App\Http\Controllers\RelationshipController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// https://laravel.com/docs/master/sanctum#protecting-routes
Route::middleware(['auth:sanctum', 'verified', 'throttle:api'])->group(function () {
    // ACTION ITEM ROUTES
    Route::apiResource('action-items', ActionItemController::class)->except(['index', 'show']);
    Route::get('/relationships/{relationship}/action-items', RelationshipActionItemController::class);

    // USER ROUTES
    Route::apiResource('users', UserController::class)->except(['store']);

    // ADMIN ROUTES
    Route::post('/update-profile-image', [AdminController::class, 'updateProfileImage']);

    // RELATIONSHIP ROUTES
    Route::get('/relationships', [RelationshipController::class, 'index']);
    Route::get('/relationships/types', [RelationshipController::class, 'getTypes']);
    Route::post('/relationships', [RelationshipController::class, 'store']);
    Route::put('/relationships/{relationship}', [RelationshipController::class, 'update']);
    Route::patch('/relationships/{relationship}/primary-image', [RelationshipController::class, 'updatePrimaryImage']);
    Route::delete('/relationships/{relationship}', [RelationshipController::class, 'delete']);

    // FILE ROUTES
    Route::delete('/files/{file}', [FileController::class, 'destroy'])->whereNumber('file');
    Route::get('/files/users/{user}/{path}', PrivateFileController::class)->whereUuid('user')->where('path', '.*');
});
