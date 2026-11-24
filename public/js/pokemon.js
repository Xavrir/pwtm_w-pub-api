
const API_URL = 'https://pokeapi.co/api/v2/pokemon';
const TYPE_API_URL = 'https://pokeapi.co/api/v2/type';

const pokemonPage = document.getElementById('pokemonPage');
const typeId = pokemonPage.dataset.typeId;

const PAGE_SIZE = 12;

let allPokemon = [];
let currentPage = 1;
let currentSort = 'id-asc';
let searchKeyword = '';
let renderToken = 0;
let activeRequestController = null;

// Elemen HTML
const pokemonList = document.getElementById('pokemonList');
const pokemonLoading = document.getElementById('pokemonLoading');
const pokemonError = document.getElementById('pokemonError');
const pokemonEmpty = document.getElementById('pokemonEmpty');
const pokemonCount = document.getElementById('pokemonCount');

const searchInput = document.getElementById('searchPokemon');
const sortSelect = document.getElementById('sortPokemon');

// Mengambil data dari API
async function fetchData(url, signal = null) {
    const response = await fetch(url, {
        signal: signal
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil data dari API');
    }

    return await response.json();
}


// Mengambil seluruh daftar Pokémon
async function loadPokemon() {
    pokemonLoading.classList.remove('d-none');
    pokemonError.classList.add('d-none');
    pokemonList.innerHTML = '';

    try {
        if (typeId) {
            // Mengambil Pokémon berdasarkan tipe
            const data = await fetchData(`${TYPE_API_URL}/${typeId}`);

            allPokemon = data.pokemon.map(item => {
                const pokemon = item.pokemon;

                const id = Number(
                    pokemon.url.match(/\/pokemon\/(\d+)\/?$/)[1]
                );

                return {
                    id: id,
                    name: pokemon.name,
                    url: pokemon.url
                };
            });

            // Mengubah judul dan subtitle
            const typeName = data.name
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            document.getElementById('pokemonTitle').textContent =
                `Pokémon Tipe ${typeName}`;

            document.getElementById('pokemonSubtitle').textContent =
                `Temukan Pokémon dengan tipe ${typeName}`;

        } else {
            // Mengambil jumlah total Pokémon
            const meta = await fetchData(`${API_URL}?limit=1`);

            // Mengambil seluruh daftar Pokémon
            const data = await fetchData(
                `${API_URL}?limit=${meta.count}&offset=0`
            );

            allPokemon = data.results.map(pokemon => {
                const id = Number(
                    pokemon.url.match(/\/pokemon\/(\d+)\/?$/)[1]
                );

                return {
                    id: id,
                    name: pokemon.name,
                    url: pokemon.url
                };
            });
        }

        currentPage = 1;

        renderPokemon();

    } catch (error) {
        console.error(error);
        pokemonError.classList.remove('d-none');
        pokemonCount.textContent = 'Data gagal dimuat.';
    } finally {
        pokemonLoading.classList.add('d-none');
    }
}


// Searching dan Sorting
function getFilteredPokemon() {
    let result = allPokemon.filter(pokemon => {
        return (
            pokemon.name.includes(searchKeyword) ||
            String(pokemon.id).includes(searchKeyword)
        );
    });

    switch (currentSort) {
        case 'id-desc':
            result.sort((a, b) => b.id - a.id);
            break;

        case 'name-asc':
            result.sort((a, b) => a.name.localeCompare(b.name));
            break;

        case 'name-desc':
            result.sort((a, b) => b.name.localeCompare(a.name));
            break;

        default:
            result.sort((a, b) => a.id - b.id);
    }

    return result;
}


// Menampilkan Pokémon
async function renderPokemon() {
    // Membatalkan request dari proses render sebelumnya
    if (activeRequestController) {
        activeRequestController.abort();
    }

    // Membuat pengendali request baru
    const controller = new AbortController();
    activeRequestController = controller;

    const token = ++renderToken;

    const filteredPokemon = getFilteredPokemon();

    const totalData = filteredPokemon.length;
    const totalPages = Math.ceil(totalData / PAGE_SIZE);

    // Menyesuaikan halaman jika hasil pencarian berkurang
    if (totalPages > 0 && currentPage > totalPages) {
        currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * PAGE_SIZE;

    const currentPokemon = filteredPokemon.slice(
        startIndex,
        startIndex + PAGE_SIZE
    );

    pokemonList.innerHTML = '';
    pokemonEmpty.classList.toggle('d-none', totalData !== 0);

    pokemonCount.textContent =
        `Menampilkan ${totalData} Pokémon`;

    renderPagination(currentPage, totalPages);

    if (totalData === 0) {
        return;
    }

    pokemonLoading.classList.remove('d-none');

    const details = await Promise.all(
        currentPokemon.map(async pokemon => {
            try {
                return await fetchData(
                    pokemon.url,
                    controller.signal
                );

            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log(
                        `[Pokédex] Request dibatalkan: ${pokemon.name}`
                    );

                    return null;
                }

                console.error(
                    `[Pokédex] Gagal mengambil data: ${pokemon.name}`,
                    error
                );

                return null;
            }
        })
    );

    // Menampilkan seluruh data yang berhasil diambil sekaligus
    const successfulDetails = details.filter(detail => detail !== null);

    console.log('[Pokédex] Seluruh data berhasil diambil:', successfulDetails);

    // Mencegah hasil render lama menimpa hasil terbaru
    if (token !== renderToken) return;

    details.forEach((detail, index) => {
        const pokemon = currentPokemon[index];

        const image = detail?.sprites?.other?.['official-artwork']
            ?.front_default ||
            detail?.sprites?.front_default ||
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

        const types = detail?.types?.map(item => item.type.name) || [];

        const typeBadges = types.length > 0
            ? types.map(type => `
                <span class="badge bg-secondary me-1">
                    ${escapeHTML(type)}
                </span>
            `).join('')
            : '<span class="text-muted small">Tipe tidak tersedia</span>';

        pokemonList.innerHTML += `
            <div class="col-6 col-md-4 col-lg-3">
                <a href="/pokemon/${pokemon.id}" class="text-decoration-none text-dark">
                    <div class="card h-100 shadow-sm border-0">
                        <div class="bg-light text-center p-3">
                            <img
                                src="${image}"
                                alt="${escapeHTML(pokemon.name)}"
                                class="img-fluid"
                                style="height: 150px; object-fit: contain;"
                                loading="lazy"
                            >
                        </div>

                        <div class="card-body text-center">
                            <small class="text-muted">
                                #${String(pokemon.id).padStart(4, '0')}
                            </small>

                            <h5 class="card-title fw-bold text-capitalize mt-1">
                                ${escapeHTML(pokemon.name)}
                            </h5>

                            <div class="mt-2">
                                ${typeBadges}
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
    });

    pokemonLoading.classList.add('d-none');
    renderPagination(currentPage, totalPages);
}

// Inisialisasi pagination
setupPagination({
    getCurrentPage: () => currentPage,

    getTotalPages: () => {
        return Math.ceil(
            getFilteredPokemon().length / PAGE_SIZE
        );
    },

    onPageChange: (page) => {
        currentPage = page;
        renderPokemon();

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});


// Mencegah karakter HTML dari data API dimasukkan langsung
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[char]);
}


// Event Search
let searchTimeout;

searchInput.addEventListener('input', function () {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        searchKeyword = this.value.trim().toLowerCase();
        currentPage = 1;
        renderPokemon();
    }, 250);
});


// Event Sorting
sortSelect.addEventListener('change', function () {
    currentSort = this.value;
    currentPage = 1;
    renderPokemon();
});

// Event Retry
document.getElementById('retryPokemon')
    .addEventListener('click', loadPokemon);


// Jalankan aplikasi
loadPokemon();