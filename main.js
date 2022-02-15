import './style.scss'
import L from "leaflet";


var map = L.map("map-container").setView([20.505, -0.09], 2);
var flights = [];
var markers = [];
const input = document.querySelector('input');
input.addEventListener('input', updateValue);



L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

fetch("https://opensky-network.org/api/states/all")
  .then(response => {
    if (!response.ok) {
      throw new Error(`Request failed with status ${reponse.status}`)
    }
    return response.json()
  })
  .then(data => {
    for (let index = 0; index < 30; index++) {
      flights.push(data.states[index]);
      
    }
    addFlightinfo();
    let cards = document.querySelectorAll(".card")
    
    cards.forEach(card => {
      card.addEventListener("click",() => { console.log('click')})
    
    })
   
  })
  .catch(error => console.log(error))

function addMarkerstoMap() {
  flights.forEach(f => {
    markers.push(L.marker([f[6], f[5]], { title: f[1] }).addTo(map));
  });

  
}

function addFlightinfo(){
  flights.forEach(f => {
    var html = `  <div class="card">
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

function toDateTime(secs) {
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
  return t;
}

function updateValue(e) {
  document.getElementById("info-container").innerHTML = '';
  markers.forEach(m => {
    map.removeLayer(m);
  })
  markers = [];
  var filteredFlights = flights.filter(f => f[1].toLowerCase().includes(e.target.value.toLowerCase()) );
  console.log(e.target.value);
  filteredFlights.forEach(f => {
    var html = `  <div class="card">
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




  
  

