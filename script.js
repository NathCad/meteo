//Récuperer la config et lancer la fonction principale
fetch("./config.json")
  .then((res) => res.json())
  .then((config) => main(config))
  .catch(
    (err) =>
      (document.getElementById("meteo").textContent =
        "Oups... Impossible de lire le fichier de configuration")
  );

function main(config) {
  //stocker la config en sessionstorage
  sessionStorage.setItem("config", JSON.stringify(config));
  //creer un bouton pour rafraichir
  creerBoutonRafraichair();
  //Api call puis execute showMeteo avec resultat
  fetchAndShowMeteo(config);
}

function creerBoutonRafraichair() {
  const bouton = document.createElement("input");
  bouton.setAttribute("type", "button");
  bouton.setAttribute("value", "Rafraichir");
  bouton.addEventListener("click", rafraichirInfosMeteo);
  document.getElementById("meteo").after(bouton);
}

function rafraichirInfosMeteo() {
  const config = JSON.parse(sessionStorage.getItem("config"));
  fetchAndShowMeteo(config);
}

function fetchAndShowMeteo(config) {
  fetch(getApiUrl(config.ville, config.apiKey))
    .then((result) => result.json())
    .then((resultApi) => showMeteo(resultApi))
    .catch(
      (err) =>
        (document.getElementById("meteo").textContent =
          "Oups... Impossible de contacter l'api météo")
    );
}

function showMeteo(resultApi) {
  const titre = (document.getElementsByTagName(
    "h1"
  )[0].textContent = `La météo à ${resultApi.name}`);
  const typeTemps = capitalize(resultApi.weather[0].description);
  const weatherHtml = `<div class="meteo-header">
       <span>${resultApi.main.temp} °C</span>
       <span>${typeTemps}</span>
       <span
         ><img
           src="https://openweathermap.org/img/wn/${
             resultApi.weather[0].icon
           }@2x.png"
           alt="${typeTemps}"
       /></span>
       </div>
       <ul>
         <li>
           <label for="info_vent">Vent:</label
           ><span id="info_vent">${(resultApi.wind.speed * 3.6).toLocaleString(
             undefined,
             { maximumFractionDigits: 2 }
           )} kmh - ${calculOrientation(resultApi.wind.deg)}</span>
         </li>
         <li>
           <label for="info_temperature">Température Mini/Maxi:</label
           ><span id="info_temperature">${resultApi.main.temp_min}°C / ${
    resultApi.main.temp_max
  }°C</span>
         </li>
         <li>
           <label for="info_pression">Pression:</label
           ><span id="info_pression">${resultApi.main.pressure} hpa</span>
         </li>
         <li>
           <label for="info_humidité">humidité:</label
           ><span id="info_humidité">${resultApi.main.humidity} %</span>
         </li>
       </ul>`;
  document.getElementById("meteo").innerHTML = weatherHtml;
}
//utilitaires
/**
 * Met la première lettre d'une chaine en majuscule
 * @param {*} str
 * @returns
 */
function capitalize(str) {
  if (str) {
    return str[0].toUpperCase() + str.substring(1, str.length);
  }
  return str;
}

/**
 * Prend une orientation en degrés et renvoie une orientation en points cardinaux
 * @param {*} degres
 * @returns
 */
function calculOrientation(degres) {
  //Les dergrés vont de 0 à 359.999999... degrés
  if (degres >= 337.5 || (degres >= 0 && degres < 22.5)) {
    return "N";
  } else if (degres >= 22.5 && degres < 67.5) {
    return "NE";
  } else if (degres >= 67.5 && degres < 112.5) {
    return "E";
  } else if (degres >= 112.5 && degres < 157.5) {
    return "SE";
  } else if (degres >= 157.5 && degres < 202.5) {
    return "S";
  } else if (degres >= 202.5 && degres < 247.5) {
    return "SO";
  } else if (degres >= 247.5 && degres < 292.5) {
    return "O";
  } else if (degres >= 292.5 && degres < 337.5) {
    return "NO";
  }
  return "Error";
}

function getApiUrl(ville, apiKey) {
  return `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${ville}&lang=fr&units=metric`;
}
