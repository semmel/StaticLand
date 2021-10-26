import {compose, equals, identity, o, reverse, toUpper} from 'semmel-ramda';
import chai from 'chai';
import {lens, indexLens, view, makeComposableViewLens, over, propertyLens,
	makeComposableOverLens, sequence, set, composeFocus, composeOptics}
	from "../../src/lens.js";
import {later as later_p, map as map_p} from '../../src/promise.js';

import {map as map_c} from '../../src/constant.js';
import {map as map_i} from '../../src/identity.js';
import {map as map_l} from '../../src/list.js';
import {just, nothing, map as map_mb, isNothing, isJust, getOrElse} from "../../src/maybe.js";

const
	assert = chai.assert;

describe("Lenses: basic indexed operation", function() {
	const
		xs = ["foo", "bar", "baz"],
		_1 = indexLens(1);
	
	it("views, sets and changes an array", () => {
		const
			theView = view(makeComposableViewLens(_1), xs),
			updateLens = makeComposableOverLens(_1),
			theUpdate = set(updateLens, "qux", xs),
			theChange = over(updateLens, reverse, xs);
		
		assert.strictEqual(theView, "bar");
		assert.deepEqual(theUpdate, ["foo", "qux", "baz"]);
		assert.deepEqual(theChange, ["foo", "rab", "baz"]);
	});
});

const
	// shameless copy from ramda-lenses
	users = [
		{
			id: 1, name: 'Ivan', addresses: [{street: '92 Oak St.', zip: '08081'}],
			paymentConfirmed: Promise.resolve({notifiedAmount: 99.95}),
			nickName: nothing()
		},
		{
			id: 2, name: 'Donielle', addresses: [{street: '393 Post Ave.', zip: '93011'}],
			paymentConfirmed: later_p(100, {notifiedAmount: 199.99}),
			nickName: just("Don")
		},
		{
			id: 3, name: 'Rick', addresses: [],
			paymentConfirmed: Promise.reject("Insufficient funds"),
			nickName: just("Ricky")
		}
	],
	_0 = indexLens(0),
	_1 = indexLens(1),
	_2 = indexLens(2),
	name = propertyLens('name'),
	addresses = propertyLens('addresses'),
	street = propertyLens('street'),
	zip = propertyLens('zip'),
	payment = propertyLens('paymentConfirmed'),
	amount = propertyLens('notifiedAmount'),
	nick = propertyLens('nickName');

describe("Lenses: view/set/over", function () {
	
	const
		firstStreetView = composeFocus([_0, addresses, _0, street]),
		firstStreetChange = composeOptics([_0, addresses, _0, street]);
	
	
	it('gets the value', function() {
		const result = view(firstStreetView, users);
		assert.equal('92 Oak St.', result);
	});
	
	it('sets the value without altering the rest', function() {
		const res = set(firstStreetChange, '88 Willow Dr.', users);
		assert.equal('88 Willow Dr.', res[0].addresses[0].street);
		assert.equal('393 Post Ave.', res[1].addresses[0].street);
		assert.equal('92 Oak St.', users[0].addresses[0].street);
	});
	
	it('runs functions over the value', function() {
		const res = over(firstStreetChange, toUpper, users);
		assert.equal('92 OAK ST.', res[0].addresses[0].street);
		assert.equal('393 Post Ave.', res[1].addresses[0].street);
		assert.equal('92 Oak St.', users[0].addresses[0].street);
	});
});

describe("Lenses: Mapping into lists", function () {
	const
		zips = compose(map_l, addresses(map_i), map_l, zip(map_i));
	
	it('alters a mapped value', function () {
		const res = over(zips, reverse, users);
		assert.equal('11039', res[1].addresses[0].zip);
		assert.equal('18080', res[0].addresses[0].zip);
		assert.equal('08081', users[0].addresses[0].zip);
	});
	
	it('sets a mapped value', function () {
		const res = set(zips, '11111', users);
		assert.equal('11111', res[1].addresses[0].zip);
		assert.equal('11111', res[0].addresses[0].zip);
		assert.equal('08081', users[0].addresses[0].zip);
	});
});

describe("Lenses: Mapping ADTs", function () {
	this.slow(1000);
	
	const
		firstPaymentAmountView = compose(_0(map_c), payment(map_c), map_p, amount(map_c)),
		firstPaymentChange = compose(_0(map_i), payment(map_i), map_p),
		firstNickView = compose(_0(map_c), nick(map_c), map_mb),
		secondNickView = compose(_1(map_c), nick(map_c), map_mb),
		secondNickChange = compose(_1(map_i), nick(map_i), map_mb);
	
	it ("gets the promised value", () => {
		const
			firstPaymentAmount = view(firstPaymentAmountView, users);
		assert.instanceOf(firstPaymentAmount, Promise);
		
		return firstPaymentAmount
		.then(value => {
			assert.strictEqual(99.95, value);
		});
	});
	
	it("alters the promised value", () => {
		const
			alteredUsers = over(firstPaymentChange, ({ notifiedAmount }) => ({notifiedAmount: ++notifiedAmount}), users);
		
		assert.instanceOf(alteredUsers[0].paymentConfirmed, Promise);
		return alteredUsers[0].paymentConfirmed
		.then(({notifiedAmount}) => {
			assert.strictEqual(notifiedAmount, 100.95);
		});
	});
	
	it("gets the maybe", () => {
		const
			firstNick = view(firstNickView, users),
			secondNick = view(secondNickView, users);
		assert.isTrue(isNothing(firstNick));
		assert.isTrue(isJust(secondNick));
	});
	
	it("alters the maybe value", () => {
		const
			alteredUsers = over(secondNickChange, reverse, users);
		
		assert.strictEqual(getOrElse("invalid fallback", alteredUsers[1].nickName), "noD");
	});
});

describe("Lenses: sequence", function() {
	const
		firstPaymentSequence = compose(_0(map_c), payment(map_p)),
		thirdPaymentSequence = compose(_2(map_c), payment(map_p)),
		firstNickNameSequence = compose(_0(map_c), nick(map_mb)),
		secondNickNameSequence = compose(_1(map_c), nick(map_mb));
	
	it("returns the entire data structure in the Maybe", () => {
		const
			maybeSecondUser = view(secondNickNameSequence, users);
		
		assert.isTrue(isJust(maybeSecondUser));
		assert.deepStrictEqual(
			getOrElse("invalid fallback", maybeSecondUser),
			{...users[1], nickName: "Don"}
		);
	});
	
	it ("returns nothing when pointed to a nothing", () => {
		const
			maybeFirstUser = view(firstNickNameSequence, users);
		
		assert.isTrue(isNothing(maybeFirstUser));
	});
	
	it("resolves with the entry structure when pointed to a resolved Promise", () => {
		const
			whenPayedFirstUser = sequence(firstPaymentSequence, users);
		
		assert.instanceOf(whenPayedFirstUser, Promise);
		return whenPayedFirstUser
		.then(user => {
			assert.deepStrictEqual(user, {...users[0], paymentConfirmed: {notifiedAmount: 99.95}});
		});
	});
	
	it("rejects with the failure value when pointed to a rejected Promise", () => {
		const
			whenPayedThirdUser = sequence(thirdPaymentSequence, users);
		
		assert.instanceOf(whenPayedThirdUser, Promise);
		
		return whenPayedThirdUser
		.then(
			val => {
				assert.fail(`Unexpected success with ${val}`);
			},
			error => {
				assert.strictEqual(error, "Insufficient funds");
			}
		);
	});
});

// TODO: Traversing and Iso from https://github.com/ramda/ramda-lens/blob/master/test/test.js
