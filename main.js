import "./style.scss";
import "./tailwind.css";
import L from "leaflet";

const map = L.map("map-container").setView([20.505, -0.09], 2);
const flights = [];
let markers = [];
document.querySelector("input").addEventListener("input", updateValue);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

fetch("https://opensky-network.org/api/states/all")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed with status ${reponse.status}`);
    }
    return response.json();
  })
  .then((data) => {
    for (let index = 0; index < 30; index++) {
      flights.push(data.states[index]);
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

function addMarkerstoMap() {
  flights.forEach((f) => {
    markers.push(L.marker([f[6], f[5]], { title: f[1] }).addTo(map));
  });
}

function addFlightinfo() {
  flights.forEach((f) => {
    var html = `  
    <div class="card">
      <div class="heading">
        <h1>${f[1]}</h1>
        <label>${f[2]}</label>
      </div> 
      <label>Updated: ${toDateTime(f[3])}</label>
      <label>Velocity: ${f[9]}</label>
      <label>Altitude: ${f[13]}m</label>
    </div>`;
    document.getElementById("info-container").innerHTML += html;
  });

  addMarkerstoMap();
}

const toDateTime = (seconds) => new Date(seconds * 1000);

function updateValue(e) {
  document.getElementById("info-container").innerHTML = "";
  markers.forEach((m) => {
    map.removeLayer(m);
  });
  markers = [];
  flights
    .filter((f) => f[1].toLowerCase().includes(e.target.value.toLowerCase()))
    .forEach((f) => {
      var html = `  
      <div class="card">
        <div class="heading">
          <h1>${f[1]}</h1>
          <label>${f[2]}</label>
        </div> 
        <label>Updated: ${toDateTime(f[3])}</label>
        <label>Velocity: ${f[9]}</label>
        <label>Altitude: ${f[13]}m</label>
      </div>`;
      document.getElementById("info-container").innerHTML += html;
      markers.push(L.marker([f[6], f[5]], { title: f[1] }).addTo(map));
    });
}
