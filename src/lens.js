import {makeComposable as makeComposableViewLens, view} from "./lens/view.js";
import {over, set, makeComposable as makeComposableOverLens} from "./lens/over.js";
import {sequence, makeComposable as makeComposableSequenceLens} from "./lens/sequence.js";
import {composeOptics, composeFocus} from "./lens/compose.js";


export {default as lens} from './lens/lens.js';
export {default as indexLens} from './lens/indexLens.js';
export {default as propertyLens} from './lens/propertyLens.js';
export {
	composeOptics,
	composeFocus,
	makeComposableViewLens,
	makeComposableOverLens,
	makeComposableSequenceLens,
	over,
	sequence,
	set,
	view
};

