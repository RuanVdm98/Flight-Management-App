import {fromFetch} from "rxjs/fetch";
import {catchError, of, switchMap, take, tap} from "rxjs";
import * as map from './map';
import * as mainFlight from './main';

const flightData$ = fromFetch("https://opensky-network.org/api/states/all").pipe(
    switchMap(response => {
        if (response.ok) {
            return response.json();
        } else {
            return of({error: true, message: `Error ${response.status}`});
        }
    }),
    catchError(err => {
        // Network or other error, handle appropriately
        console.error(err);
        return of({error: true, message: err.message})
    })
);

//tried to tap on the pipe and could not gte the data set the only way i could was by subscribing to the observable and then setting the local storage
flightData$.subscribe(f => {
    window.localStorage.setItem('flights', JSON.stringify(f.states));
    mainFlight.populateFlights();
    map.updateValue();
});