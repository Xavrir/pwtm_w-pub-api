
const API_URL = 'https://pokeapi.co/api/v2/pokemon';

const detailContainer = document.getElementById('pokemonDetail');
const loadingElement = document.getElementById('detailLoading');
const errorElement = document.getElementById('detailError');

const pokemonId = Number(detailContainer.dataset.pokemonId);

const previousButton = document.getElementById('previousPokemon');
const nextButton = document.getElementById('nextPokemon');


// Mengambil data API
async function fetchData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Gagal mengambil data dari PokéAPI.');
    }

    return await response.json();
}


// Mengubah nama menjadi format yang lebih rapi
function formatName(name) {
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}


// Menghindari HTML injection
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[char]);
}


// Mengambil deskripsi Pokémon
async function getSpeciesData(url) {
    try {
        const species = await fetchData(url);
        let generationData = null;

        // Mengambil genus
        const genus = species.genera.find(
            item => item.language.name === 'en'
        );

        // Mengambil deskripsi
        const description = species.flavor_text_entries.find(
            item => item.language.name === 'en'
        );

        // Mengambil informasi generasi
        let generation = 'Unknown';

        if (species.generation?.url) {
            generationData = await fetchData(
                species.generation.url
            );

            const generationName = species.generation.name
                .replace('generation-', '')
                .toUpperCase();

            const region = generationData.main_region?.name;

            generation = region
                ? `Generasi ${generationName} - ${formatName(region)}`
                : `Generasi ${generationName}`;
        }

        // Mengambil habitat
        const habitat = species.habitat
            ? formatName(species.habitat.name)
            : 'Unknown';

        return {
            genus: genus?.genus || 'Unknown Species',

            description: description?.flavor_text
                ?.replace(/[\n\f\r]+/g, ' ') ||
                'No description available.',

            generation: generation,
            habitat: habitat,

            rawData: {
                species: species,
                generation: generationData
            }
        };

    } catch (error) {
        console.error('Species error:', error);

        return {
            genus: 'Unknown Species',
            description: 'Description unavailable.',
            generation: 'Unknown',
            habitat: 'Unknown'
        };
    }
}


// Menampilkan tipe Pokémon
function renderTypes(types) {
    const container = document.getElementById('pokemonTypes');

    container.innerHTML = types.map(item => {
        const typeName = item.type.name;
        const color = getTypeColor(typeName);
        const textColor = getTypeTextColor(typeName);

        return `
            <span class="badge me-1 fs-6"
                  style="background: ${color}; color: ${textColor};">
                ${escapeHTML(formatName(typeName))}
            </span>
        `;
    }).join('');
}


// Menampilkan abilities
function renderAbilities(abilities) {
    const container = document.getElementById('pokemonAbilities');

    container.innerHTML = abilities.map(item => `
        <div class="d-flex justify-content-between align-items-center
                    border-bottom py-2">

            <span class="fw-semibold">
                ${escapeHTML(formatName(item.ability.name))}
            </span>

            <span class="badge ${item.is_hidden
                ? 'bg-warning text-dark'
                : 'bg-secondary'}">
                ${item.is_hidden ? 'Hidden Ability' : 'Normal Ability'}
            </span>

        </div>
    `).join('');
}


// Menampilkan base stats
function renderStats(stats) {
    const container = document.getElementById('pokemonStats');

    const maxStat = Math.max(
        100,
        ...stats.map(item => item.base_stat)
    );

    container.innerHTML = stats.map(item => {
        const statName = item.stat.name
            .replace('special-attack', 'Sp. Atk')
            .replace('special-defense', 'Sp. Def')
            .replace('hp', 'HP')
            .replace('attack', 'Attack')
            .replace('defense', 'Defense')
            .replace('speed', 'Speed');

        const percentage = Math.min(
            (item.base_stat / maxStat) * 100,
            100
        );

        return `
            <div class="mb-3">

                <div class="d-flex justify-content-between mb-1">
                    <span class="fw-semibold">
                        ${escapeHTML(statName)}
                    </span>

                    <span class="fw-bold">
                        ${item.base_stat}
                    </span>
                </div>

                <div class="progress" style="height: 10px;">
                    <div
                        class="progress-bar bg-danger"
                        role="progressbar"
                        style="width: ${percentage}%"
                        aria-valuenow="${item.base_stat}"
                        aria-valuemin="0"
                        aria-valuemax="${maxStat}">
                    </div>
                </div>

            </div>
        `;
    }).join('');
}


