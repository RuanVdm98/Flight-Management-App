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

let temp = window.localStorage.getItem('flights');
let tempFlights = [];
let count = 0;

if (temp && temp.length > 0) {
    tempFlights = JSON.parse(temp);
    tempFlights.filter(f => f[5] !== null && f[6] !== null).map(ff => {
        if (count < 30) {
            count++;
            const flight: Flight = {
                icoa24: ff[0],
                longitude: parseInt(ff[5]),
                latitude: parseInt(ff[6]),
                date: parseInt(ff[3]),
                altitude: parseInt(ff[13]),
                country: ff[2],
                velocity: parseInt(ff[9]),
                callSign: ff[1]
            };
            flights.push(flight);
            return true;
        }
        return false;
    })

    addFlightinfo(flights);
    addFlightMarkersToMap(flights);
}

export function addFlightinfo(flights: Flight[]) {
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
}

export function addFlightMarkersToMap(flights: Flight[]) {
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
    const filteredFlights = flights
        .filter((f) => f.callSign.toLowerCase().includes((e.target as HTMLInputElement).value.toLowerCase())).map(f => {
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
        if (infoContainer) {
            infoContainer.innerHTML += html;
        }
        return f;
    })

    addFlightMarkersToMap(filteredFlights);
}

export function renderingData() {
    const infoContainer = document.getElementById("info-container");
    if (infoContainer) {
        infoContainer.innerHTML = "";
    }
    markers.forEach((m) => {
        map.removeLayer(m);
    });
    markers = [];
    const filteredFlights = flights.map(f => {
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
            if (infoContainer) {
                infoContainer.innerHTML += html;
            }
            return f;
        })

    addFlightMarkersToMap(filteredFlights);
}


