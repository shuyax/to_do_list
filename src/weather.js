import {weather_api_key} from '../api.config'


/* eslint-disable camelcase */
function displayCurrentWeather(result){
    const weather = document.querySelector('.weather')
    // await weather.textContent = JSON.stringify(result)
    const weather_condition = result.current.condition.text
    const weather_temperature = `${result.current.temp_c  }°C / ${  result.current.temp_f  }°F`
    const location = `${result.location.name}, ${result.location.region}, ${result.location.country}`
    // eslint-disable-next-line prefer-template
    weather.innerHTML = weather_temperature + ' || ' + weather_condition + ' || ' + location
}

// eslint-disable-next-line import/prefer-default-export
export async function getWeather(get_location) {
    const myHeaders = new Headers();
    const myRequest = new Request(`http://api.weatherapi.com/v1/current.json?key=${ weather_api_key }&q=${ get_location }&aqi=no`,{
        method: 'GET',
        headers: myHeaders,
        mode: 'cors'
    })
    try {
        const response = await fetch(myRequest)
        if (!response.ok) {
            throw new Error('Network response was not OK')
        }
        const result = await response.json()
        console.log(result)
        displayCurrentWeather(result)
    } catch(error){
        console.error(error.message)
    } 
}





