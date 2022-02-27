import "../style.scss";
import L from "leaflet";
import {map} from './map';
import {Flight} from "./models/flight";
//import {flightData$} from './service';


const flights: Flight[] = [];
let markers: L.Marker[] = [];
const inputElement =  document.querySelector("input");
if (inputElement) {
  inputElement.addEventListener("input", updateValue);
}



fetch("https://opensky-network.org/api/states/all")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    for (let index = 0; index < 30; index++) {
      const flight: Flight = {
        icoa24: data.states[index][0],
        longitude: data.states[index][5],
        latitude: data.states[index][6],
        date: data.states[index][3],
        altitude: data.states[index][13],
        country: data.states[index][2],
        velocity: data.states[index][9],
        callSign: data.states[index][1]
      };
      flights.push(flight);
    }
    addFlightinfo();
    let cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        console.log("click");
      });
    });
  })
  .catch((error) => console.log(error));

function addMarkersToMap() {
  flights.forEach((f) => {
    markers.push(L.marker([f.latitude, f.longitude], { title: f.callSign }).addTo(map));
  });
}

function addFlightinfo() {
  flights.forEach((f) => {
    const html = `  
    <div class="card">
      <div class="heading">
        <h1>${f.callSign}</h1>
        <label>${f.country}</label>
      </div> 
      <label>Updated: ${toDateTime(f.date)}</label>
      <label>Velocity: ${f.velocity}</label>
      <label>Altitude: ${f.altitude}m</label>
    </div>`;
    const infocontainer = document.getElementById("info-container");
    if (infocontainer) {
      infocontainer.innerHTML += html;
    }
  });

  addMarkersToMap();
}

const toDateTime = (seconds: number) => new Date(seconds * 1000);

function updateValue(e: Event) {
  const infoContainer = document.getElementById("info-container");
  if (infoContainer) {
    infoContainer.innerHTML = "";
  }
  markers.forEach((m) => {
    map.removeLayer(m);
  });
  markers = [];
  flights
    .filter((f) => f.callSign.toLowerCase().includes((e.target as HTMLInputElement).value.toLowerCase()))
    .forEach((f) => {
      const html = `  
      <div class="card">
        <div class="heading">
          <h1>${f.callSign}</h1>
          <label>${f.country}</label>
        </div> 
        <label>Updated: ${toDateTime(f.date)}</label>
        <label>Velocity: ${f.velocity}</label>
        <label>Altitude: ${f.altitude}m</label>
      </div>`;
      const infoContainer = document.getElementById("info-container");
      if (infoContainer) {
        infoContainer.innerHTML += html;
      }
      markers.push(L.marker([f.latitude, f.longitude], { title: f.callSign }).addTo(map));
    });
}
