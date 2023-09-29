const searchInput = document.querySelector('.searchInput');
const searchBtn = document.querySelector('.searchBtn')
const temperature = document.getElementById('temp')
const humidityVal = document.getElementById('humidity')
const windSpeed = document.getElementById('windSpeed')
const city = document.getElementById('city')
const desc = document.getElementById('desc')
const tempUnit = document.getElementById('unit')
const weatherContainer = document.querySelector('.weatherContainer')
const errorContainer = document.querySelector('.errorContainer')
const unitToggle = document.getElementById('toggle-checkbox')
const errorHeading = document.getElementById('errorHeading')
const errorText = document.getElementById('errorText')

let inputText;

// Event listener on toggle button
unitToggle.addEventListener('click', () => {
    if (unitToggle.checked) {
        getWeather(inputText, 'imperial')
    }
    else {
        getWeather(inputText)
    }
})

// Fetches data from API
async function getWeather(cityName, unit = 'metric') {
    try {
        const apiKey = 'b02eb83575cca885dd61517570bc3680'
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unit}`

        const response = await fetch(apiUrl + `&appid=${apiKey}`);

        if (!response.ok) {
            weatherContainer.style.display = 'none'
            errorContainer.style.display = 'block'
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json()

        // Extract data we need to use in our app
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        const { description } = data.weather[0]
        const dataObject = {
            cityName: data.name,
            temp,
            humidity,
            speed,
            description
        }

        applyChangesInDom(dataObject, unit)
        return;
    } catch (error) {
        weatherContainer.style.display = 'none'
        errorContainer.style.display = 'block'
        console.log(error);
        return;
    }
}

// function to make dom manipulation
function applyChangesInDom(data, unit) {
    const { temp, humidity, speed, description, cityName } = data;

    // Make changes in DOM based on unit type
    if (unit === 'metric') {
        temperature.innerText = temp + '°'
        tempUnit.innerText = 'C'
        windSpeed.innerText = speed + ' m/s'
        desc.innerHTML = description
    } else {
        temperature.innerText = temp + '°'
        tempUnit.innerText = 'F'
        windSpeed.innerText = speed + ' mph'
    }

    // common in both units
    city.innerHTML = cityName
    humidityVal.innerText = humidity + '%'
    errorContainer.style.display = 'none'
    weatherContainer.style.display = 'block'
}

// Event listener on searchBtn
searchBtn.addEventListener('click', () => {
    inputText = searchInput.value

    // If input field is empty display alert 
    if (inputText.trim() === '') {
        return window.alert("Please Enter a city name!")
    }

    getWeather(inputText)

    // clear the input field
    searchInput.value = ''
})