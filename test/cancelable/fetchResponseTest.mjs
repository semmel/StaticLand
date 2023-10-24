import chai from 'chai';
import { coalesce, fetchResponse, later } from "../../src/cancelable.js";
import { assertCorrectInterface } from "../helpers/types.mjs";
import { http, HttpResponse, delay as mockServerDelay } from 'msw';
import { setupServer } from "msw/node";

const
	assert = chai.assert,

	echoServer = "https://httpbin.org/get",
	blackholeServer = "https://blackhole.webpagetest.org",
	// See  https://jsonplaceholder.typicode.com/guide.html
	publicJsonTestServer = "https://jsonplaceholder.typicode.com/",
	// See https://cdnjs.com/api#stats
	cdnJSAPI = "https://api.cdnjs.com/",

	mockServer = setupServer(
		http.get(
			`${publicJsonTestServer}todos/1`,
			async () => {
				await mockServerDelay();
				return HttpResponse.json({
					"userId": 1,
					"id": 1,
					"title": "delectus aut autem",
					"completed": false
				});
			}
		),

		http.get(
			`${publicJsonTestServer}todos/2`,
			async () => {
				await mockServerDelay(1000);
				return HttpResponse.json({
					"userId": 1,
					"id": 2,
					"title": "quis ut nam facilis et officia qui",
					"completed": false
				});
			}
		),
	);

// mockServer.events.on('request:start', ({ request }) => {
//   console.log('MSW intercepted:', request.method, request.url)
// });

mockServer.listen({
	onUnhandledRequest: "bypass"
});

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
					setTimeout(abort, 50);
				})
				.finally(() => { assert.fail("cancelable should not continue"); }),
				new Promise(resolve => { setTimeout(resolve, 4000); })
			]);
		});
	});

	it("returns a FL monad", () => {
		assertCorrectInterface("monad")(
			fetchResponse({url: `${publicJsonTestServer}todos/1`, init: { mode: "cors" }})
		);
	});
});
