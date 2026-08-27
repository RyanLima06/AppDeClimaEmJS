async function main() {
    const rl = require("node:readline/promises");
    const prompt = rl.createInterface({
    input: process.stdin, output: process.stdout
    })
    
    const userCity = await prompt.question("Qual a sua cidade? ");
    prompt.close();

    const city = await getCity(userCity);

    const latitude = city.latitude;
    const longitude = city.longitude;
    const country = city.country;
    console.log(latitude, longitude, country)

    const climate = await getClimate(latitude, longitude)
    
    console.log(`Cidade: ${userCity}`);
    console.log(`Temperatura: ${climate.temperatura} C°`);
    console.log(`Ventos de ${climate.vento} km/h`)
    console.log(climateTranslation(climate.weatherCode));

    
}

async function getCity(nomeCidade) {
    const cityEncoded = encodeURIComponent(nomeCidade);
    const city = await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityEncoded}`)).json();
    return city.results[0]
}
async function getClimate(latitude, longitude) {
    
    const climaResp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code`);
    const finalResp = await climaResp.text();
    const body = JSON.parse(finalResp)
    return {temperatura: body.current.temperature_2m, vento: body.current.wind_speed_10m, weatherCode: body.current.weather_code}
}
function climateTranslation(weatherCode) {
   const tableOfWeatherCode ={
                    0: "Céu limpo",
                    1: "Predominantemente limpo",
                    2: "Parcialmente nublado",
                    3: "Encoberto",
                    45: "Névoa (nevoiro)",
                    48: "Nevoeiro com depósito de geada",

                    // Garoa
                    51: "Garoa leve",
                    53: "Garoa moderada",
                    55: "Garoa densa",
                    56: "Garoa congelante leve",
                    57: "Garoa congelante densa",

                    // Chuva
                    61: "Chuva leve",
                    63: "Chuva moderada",
                    65: "Chuva forte",
                    66: "Chuva congelante leve",
                    67: "Chuva congelante forte",
                    80: "Pancadas de chuva leve",
                    81: "Pancadas de chuva moderada",
                    82: "Pancadas de chuva violenta",

                    // Neve
                    71: "Queda de neve leve",
                    73: "Queda de neve moderada",
                    75: "Queda de neve forte",
                    77: "Grãos de neve",
                    85: "Pancadas de neve leve",
                    86: "Pancadas de neve forte",

                    // Tempestades
                    95: "Trovoada leve ou moderada",
                    96: "Trovoada com granizo leve",
                    99: "Trovoada com granizo forte",
    }
    const translatedClimate = tableOfWeatherCode[weatherCode] ?? "Código desconhecido";
    return translatedClimate;
}


main()