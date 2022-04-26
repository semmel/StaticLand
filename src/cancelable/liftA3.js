import {curry} from 'ramda';
import ap from "./ap.js";
import map from './map.js';

export default curry((f, ma, mb, mc) => ap(ap(map(f, ma), mb), mc));
