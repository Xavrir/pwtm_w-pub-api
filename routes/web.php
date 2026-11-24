<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MainController;

// Route::get('/', function () {
//     return view('welcome');
// });

// Route::get('/', function () {
//     return view('layouts.app');
// });

Route::get('/', [MainController::class, 'beranda']);

Route::get('/pokemon', [MainController::class, 'pokemon']);
Route::get('/pokemon/{id}', [MainController::class, 'detailPokemon'])->whereNumber('id');

Route::get('/tipe', [MainController::class, 'tipe']);
Route::get('/tipe/{id}', [MainController::class, 'detailTipe'])->whereNumber('id');