@extends('layouts.app')

@section('content')
<div class="container py-5">
    <div class="mb-4">
        <h2 class="fw-bold">Tipe Pokémon</h2>
        <p class="text-muted">
            Jelajahi Pokémon berdasarkan tipenya.
        </p>
    </div>

    <div class="row g-3 mb-4">
        <div class="col-md-7">
            <input
                type="text"
                id="searchType"
                class="form-control"
                placeholder="Cari tipe elemen..."
            >
        </div>

        <div class="col-md-5">
            <select id="sortType" class="form-select">
                <option value="default">Urutan Default</option>
                <option value="name-asc">Nama: A-Z</option>
                <option value="name-desc">Nama: Z-A</option>
            </select>
        </div>
    </div>

    <div id="typeEmpty" class="text-center text-muted py-5 d-none">
        Tipe elemen tidak ditemukan.
    </div>

    <div id="typeList" class="row g-3"></div>

    <div id="typeLoading" class="text-center py-5">
        <div class="spinner-border text-danger" role="status"></div>
        <p class="text-muted mt-3">Memuat daftar tipe...</p>
    </div>

    <div id="typeError" class="alert alert-danger d-none">
        Gagal memuat daftar tipe.
        <button id="retryType" class="btn btn-sm btn-danger ms-2">
            Coba Lagi
        </button>
    </div>

    <div id="typeList" class="row g-3"></div>
</div>

@push('scripts')
    <script src="{{ asset('js/tipe.js') }}" defer></script>
@endpush
@endsection