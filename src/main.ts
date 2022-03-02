import "../style.scss";
import '../src/service'
import * as map from './map'
import {addFlightinfo, addFlightMarkersToMap} from "./map";
import {Flight} from "./models/flight";

const inputElement =  document.querySelector("input");
if (inputElement) {
  inputElement.addEventListener("input", map.updateValue);
}

let tempFlights = [];
export let allFlights: Flight[] = [];

export function populateFlights() {
  const temp = window.localStorage.getItem('flights');

  if (temp && temp.length > 0) {
    allFlights = JSON.parse(temp).filter(f => f[5] !== null && f[6] !== null).slice(0, 30).map(ff => {
      return {
        icoa24: ff[0],
        longitude: parseInt(ff[5]),
        latitude: parseInt(ff[6]),
        date: parseInt(ff[3]),
        altitude: parseInt(ff[13]),
        country: ff[2],
        velocity: parseInt(ff[9]),
        callSign: ff[1]
      };
    })

    addFlightinfo(allFlights);
    addFlightMarkersToMap(allFlights);
  }
}