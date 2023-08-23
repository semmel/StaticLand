import {curryN} from "ramda";
import _isString from "../internal/_isString.js";
import {just, nothing} from "../maybe/creation.js";

const
	/**
	 * @type {(offset: Number, list: String|Array) => import('../../src/maybe').Maybe<any>}
	 * @type {(offset: Number) => (list: String|Array) => import('../../src/maybe').Maybe<any>}
	 **/
	nth = curryN(2, (offset, list) => {
		// shameless copy from Ramda
		const idx = offset < 0 ? list.length + offset : offset;
  		return (0 <= idx) && (idx <= list.length - 1)
			? just(_isString(list) ? list.charAt(idx) : list[idx])
			: nothing();
	});

export default nth;
