@extends('layouts.app')

@section('content')
    <div class="container py-4">
        <div id="typeDetail" data-type-id="{{ $id }}">
            <div id="typeLoading" class="text-center py-5">
                <div class="spinner-border text-primary"></div>
                <p class="mt-2">Memuat data tipe...</p>
            </div>

            <div id="typeError" class="alert alert-danger d-none">
                Gagal memuat data tipe Pokémon.
            </div>

            <div id="typeContent" class="d-none">
                <h2 id="typeTitle" class="fw-bold"></h2>
                <p id="typeSubtitle" class="text-muted"></p>
            </div>
        </div>
    </div>

    @push('scripts')
        <script src="{{ asset('js/detailTipe.js') }}" defer></script>
    @endpush
@endsection