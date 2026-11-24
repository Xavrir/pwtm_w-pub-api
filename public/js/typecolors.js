// Warna setiap tipe Pokémon
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

// Mengambil warna tipe
function getTypeColor(typeName) {
    return typeColors[typeName] || '#6C757D';
}

// Mengambil warna teks tipe
function getTypeTextColor(typeName) {
    return typeTextColors[typeName] || '#FFFFFF';
}

// Mengambil warna Pokémon berdasarkan tipe
function getPokemonTypeColor(types) {
    const colors = types.map(item => {
        const typeName = typeof item === 'string'
            ? item
            : item.type.name;

        return getTypeColor(typeName);
    });

    if (colors.length >= 2) {
        return `linear-gradient(to right, ${colors[0]}, ${colors[1]})`;
    }

    return colors[0] || '#6C757D';
}

// Mengambil warna teks Pokémon berdasarkan tipe utama
function getPokemonTextColor(types) {
    const primaryType = typeof types[0] === 'string'
        ? types[0]
        : types[0]?.type.name;

    return getTypeTextColor(primaryType);
}