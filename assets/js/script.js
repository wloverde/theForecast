// personal APIkey for OpenWeather API
const apiKey = 'bd74e2e4368a74508f47fbac228e14b3';
const resultsEL = document.getElementById("searchResults");

// get Latitude anf Longitude based off 3 potential User Inputs
function getLatLon(city, state, isoCode) {
    let queryParam = [city, state, isoCode];
    // remove blank parameters
    queryParam = queryParam.filter(blank => blank.length > 0);
    // concat into a string with a comma following each index
    queryParam = queryParam.join();

    let fetchURL = `https://api.openweathermap.org/geo/1.0/direct?q=${queryParam}&limit=5&appid=${apiKey}`;

    fetch(fetchURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            data.forEach(result => {
                console.log(`name: ${result.name}, ${result.state} ${result.country}
                lat: ${result.lat}
                lon: ${result.lon}`);
                // Create Result buttons with values of the Lat and Lon in search modal
                let resultValue = `${result.lat},${result.lon}`;
                let resultButton = document.createElement("button");
                resultButton.setAttribute("value", resultValue);
                resultButton.setAttribute("class", "modal-close waves-effect waves-light btn-large light-blue darken-1");
                resultButton.setAttribute("style", "margin:5px");
                resultButton.textContent = `${result.name}, ${result.state} ${result.country}`;
                searchResults.appendChild(resultButton);
            });
            // fiveDayFetch(data[0].lat,data[0].lon);
        });
};

// if user searched by Zip Code / 
function zipLatLon(zipCode, isoCode) {
    let queryParam = [zipCode, isoCode];
    // remove blank parameters
    queryParam = queryParam.filter(blank => blank.length > 0);
    // concat into a string with a comma following each index
    queryParam = queryParam.join();
    let fetchURL = `http://api.openweathermap.org/geo/1.0/zip?zip=${queryParam}&appid=${apiKey}`;

    fetch(fetchURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
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
            console.log(data);
            // adds search results to local storage
            localResults(data.city.coord.lat, data.city.coord.lon, data.city.name)
        });
};

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
    previousSearchs.push(newResults);
    console.log(previousSearchs);
    localStorage.setItem('results', JSON.stringify(previousSearchs));
}

function resultClick(event) {
    let buttonEl = event.target;
    let latLon = buttonEl.value.split(",");
    console.log(buttonEl, latLon);
    fiveDayFetch(latLon[0], latLon[1]);
}

//initialize materialize dropdown and Modals
$(document).ready(function () {
    $('.modal').modal();
    $('select').formSelect();
});

// Query Selector -- buttons for each search option
const cityButton = $("#cityButton");
const zipButton = $('#zipButton');
// Event Listener that returns the 3 values for getLatLon
cityButton.click(function (event) {
    event.preventDefault();
    let city = $("#cityInput").val();
    let state = $("#state").val();
    let country = $("#country").val();
    console.log(`city: ${city}
    state: ${state}
    country: ${country}`)
    getLatLon(city, state, country);
});
zipButton.click(function (event) {
    event.preventDefault();
    let zipCode = $("#zip").val();
    let country = $("#country").val();
    console.log(`zipcode: ${zipCode}
    country: ${country}`);
    zipLatLon(zipCode, country);
});

resultsEL.onclick = resultClick;
// fiveDayFetch(34.063350, -117.652400);
//  zipLatLon('e14','gb');
// getLatLon('tyler','Texas','');