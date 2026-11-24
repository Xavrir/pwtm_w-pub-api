
@extends('layouts.app')

@section('content')
<div class="container py-5">
    <div class="mb-4">
        <h2 class="fw-bold">Generasi Pokémon</h2>
        <p class="text-muted">
            Jelajahi Pokémon berdasarkan generasinya.
        </p>
    </div>

    <div class="row g-3 mb-4">
        <div class="col-md-7">
            <input
                type="text"
                id="searchGeneration"
                class="form-control"
                placeholder="Cari nama wilayah generasi Pokémon..."
            >
        </div>

        <div class="col-md-5">
            <select id="sortGeneration" class="form-select">
                <option value="default">Urutan Default</option>
                <option value="name-asc">Generasi: Ascending</option>
                <option value="name-desc">Generasi: Descending</option>
            </select>
        </div>
    </div>

    <div id="generationEmpty" class="text-center text-muted py-5 d-none">
        Generasi tidak ditemukan.
    </div>

    <div id="generationList" class="row g-3"></div>

    <div id="generationLoading" class="text-center py-5">
        <div class="spinner-border text-danger" role="status"></div>
        <p class="text-muted mt-3">Memuat daftar generasi...</p>
    </div>

    <div id="generationError" class="alert alert-danger d-none">
        Gagal memuat daftar generasi.
        <button id="retryGeneration" class="btn btn-sm btn-danger ms-2">
            Coba Lagi
        </button>
    </div>
</div>

@push('scripts')
    <script src="{{ asset('js/generasi.js') }}" defer></script>
@endpush
@endsection