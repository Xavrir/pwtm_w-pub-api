const TYPE_PAGE_API_URL = 'https://pokeapi.co/api/v2/type';

// Elemen HTML
const typeList = document.getElementById('typeList');
const typeLoading = document.getElementById('typeLoading');
const typeError = document.getElementById('typeError');
const retryButton = document.getElementById('retryType');
const typeEmpty = document.getElementById('typeEmpty');
const searchInput = document.getElementById('searchType');
const sortSelect = document.getElementById('sortType');

// Data tipe Pokémon
let allTypes = [];
let searchKeyword = '';
let currentSort = 'default';

// Warna setiap tipe
const typeColors = {
    normal: '#e0e0e0',
    fighting: '#C22E28',
    flying: '#A98FF3',
    poison: '#A33EA1',
    ground: '#E2BF65',
    rock: '#B6A136',
    bug: '#A6B91A',
    ghost: '#735797',
    steel: '#B7B7CE',
    fire: '#EE8130',
    water: '#6390F0',
    grass: '#7AC74C',
    electric: '#F7D02C',
    psychic: '#F95587',
    ice: '#96D9D6',
    dragon: '#6F35FC',
    dark: '#705746',
    fairy: '#D685AD',
    stellar: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)'
};

// Warna teks agar tetap terbaca
const typeTextColors = {
    normal: '#212529',
    ground: '#212529',
    steel: '#212529',
    electric: '#212529',
    ice: '#212529',
    fairy: '#212529'
};

// Mengambil data API
async function fetchData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Gagal mengambil data dari PokéAPI.');
    }

    return await response.json();
}

// Mengubah format nama
function formatName(name) {
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function getTypeIcon(sprites) {
    const generations = Object.keys(sprites).reverse();

    for (const generation of generations) {
        const games = sprites[generation];

        for (const game of Object.values(games)) {
            if (game.symbol_icon) {
                return game.symbol_icon;
            }
        }
    }

    for (const generation of generations) {
        const games = sprites[generation];

        for (const game of Object.values(games)) {
            if (game.name_icon) {
                return game.name_icon;
            }
        }
    }

    return null;
}

// Mengambil data tipe
async function loadTypes() {
    typeLoading.classList.remove('d-none');
    typeError.classList.add('d-none');
    typeList.innerHTML = '';

    try {
        const data = await fetchData(`${TYPE_PAGE_API_URL}?limit=100`);

        const types = data.results.filter(type => {
            return !['unknown', 'shadow'].includes(type.name);
        });

        allTypes = await Promise.all(
            types.map(async type => {
                const typeId = Number(
                    type.url.match(/\/type\/(\d+)\/?$/)[1]
                );

                try {
                    const detail = await fetchData(type.url);

                    return {
                        id: typeId,
                        name: type.name,
                        icon: getTypeIcon(detail.sprites)
                    };

                } catch (error) {
                    console.error(`Gagal mengambil ikon ${type.name}:`, error);

                    return {
                        id: typeId,
                        name: type.name,
                        icon: null
                    };
                }
            })
        );

        renderTypes();

    } catch (error) {
        console.error('Gagal memuat tipe:', error);
        typeError.classList.remove('d-none');

    } finally {
        typeLoading.classList.add('d-none');
    }
}

// Filter dan sorting tipe
function getFilteredTypes() {
    let result = allTypes.filter(type => {
        return type.name.includes(searchKeyword);
    });

    switch (currentSort) {
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

// Menampilkan daftar tipe
function renderTypes() {
    const filteredTypes = getFilteredTypes();

    typeList.innerHTML = '';
    typeEmpty.classList.toggle('d-none', filteredTypes.length > 0);

    filteredTypes.forEach(type => {
        const color = typeColors[type.name] || '#6C757D';
        const textColor = typeTextColors[type.name] || '#FFFFFF';

        typeList.innerHTML += `
            <div class="col-12">
                <a href="/tipe/${type.id}" class="text-decoration-none">
                    <div class="card border-0 shadow-sm"
                         style="
                            background: ${color};
                            transition: transform 0.2s;
                         "
                         onmouseover="this.style.transform='translateY(-3px)'"
                         onmouseout="this.style.transform='translateY(0)'">

                        <div class="card-body p-4">
                            <div class="d-flex align-items-center">

                                <div>
                                    <div class="d-flex align-items-center gap-2">
                                        <h5 class="fw-bold mb-0"
                                            style="color: ${textColor}">
                                            ${formatName(type.name)}
                                        </h5>

                                        ${
                                            type.icon
                                                ? `<img src="${type.icon}"
                                                       alt="${formatName(type.name)} icon"
                                                       style="
                                                            width: 20px;
                                                            height: 20px;
                                                            object-fit: contain;
                                                            filter: drop-shadow(0 0 1px black);
                                                       ">`
                                                : ''
                                        }
                                    </div>

                                    <span class="small"
                                          style="color: ${textColor}; opacity: 0.8">
                                        Tipe Elemen Pokémon
                                    </span>
                                </div>

                                <div class="ms-auto">
                                    <i class="bi bi-arrow-right fs-5"
                                       style="color: ${textColor}"></i>
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
    renderTypes();
});

// Event sorting
sortSelect.addEventListener('change', function () {
    currentSort = this.value;
    renderTypes();
});

// Event tombol coba lagi
retryButton.addEventListener('click', loadTypes);

// Jalankan
loadTypes();