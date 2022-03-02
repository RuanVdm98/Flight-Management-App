import L from "leaflet";
import {Flight} from "./models/flight";
import {allFlights} from './main'

export const map = L.map("map-container").setView([20.505, -0.09], 2);
let markers: L.Marker[] = [];
let flights: Flight[] = [];

const toDateTime = (seconds: number) => new Date(seconds * 1000);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);


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
    markers.forEach(m => map.removeLayer(m));
    flights.forEach((f) => {
        markers.push(L.marker([f.latitude, f.longitude], {title: f.callSign}).addTo(map));
    });
}

export function updateValue(e: Event | null = null) {
    if (flights.length === 0) {
        flights = allFlights;
    }
    const infoContainer = document.getElementById("info-container");
    if (infoContainer) {
        infoContainer.innerHTML = "";
    }
    markers.forEach((m) => {
        map.removeLayer(m);
    });
    markers = [];
    const filteredFlights = e ? flights
        .filter((f) => f.callSign.toLowerCase().includes((e.target as HTMLInputElement).value.toLowerCase())) : flights
            .map(f => {
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


