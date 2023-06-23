// personal APIkey for OpenWeather API
const apiKey = 'bd74e2e4368a74508f47fbac228e14b3';

// get Latitude anf Longitude based off 3 potential User Inputs
function getLatLon(city,state,isoCode){
    let queryParam = [city,state,isoCode];
    // remove blank parameters
    queryParam = queryParam.filter(blank => blank.length > 0);
    // concat into a string with a comma following each index
    queryParam = queryParam.join();

    let fetchURL = `https://api.openweathermap.org/geo/1.0/direct?q=${queryParam}&limit=5&appid=${apiKey}`;

    fetch(fetchURL)
        .then(function(response){
            return response.json();
        })
        .then(function (data){
            console.log(data);
            data.forEach(result => {
                console.log(`name: ${result.name} , ${result.country}
                lat: ${result.lat}
                lon: ${result.lon}`)
                
            });
            // fiveDayFetch(data.lat,data.lon);
        });
};

// if user searched by Zip Code / 
function zipLatLon(zipCode,isoCode){
    let queryParam = [zipCode,isoCode];
    // remove blank parameters
    queryParam = queryParam.filter(blank => blank.length > 0);
    // concat into a string with a comma following each index
    queryParam = queryParam.join();
    let fetchURL = `http://api.openweathermap.org/geo/1.0/zip?zip=${queryParam}&appid=${apiKey}`;

    fetch(fetchURL)
    .then(function(response){
        return response.json();
    })
    .then(function (data){
        console.log(data);
        fiveDayFetch(data.lat,data.lon);
    });

}

function fiveDayFetch(lat,lon){
    let fetchURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    fetch(fetchURL)
        .then(function(response){
            return response.json();
        })
        .then(function (data){
            console.log(data);
        });
};

// fiveDayFetch(34.063350, -117.652400);
// zipLatLon('75701','US');
getLatLon('London','','');