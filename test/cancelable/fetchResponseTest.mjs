import {equals, identity, o} from 'semmel-ramda';
import chai from 'chai';
import fetchResponse from "../../src/cancelable/fetchResponseNodeJS.js";

const
	assert = chai.assert,
	
	echoServer = "https://httpbin.org/get",
	blackholeServer = "https://blackhole.webpagetest.org",
	// See  https://jsonplaceholder.typicode.com/guide.html
	publicJsonTestServer = "https://jsonplaceholder.typicode.com/",
	// See https://cdnjs.com/api#stats
	cdnJSAPI = "https://api.cdnjs.com/";

describe("cancelables fetchResponse", function() {
	this.slow(5000);
	this.timeout(6000);
	
	describe("fetching from JSON-responding servers", function() {
		const
			url = new URL(publicJsonTestServer);
		
		beforeEach(() => {
			url.pathname = "";
		});
		
		it("succeeds in getting a fake todo from the public json test api", () => {
			url.pathname = "todos/1";
			
			return new Promise(fetchResponse({url, init: { mode: "cors" }}))
			.then(response => {
				assert.typeOf(response, "Response");
				return response.json();
			})
			.then(data => {
				assert.containsAllKeys(data, ['userId', 'id', 'title', 'completed']);
			});
		});
		
		it("discontinues when cancelled", () => {
			url.pathname = "todos/2";
			
			return Promise.race([
				new Promise((resolve, reject) => {
					const abort = fetchResponse({url, init: { mode: "cors" }})(resolve, reject);
					setTimeout(abort, 20);
				})
				.finally(() => { assert.fail("cancelable should not continue"); }),
				new Promise(resolve => { setTimeout(resolve, 4000); })
			]);
		});
	});
});
