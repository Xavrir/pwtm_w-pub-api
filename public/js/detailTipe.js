const TYPE_DETAIL_API_URL = 'https://pokeapi.co/api/v2/type';

const typeDetail = document.getElementById('typeDetail');
const loadingElement = document.getElementById('typeLoading');
const errorElement = document.getElementById('typeError');
const contentElement = document.getElementById('typeContent');

const typeId = Number(typeDetail.dataset.typeId);

async function fetchData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Gagal mengambil data dari PokéAPI.');
    }

    return await response.json();
}

function formatName(name) {
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

async function loadTypeDetail() {
    loadingElement.classList.remove('d-none');
    errorElement.classList.add('d-none');
    contentElement.classList.add('d-none');

    try {
        const data = await fetchData(`${TYPE_DETAIL_API_URL}/${typeId}`);

        const typeName = formatName(data.name);

        document.getElementById('typeTitle').textContent =
            `Pokémon Tipe ${typeName}`;

        document.getElementById('typeSubtitle').textContent =
            `Temukan Pokémon dengan tipe ${typeName}`;

        contentElement.classList.remove('d-none');

        console.log('[Osol Pokédex] Data Detail Tipe:', data);

    } catch (error) {
        console.error('Gagal memuat detail tipe:', error);
        errorElement.classList.remove('d-none');

    } finally {
        loadingElement.classList.add('d-none');
    }
}

loadTypeDetail();