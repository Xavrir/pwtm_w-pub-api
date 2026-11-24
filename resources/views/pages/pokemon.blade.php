@extends('layouts.app')

@section('content')
<div class="container py-4">
    <div class="mb-4">
        <h2 class="fw-bold">Pokémon</h2>
        <p class="text-muted">
            Temukan berbagai Pokémon dari seluruh generasi.
        </p>
    </div>

    <div class="row g-3 mb-4">
        <div class="col-md-8">
            <input type="text" id="searchPokemon" class="form-control" placeholder="Cari nama atau ID Pokémon...">
        </div>

        <div class="col-md-4">
            <select id="sortPokemon" class="form-select">
                <option value="id-asc">ID: Terendah ke Tertinggi</option>
                <option value="id-desc">ID: Tertinggi ke Terendah</option>
                <option value="name-asc">Nama: A - Z</option>
                <option value="name-desc">Nama: Z - A</option>
            </select>
        </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-3">
        <small class="text-muted" id="pokemonCount">
            Memuat data Pokémon...
        </small>
    </div>

    <div id="pokemonLoading" class="text-center py-5">
        <div class="spinner-border text-danger" role="status"></div>
        <p class="mt-2 text-muted">Memuat Pokémon...</p>
    </div>

    <div id="pokemonError" class="alert alert-danger d-none">
        Gagal mengambil data Pokémon.
        <button id="retryPokemon" class="btn btn-sm btn-outline-danger ms-2">
            Coba Lagi
        </button>
    </div>

    <div id="pokemonList" class="row g-3"></div>

    <div id="pokemonEmpty" class="text-center py-5 d-none">
        <h5>Pokémon tidak ditemukan</h5>
        <p class="text-muted">
            Coba gunakan kata kunci pencarian lain.
        </p>
    </div>

    <div class="d-flex justify-content-center align-items-center gap-3 mt-4">
        <button id="prevPage" class="btn btn-outline-danger" disabled>
            Sebelumnya
        </button>

        <div class="d-flex align-items-center gap-2">
            <input
                type="number"
                id="pageInput"
                class="form-control text-center"
                style="width: 70px;"
                value="1"
                min="1"
                disabled
            >

            <span id="totalPages" class="fw-semibold">
                / 1
            </span>
        </div>

        <button id="nextPage" class="btn btn-outline-danger" disabled>
            Selanjutnya
        </button>
    </div>

</div>

@push('scripts')
    <script src="{{ asset('js/pagination.js') }}" defer></script>
    <script src="{{ asset('js/pokemon.js') }}" defer></script>
@endpush

@endsection
