const searchInput = document.getElementById('search');
const resultsContainer = document.getElementById('results');
const counter = document.getElementById('counter');
let allItems = [];

function initApp() {
    resultsContainer.innerHTML = '<div class="loader">Searching...</div>';
    
    fetch('./parsed_data.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            allItems = convertToArray(data.items);
            setupSearch(allItems);
            resultsContainer.innerHTML = '';
            updateCounter(allItems.length);
        })

}

function convertToArray(itemsObject) {
    return Object.entries(itemsObject).map(([name, info]) => ({
        name,
        id: info.id
    }));
}

function setupSearch(items) {
    function searchHandler(query) {
        const lowerQuery = query.toLowerCase().trim();
        if (!lowerQuery) return items;
        
        return items.filter(item => 
            item.name.toLowerCase().includes(lowerQuery)
        );
    }

    function displayResults(results) {
        resultsContainer.innerHTML = results.length > 0 
            ? results.map(item => `
                <div class="item">
                    <div class="item-name">${highlightMatches(item.name, searchInput.value)}</div>
                    <div class="item-id">ID: ${item.id}</div>
                </div>
            `).join('')
            : '<div class="item">🔍 Cannot find a thing</div>';
        
        updateCounter(results.length);
    }

    function highlightMatches(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    function updateCounter(count) {
        counter.textContent = `Found: ${count}`;
    }

    searchInput.addEventListener('input', (e) => {
        const results = searchHandler(e.target.value);
        displayResults(results);
    });

    displayResults(items);
}

function handleError(error) {
    console.error('Error:', error);
    resultsContainer.innerHTML = '<div class="error">⚠️ Error</div>';
}

document.addEventListener('DOMContentLoaded', initApp);