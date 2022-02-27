import L from "leaflet";
import {Flight} from "./models/flight";

export const map = L.map("map-container").setView([20.505, -0.09], 2);
let markers: L.Marker[] = [];
const flights: Flight[] = [];

const toDateTime = (seconds: number) => new Date(seconds * 1000);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

let tempFlights = window.localStorage.getItem('flights');

if (tempFlights && tempFlights.length > 0) {
    tempFlights = JSON.parse(tempFlights);
    for (let i = 0; i < 30; i++) {
        if (tempFlights[i][5] !== null || tempFlights[i][6] !== null) {
            const flight: Flight = {
                icoa24: tempFlights[i][0],
                longitude: parseInt(tempFlights[i][5]),
                latitude: parseInt(tempFlights[i][6]),
                date: parseInt(tempFlights[i][3]),
                altitude: parseInt(tempFlights[i][13]),
                country: tempFlights[i][2],
                velocity: parseInt(tempFlights[i][9]),
                callSign: tempFlights[i][1]
            };
            flights.push(flight);
        }
    }
    addFlightinfo();
}

export function addFlightinfo() {
    flights.forEach((f) => {
        const html = `  
    <div class="card">
      <div class="heading">
        <h1 class="font-semibold">${f.callSign}</h1>
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

export function addMarkersToMap() {
    flights.forEach((f) => {
        markers.push(L.marker([f.latitude, f.longitude], {title: f.callSign}).addTo(map));
    });
}

export function updateValue(e: Event) {
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
          <h1 class="font-semibold">${f.callSign}</h1>
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
            markers.push(L.marker([f.latitude, f.longitude], {title: f.callSign}).addTo(map));
        });
}


