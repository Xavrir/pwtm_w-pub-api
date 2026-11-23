<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MainController extends Controller
{
    function beranda(){
        return view('pages.beranda');
    }

    function pokemon(){
        return view('pages.pokemon');
    }

    function detailPokemon($id){
        return view('pages.detailPokemon', [
            'id' => $id
        ]);
    }
}
