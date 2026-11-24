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
        return view('pages.detailPokemon', compact('id'));
    }

    public function tipe(){
        return view('pages.tipe');
    }

    public function detailTipe($id){
        return view('pages.pokemon', ['typeId' => $id]);
    }

    public function generasi(){
        return view('pages.generasi');
    }

    public function detailGenerasi($id){
        return view('pages.pokemon', ['generationId' => $id]);
    }
}
