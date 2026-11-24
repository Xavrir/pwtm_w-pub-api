@extends('layouts.app')

@section('content')
<div class="container py-4">
    <div class="bg-danger text-white rounded p-4 p-md-5 mb-4">
        <h1 class="fw-bold mb-2">OsolPokédex</h1>
        <p class="mb-3">
            Kenali dunia Pokémon melalui berbagai informasi mengenai
            Pokémon, tipe elemen, dan generasinya.
        </p>
        <a href="/pokemon" class="btn btn-light text-danger fw-bold">
            Jelajahi Pokémon
        </a>
    </div>

    <div class="mb-4">
        <h4 class="fw-bold">Tentang OsolPokédex</h4>
        <p class="text-secondary mb-1">
            OsolPokédex merupakan website ensiklopedia Pokémon
            yang menyediakan informasi berdasarkan kategori.
            Website ini terinspirasi dari Pokédex pada permainan Pokémon, dan
            data Pokémon diperoleh dari
            <a href="https://pokeapi.co/" target="_blank" class="text-danger" style="text-decoration:none">
                PokeAPI
            </a>.
        </p>
    </div>

    <h4 class="fw-bold mb-3">Jelajahi Kategori</h4>

    <div class="row g-3">
        <div class="col-12">
            <a href="/pokemon" class="text-decoration-none">
                <div class="card border-danger h-100">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="card-title text-danger fw-bold">
                                    Daftar Pokémon
                                </h5>
                                <p class="card-text text-secondary mb-0">
                                    Temukan berbagai Pokémon dan pelajari
                                    informasi lengkap mengenai masing-masing Pokémon.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>

        <div class="col-md-6">
            <a href="/tipe" class="text-decoration-none">
                <div class="card border-danger h-100">
                    <div class="card-body p-4">
                        <h5 class="card-title text-danger fw-bold">
                            Tipe Elemen
                        </h5>
                        <p class="card-text text-secondary mb-3">
                            Kenali berbagai tipe elemen serta Pokémon
                            yang termasuk ke dalam setiap tipe.
                        </p>
                    </div>
                </div>
            </a>
        </div>

        <div class="col-md-6">
            <a href="/gen" class="text-decoration-none">
                <div class="card border-danger h-100">
                    <div class="card-body p-4">
                        <h5 class="card-title text-danger fw-bold">
                            Generasi Pokémon
                        </h5>
                        <p class="card-text text-secondary mb-3">
                            Jelajahi Pokémon berdasarkan generasi
                            dan wilayah asalnya.
                        </p>
                    </div>
                </div>
            </a>
        </div>

    </div>
</div>
@endsection
