/**
 * StaticLand: pluck.js
 *
 * Created by Matthias Seemann on 10.05.2022.
 * Copyright (c) 2022 Visisoft OHG. All rights reserved.
 */
import map from "./map.js";
import { curry, prop } from "ramda";

export default curry((key, ca) => map(prop(key), ca));
