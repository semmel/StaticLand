import {curry} from "semmel-ramda";
import ap from "./ap.js";
import map from './map.js';

export default curry((f, ma, mb) => ap(map(f, ma), mb));
