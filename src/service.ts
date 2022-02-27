import {fromFetch} from "rxjs/fetch";

const flightData$ = fromFetch("https://opensky-network.org/api/states/all");