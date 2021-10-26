import {append, curry, flip, equals, identity, o, pipe, __} from 'semmel-ramda';
import chai from 'chai';
import * as B from 'baconjs';
import {newDefaultScheduler} from '@most/scheduler';
import {periodic, withItems, map as map_mo, runEffects as runEffects_mo, slice as slice_mo,
	scan as scan_mo, skip as skip_mo, tap as tap_mo} from "@most/core";
import {propertyLens, sequence} from "../../src/lens.js";

const
	assert = chai.assert,
	// TODO:
	// When pointfree-bacon drops the  @visisoft/staticland requirement
	// - as it should in a future version - replace this hand-written
	// BaconJS map definition with @visisoft/pointfree-bacon/map
	map_bc = curry((fn, observable) => observable.map(fn));

describe("Lenses: sequence stream out from the 'bar' property", function () {
	this.slow( 1000 );
	
	const
		barLens = propertyLens("bar");
	
	it("creates a Bacon stream of structures", () => {
		const
			ob_bc = {foo: "FOO", bar: B.sequentially(10, ["BAR", "BBR", "BCR"])},
			bc_ob = sequence(barLens(map_bc), ob_bc);
		
		assert.instanceOf(bc_ob, B.EventStream);
		
		return bc_ob
		.reduce([], flip(append))
		.toPromise()
		.then(events => {
			assert.lengthOf(events, 3);
			assert.deepStrictEqual(
				events,
				[
					{ foo: 'FOO', bar: 'BAR' },
					{ foo: 'FOO', bar: 'BBR' },
					{ foo: 'FOO', bar: 'BCR' },
				]
			);
		});
	});
	
	it("creates a Most stream of structures", () => {
		const
			ob_mo = {foo: "FOO", bar: withItems(["BAR", "BBR", "BCR"], periodic(10))},
			mo_ob = sequence(barLens(map_mo), ob_mo);
		
		return pipe(
			() => mo_ob,
			scan_mo((acc, next) => [...acc, next], []),
			skip_mo(1),
			slice_mo(2, 3),
			tap_mo(events => {
				assert.lengthOf(events, 3);
				assert.deepStrictEqual(
					events,
					[
						{ foo: 'FOO', bar: 'BAR' },
						{ foo: 'FOO', bar: 'BBR' },
						{ foo: 'FOO', bar: 'BCR' },
					]
				);
			}),
			s => runEffects_mo(s, newDefaultScheduler())
		)();
	});
});
