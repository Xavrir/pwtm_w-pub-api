
const GENERATION_API_URL = 'https://pokeapi.co/api/v2/generation';

// Elemen HTML
const generationList = document.getElementById('generationList');
const generationLoading = document.getElementById('generationLoading');
const generationError = document.getElementById('generationError');
const retryButton = document.getElementById('retryGeneration');
const generationEmpty = document.getElementById('generationEmpty');
const searchInput = document.getElementById('searchGeneration');
const sortSelect = document.getElementById('sortGeneration');

// Data generasi Pokémon
let allGenerations = [];
let searchKeyword = '';
let currentSort = 'default';

// Mengambil data API
async function fetchData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Gagal mengambil data dari PokéAPI.');
    }

    return await response.json();
}

// Mengubah angka Romawi menjadi format kapital
function formatGeneration(name) {
    return `GENERASI-${name.split('-')[1].toUpperCase()}`;
}

function formatRegion(region) {
    return region.charAt(0).toUpperCase() + region.slice(1);
}

// Mengambil daftar generasi
async function loadGenerations() {
    generationLoading.classList.remove('d-none');
    generationError.classList.add('d-none');
    generationList.innerHTML = '';

    try {
        const data = await fetchData(`${GENERATION_API_URL}?limit=100`);

        allGenerations = await Promise.all(
            data.results.map(async generation => {
                const detail = await fetchData(generation.url);

                const id = Number(
                    generation.url.match(/\/generation\/(\d+)\/?$/)[1]
                );

                return {
                    id: id,
                    name: generation.name,
                    region: detail.main_region.name
                };
            })
        );

        renderGenerations();

    } catch (error) {
        console.error('Gagal memuat generasi:', error);
        generationError.classList.remove('d-none');

    } finally {
        generationLoading.classList.add('d-none');
    }
}

// Filter dan sorting generasi
function getFilteredGenerations() {
    let result = allGenerations.filter(generation => {
        return generation.region
            .toLowerCase()
            .includes(searchKeyword);
    });

    switch (currentSort) {
        case 'name-asc':
            result.sort((a, b) => a.id - b.id);
            break;

        case 'name-desc':
            result.sort((a, b) => b.id - a.id);
            break;

        default:
            result.sort((a, b) => a.id - b.id);
    }

    return result;
}

// Menampilkan daftar generasi
function renderGenerations() {
    const filteredGenerations = getFilteredGenerations();

    generationList.innerHTML = '';
    generationEmpty.classList.toggle(
        'd-none',
        filteredGenerations.length > 0
    );

    filteredGenerations.forEach(generation => {
        generationList.innerHTML += `
            <div class="col-12">
                <a href="/gen/${generation.id}" class="text-decoration-none">
                    <div class="card shadow-sm"
                         style="
                            background: #ffffff;
                            border: 1px solid #000000;
                            transition: transform 0.2s;
                         "
                         onmouseover="this.style.transform='translateY(-3px)'"
                         onmouseout="this.style.transform='translateY(0)'">

                        <div class="card-body p-4">
                            <div class="d-flex align-items-center">

                                <div>
                                    <h5 class="fw-bold mb-1" style="color: #000000;">
                                        ${formatRegion(generation.region)}
                                    </h5>

                                    <span class="small opacity-75" style="color: #000000;">
                                        (${formatGeneration(generation.name)})
                                    </span>
                                </div>

                                <div class="ms-auto">
                                    <i class="bi bi-arrow-right fs-5" style="color: #dc3545;"></i>
                                </div>

                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
    });
}

// Event pencarian
searchInput.addEventListener('input', function () {
    searchKeyword = this.value.toLowerCase().trim();
    renderGenerations();
});

// Event sorting
sortSelect.addEventListener('change', function () {
    currentSort = this.value;
    renderGenerations();
});

// Event tombol coba lagi
retryButton.addEventListener('click', loadGenerations);

// Jalankan
loadGenerations();
