import "../style.scss";
import '../src/service'
import * as map from './map'

const inputElement =  document.querySelector("input");
if (inputElement) {
  inputElement.addEventListener("input", map.updateValue);
}
