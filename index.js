const userTab = document.querySelector('[data-userWeather]');
const SearchTab = document.querySelector('[data-searchWeather]');

const searchForm = document.querySelector('[data-searchForm]');
const grantAccessContainer= document.querySelector('.grant-location-container');
const userInputConatiner = document.querySelector('.data-searchWeather');


const loadingScreen = document.querySelector('.loading-container');
const grantAccessButton = document.querySelector('[data-grantAccess]');
const searchInput = document.querySelector('[data-searchInput]');

let currentTab = userTab;
const API_key = 'c1ee2d26e0dfea8a6e7a49b0a1fc8001';
currentTab.classList.add('currentTab');
getFromSessionStorage();

function switchTab(clickTab) {

    // if we click on different tab
    if(clickTab != currentTab) {

        currentTab.classList.remove("currentTab");
        currentTab = clickTab;
        currentTab.classList.add("currentTab");

        if(!searchForm.classList.contains("active")) {

            userInputConatiner.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            // I was on search tab and now  your weather should be visible
            searchForm.classList.remove("active")
            userInputConatiner.classList.remove("active");
            // now on your weather tab ...now we have to display your weather...so let's check local co-ordinates
            getFromSessionStorage();
        }
    }

}

// for switching tab
userTab.addEventListener("click", () => {
    // pass clicked tab as input 
    switchTab(userTab);
})

SearchTab.addEventListener("click", () => {
    // pass clicked tab as input
    switchTab(SearchTab);
})

// check if ordinates are present in session storage
function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinate");
    if(!localCoordinates) {
        grantAccessContainer.classList.add("active");
    }
    else {
       const coordinates = JSON.parse(localCoordinates); 
       fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat,lon} = coordinates; 
    // task 1: make grantAccessConatiner invisible
    grantAccessContainer.classList.remove("active");
    // task 2: make loading container visible
    loadingScreen.classList.add("active");

    // task 3: API call
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        // convert to JSON
        const data = await response.json();
        if(!data.sys) {
            throw data;
        }

        loadingScreen.classList.remove("active");
        userInputConatiner.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        

    }

}

function renderWeatherInfo(weatherData) {
    //firstly we have to fetch the elements
    const cityName = document.querySelector('[data-city-name]');
    const countryIcon = document.querySelector('[data-country-icon]');
    const desc = document.querySelector('[data-weatherDescription]');
    const weatherIcon = document.querySelector('[data-weatherIcon]');
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-clouds]");
    // console.log("inside renderWeather");
    // fetch values from weatherInfo object and show it to UI
    // optional chaning operator
    cityName.innerText = `${weatherData?.name}`;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherData?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherData?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherData?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherData?.main?.temp} °C`;
    windSpeed.innerText = `${weatherData?.wind?.speed} m/s`;
    humidity.innerText = `${weatherData?.main?.humidity}%`;
    cloudiness.innerText = `${weatherData?.clouds?.all}%`;
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //HW-show an alert for no geolocation

    }
}

function showPosition(position) {
    const userCoordinates = {
    lat:position.coords.latitude,
    lon:position.coords.longitude
    };
    // Save the coordinates
    sessionStorage.setItem("user-coordinate",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

grantAccessButton.addEventListener("click", getLocation);

searchForm.addEventListener("submit",(e) =>{
    e.preventDefault();
    // console.log("Inside searchInput");

    let city = searchInput.value;
    if(city.value === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(city);
        // searchInput.value = " ";
    }

} )


async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInputConatiner.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
        // console.log("In fetchMethod");

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInputConatiner.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        // loadingScreen.classList.remove("active");

    }
}