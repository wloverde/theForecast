// personal APIkey for OpenWeather API
const apiKey = 'bd74e2e4368a74508f47fbac228e14b3';
// Query Selector -- buttons for each search option
const cityButton = $("#cityButton");
const zipButton = $('#zipButton');
const recentsButton = $("#recent");
const resultsEL = document.getElementById("searchResults");
const pastSearchEL = document.getElementById("pastSearch");


// get Latitude anf Longitude based off 3 potential User Inputs
function getLatLon(city, state, isoCode) {
    let queryParam = [city, state, isoCode];
    // remove blank parameters
    queryParam = queryParam.filter(blank => blank.length > 0);
    // concat into a string with a comma following each index
    queryParam = queryParam.join();

    let fetchURL = `https://api.openweathermap.org/geo/1.0/direct?q=${queryParam}&limit=5&appid=${apiKey}`;
    resultsEL.innerHTML = '';
    fetch(fetchURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            data.forEach(result => {
                // console.log(`name: ${result.name}, ${result.state} ${result.country}
                // lat: ${result.lat}
                // lon: ${result.lon}`);
                // Create Result buttons with values of the Lat and Lon in search modal
                let resultValue = `${result.lat},${result.lon}`;
                let resultButton = document.createElement("button");
                resultButton.setAttribute("value", resultValue);
                resultButton.setAttribute("class", "modal-close waves-effect waves-light btn-large light-blue darken-1");
                resultButton.setAttribute("style", "margin:5px");
                // if the selected city does not have a state associated with it, return just city and country values to button
                if (result.state === undefined) {
                    resultButton.textContent = `${result.name}, ${result.country}`;
                } else {
                    resultButton.textContent = `${result.name}, ${result.state} ${result.country}`;
                }
                searchResults.appendChild(resultButton);
            });
            // fiveDayFetch(data[0].lat,data[0].lon);
        });
};

// city search result button activator
function resultClick(event) {
    let buttonEl = event.target;
    let latLon = buttonEl.value.split(",");
    // console.log(buttonEl, latLon);
    fiveDayFetch(latLon[0], latLon[1]);
}

// if user searched by Zip Code / 
function zipLatLon(zipCode, isoCode) {
    let queryParam = [zipCode, isoCode];
    // remove blank parameters
    queryParam = queryParam.filter(blank => blank.length > 0);
    // concat into a string with a comma following each index
    queryParam = queryParam.join();
    let fetchURL = `https://api.openweathermap.org/geo/1.0/zip?zip=${queryParam}&appid=${apiKey}`;

    fetch(fetchURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            fiveDayFetch(data.lat, data.lon);
        });

}

function fiveDayFetch(lat, lon) {
    let fetchURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    fetch(fetchURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);  //this data is primary use obj
            // adds search results to local storage
            localResults(data.city.coord.lat, data.city.coord.lon, data.city.name);
            populateCard(data);
        });
};

// Popluate card info after data is fetched
function populateCard(dataObj) {
    // deconstruct dataObj to return weather details
    let weatherCards = ``;
    let weatherList = dataObj.list;
    for (let index = 0; index < weatherList.length; index++) {
        let headerEL = weatherList[index].dt_txt.split(' ');

        if (index === 0) {
            weatherCards += `<div id='day' class="card col s3 center">
                <div class="card-content blue white-text">
                <h3>${headerEL[0]}</h3>
                <h4 class="darker-blue lighten-2">${headerEL[1]}</h4>
                <p>Temp high: ${weatherList[index].main.temp_max}</p>
                <p>Real Feel: ${weatherList[index].main.feels_like}</p>
                <p>Temp Low: ${weatherList[index].main.temp_min}</p>
                <h5>Weather Details</h5>
                <p>${weatherList[index].weather[0].description}</p>
                </div>
            </div>`
        } else if ((index % 8) === 0)  {
            weatherCards += `<div id='day' class="card col s3 center">
                <div class="card-content blue white-text">
                <h3>${headerEL[0]}</h3>
                <h4 class="darker-blue lighten-2">${headerEL[1]}</h4>
                <p>Temp high: ${weatherList[index].main.temp_max}</p>
                <p>Real Feel: ${weatherList[index].main.feels_like}</p>
                <p>Temp Low: ${weatherList[index].main.temp_min}</p>
                <h5>Weather Details</h5>
                <p>${weatherList[index].weather[0].description}</p>
                </div>
            </div>`
            
        } else  {
            weatherCards += `<div id='day' class="card col s3 center">
            <div class="card-content blue white-text">
            <h4 class="darker-blue lighten-2">${headerEL[1]}</h4>
                <p>Temp high: ${weatherList[index].main.temp_max}</p>
                <p>Real Feel: ${weatherList[index].main.feels_like}</p>
                <p>Temp Low: ${weatherList[index].main.temp_min}</p>
                <h5>Weather Details</h5>
                <p>${weatherList[index].weather[0].description}</p>
                </div>
            </div>`
        }
    }
        // populate forecastCard with data
        let cardContent = `
                <div class="card-content white-text">
                    <h1>${dataObj.city.name}</h1>
                    <p>we can put some general weather information here!!</p>
                </div>
                <div class='row'>
                    ${weatherCards}
                </div>
                `
        $('#weather').append(cardContent);

   
}
// function that adds selected search into local storage
function localResults(lat, lon, name) {
    let previousSearchs = (JSON.parse(localStorage.getItem("results")));
    // init local storage as an Array of results
    if (previousSearchs === null) {
        previousSearchs = [];
    }
    // creates a new object with search parameters for fiveDayFetch() to append to Local Storage
    let newResults = {
        name: name,
        lat: lat,
        lon: lon
    }
    // push new object to 
    previousSearchs.unshift(newResults);
    // console.log(previousSearchs);
    localStorage.setItem('results', JSON.stringify(previousSearchs));
}
// returns local storage search results to nav dropdown
function recentSearch() {
    let previousSearchs = (JSON.parse(localStorage.getItem("results")));
    // console.log(previousSearchs);
    if (previousSearchs === null) {
        let pastResult = `<a href='#!' class="collection-item">No Previous Searches</a>`
        $('#pastSearch').append(pastResult);
    } else {
        for (let i = 0; i < previousSearchs.length; i++) {
            let pastResult = `<button id="searchResults" class="waves-effect waves-dark-blue btn-flat" value="${previousSearchs[i].lat},${previousSearchs[i].lon}" >${previousSearchs[i].name}</button>`
            $('#pastSearch').append(pastResult);
        }
    }
}




// Event Listener that returns the 3 values for getLatLon
cityButton.click(function (event) {
    event.preventDefault();
    let city = $("#cityInput").val();
    let state = $("#state").val();
    let country = $("#country").val();
    // console.log(`city: ${city}
    // state: ${state}
    // country: ${country}`)
    getLatLon(city, state, country);
});
zipButton.click(function (event) {
    event.preventDefault();
    let zipCode = $("#zip").val();
    let country = $("#country2").val();
    // console.log(`zipcode: ${zipCode}
    // country: ${country}`);
    zipLatLon(zipCode, country);
});

//initialize materialize components
M.AutoInit();

recentSearch();
resultsEL.onclick = resultClick;
pastSearchEL.onclick = resultClick;