// Mengisi informasi Pokémon
async function renderPokemon(data, maxPokemonId) {

    const species = await getSpeciesData(data.species.url);

    console.log('[Osol Pokédex] Data Detail Pokémon:', {
        pokemon: data,
        species: species.rawData,
        totalPokemon: maxPokemonId
    });

    // Warna berdasarkan tipe Pokémon
    const pokemonColor = getPokemonTypeColor(data.types);
    const pokemonTextColor = getPokemonTextColor(data.types);

    const pokemonHeader = document.getElementById('pokemonImage')
        .closest('.row');

    pokemonHeader.style.background = pokemonColor;
    pokemonHeader.style.color = pokemonTextColor;
    pokemonHeader.style.borderRadius = '16px';
    pokemonHeader.style.padding = '20px';

    document.getElementById('pokemonId').style.color = pokemonTextColor;
    document.getElementById('pokemonGenus').style.color = pokemonTextColor;
    document.getElementById('pokemonDescription').style.color = pokemonTextColor;

    // Identitas
    document.getElementById('pokemonId').textContent =
        `#${String(data.id).padStart(4, '0')}`;

    document.getElementById('pokemonName').textContent =
        formatName(data.name);

    document.getElementById('pokemonImage').src =
        data.sprites.other['official-artwork'].front_default ||
        data.sprites.front_default;

    document.getElementById('pokemonImage').alt =
        formatName(data.name);

    document.getElementById('pokemonGenus').textContent =
        species.genus;

    document.getElementById('pokemonDescription').textContent =
        species.description;

    document.getElementById('pokemonGeneration').textContent =
        species.generation;

    document.getElementById('pokemonHabitat').textContent =
        species.habitat;

    document.title = `${formatName(data.name)} | Osol Pokédex`;

    // Tipe
    renderTypes(data.types);

    // Informasi fisik
    document.getElementById('pokemonHeight').textContent =
        `${data.height / 10} m`;

    document.getElementById('pokemonWeight').textContent =
        `${data.weight / 10} kg`;

    document.getElementById('pokemonExperience').textContent =
        data.base_experience ?? 'Unknown';

    // Abilities
    renderAbilities(data.abilities);

    // Stats
    renderStats(data.stats);

    // Navigasi
    previousButton.disabled = data.id <= 1;
    nextButton.disabled = data.id >= maxPokemonId;

    detailContainer.classList.remove('d-none');
}


// Memuat halaman detail
async function loadPokemonDetail() {

    loadingElement.classList.remove('d-none');
    errorElement.classList.add('d-none');
    detailContainer.classList.add('d-none');

    try {
        if (!Number.isInteger(pokemonId) || pokemonId < 1) {
            throw new Error('ID Pokémon tidak valid.');
        }

        // Ambil detail dan jumlah Pokémon
        const [data, meta] = await Promise.all([
            fetchData(`${API_URL}/${pokemonId}`),
            fetchData(`${API_URL}?limit=1`)
        ]);

        await renderPokemon(data, meta.count);

    } catch (error) {
        console.error(error);

        document.getElementById('errorMessage').textContent =
            error.message || 'Terjadi kesalahan saat memuat data.';

        errorElement.classList.remove('d-none');

    } finally {
        loadingElement.classList.add('d-none');
    }
}


// Navigasi Pokémon sebelumnya
previousButton.addEventListener('click', function () {
    if (pokemonId > 1) {
        window.location.href = `/pokemon/${pokemonId - 1}`;
    }
});


// Navigasi Pokémon berikutnya
nextButton.addEventListener('click', function () {
    window.location.href = `/pokemon/${pokemonId + 1}`;
});


// Jalankan
loadPokemonDetail();

const backButton = document.getElementById('backButton');

backButton.addEventListener('click', () => {
    const previousUrl = document.referrer;

    if (
        previousUrl &&
        new URL(previousUrl).origin === window.location.origin
    ) {
        history.back();
    } else {
        window.location.href = '/pokemon';
    }
});