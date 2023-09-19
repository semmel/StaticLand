// :: Promise e a -> Cancelable e a
import { addFantasyLandInterface as fantasyfy } from "../cancelable.js";
import __promiseToCancelable from "../cancelable/internal/_promiseToCancelable.js";
import { o } from "ramda";

const promiseToCancelable = o(fantasyfy, __promiseToCancelable);

export default promiseToCancelable;
