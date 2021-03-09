import {curry} from "semmel-ramda";
import {ap, map} from "../maybe.js";

export default curry((f, ma, mb) => ap(map(f, ma), mb));
