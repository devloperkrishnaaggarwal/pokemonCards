document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('pokemonSearch');
    const searchButton = document.getElementById('searchButton');
    const cardContainer = document.querySelector('.card-container');

    // Function to capitalize first letter
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    // Function to fetch Pokémon data
    async function fetchPokemonData(pokemonName) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
            if (!response.ok) throw new Error('Pokémon not found!');
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    // Function to create Pokémon card
    function createPokemonCard(data) {
        const mainType = data.types[0].type.name;
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.style.background = `linear-gradient(145deg, var(--type-${mainType}) 0%, white 80%)`;

        card.innerHTML = `
            <div class="card-header">
                <h2 class="pokemon-name">${capitalize(data.name)}</h2>
                <span class="pokemon-hp">HP ${data.stats.find(stat => stat.stat.name === 'hp').base_stat}</span>
            </div>
            <img src="${data.sprites.other['official-artwork'].front_default}" alt="${data.name}" class="pokemon-image">
            <div class="pokemon-types">
                ${data.types.map(type => `
                    <span class="pokemon-type type-${type.type.name}">${type.type.name}</span>
                `).join('')}
            </div>
            <div class="pokemon-stats">
                <div class="stat">
                    <strong>Attack:</strong> ${data.stats.find(stat => stat.stat.name === 'attack').base_stat}
                </div>
                <div class="stat">
                    <strong>Defense:</strong> ${data.stats.find(stat => stat.stat.name === 'defense').base_stat}
                </div>
                <div class="stat">
                    <strong>Speed:</strong> ${data.stats.find(stat => stat.stat.name === 'speed').base_stat}
                </div>
            </div>
            <div class="pokemon-moves">
                <h3>Moves:</h3>
                ${data.moves.slice(0, 4).map(move => `
                    <div class="move">
                        <span>${capitalize(move.move.name.replace('-', ' '))}</span>
                    </div>
                `).join('')}
            </div>
        `;

        // Add CSS variables for type colors
        document.documentElement.style.setProperty(`--type-${mainType}`, getTypeColor(mainType));

        return card;
    }

    // Function to get type color
    function getTypeColor(type) {
        const typeColors = {
            normal: '#A8A878',
            fire: '#F08030',
            water: '#6890F0',
            electric: '#F8D030',
            grass: '#78C850',
            ice: '#98D8D8',
            fighting: '#C03028',
            poison: '#A040A0',
            ground: '#E0C068',
            flying: '#A890F0',
            psychic: '#F85888',
            bug: '#A8B820',
            rock: '#B8A038',
            ghost: '#705898',
            dragon: '#7038F8',
            dark: '#705848',
            steel: '#B8B8D0',
            fairy: '#EE99AC'
        };
        return typeColors[type] || '#777';
    }

    // Function to handle search
    async function handleSearch() {
        const pokemonName = searchInput.value.trim();
        if (!pokemonName) return;

        try {
            cardContainer.innerHTML = '<div class="loading">Loading...</div>';
            const data = await fetchPokemonData(pokemonName);
            cardContainer.innerHTML = '';
            const card = createPokemonCard(data);
            cardContainer.appendChild(card);
        } catch (error) {
            cardContainer.innerHTML = `<div class="error">Pokémon not found! Please try again.</div>`;
        }
    }

    // Event listeners
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
});
