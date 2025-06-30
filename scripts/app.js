
// This file contains the JavaScript code for the weather application. 
// It handles fetching weather data from an API, updating the DOM with weather information, and managing user interactions.

const apiKey = 'fcfe6ea0193699ef5cd24ab11485c513'; // Replace with your actual API key
const weatherForm = document.getElementById('weather-form');
const weatherInput = document.getElementById('weather-input');
const weatherOutput = document.getElementById('weather-output');
const searchHistoryList = document.getElementById('search-history');

let searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');

weatherForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const city = weatherInput.value.trim();
    if (!city) return;
    fetchWeatherData(city);
    updateSearchHistory(city);
});

function updateSearchHistory(city) {
    // Remove if already exists (case-insensitive)
    searchHistory = searchHistory.filter(item => item.toLowerCase() !== city.toLowerCase());
    // Add to front
    searchHistory.unshift(city);
    // Keep only last 5
    if (searchHistory.length > 5) searchHistory = searchHistory.slice(0, 5);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    renderSearchHistory();
}

function renderSearchHistory() {
    searchHistoryList.innerHTML = '';
    searchHistory.forEach((city, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="history-city" style="cursor:pointer">${city}</span>
            <button class="history-delete-btn" data-idx="${idx}">Delete</button>
        `;
        searchHistoryList.appendChild(li);
    });
}

// Click on city to search again, or delete
searchHistoryList.addEventListener('click', (e) => {
    if (e.target.classList.contains('history-delete-btn')) {
        const idx = e.target.getAttribute('data-idx');
        searchHistory.splice(idx, 1);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        renderSearchHistory();
    }
    if (e.target.classList.contains('history-city')) {
        weatherInput.value = e.target.textContent;
        fetchWeatherData(e.target.textContent);
    }
});

async function fetchWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        displayWeatherData(data);
        weatherOutput.classList.add('visible');
    } catch (error) {
        weatherOutput.textContent = error.message;
        weatherOutput.classList.add('visible');
    }
}

function displayWeatherData(data) {
    const { name, main, weather } = data;
    weatherOutput.innerHTML = `
        <h2>Weather in ${name}</h2>
        <p>Temperature: ${main.temp} °C</p>
        <p>Condition: ${weather[0].description}</p>
    `;
}


// Initial render
renderSearchHistory();