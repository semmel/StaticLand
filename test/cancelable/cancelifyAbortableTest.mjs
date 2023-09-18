import chai from 'chai';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { cancelifyWithArityAbortable as cancelifyAbortablePromiseFactoryFn } from "../../src/cancelable.js";

const
	assert = chai.assert;

describe("cancelable/cancelifyAbortable", function () {
	this.slow(4000);
	this.timeout(8000);
	describe("wrapped child_process.exec", function () {
		const
			abortableExec = promisify(exec),
			cancelableExec = cancelifyAbortablePromiseFactoryFn(2, abortableExec),
			listCommand = process.platform === "win32" ? "dir /B" : "ls -l";

		it("resolves with the result", () =>
			new Promise(cancelableExec(`${listCommand} package.json`, {}))
			.then(result => {
				assert.containsAllKeys(result, ["stdout", "stderr"]);
				assert.isString(result.stdout);
				assert.match(result.stdout, /package\.json/i);
			})
		);

		it("discontinues when cancelled", () =>
			Promise.race([
				new Promise((res, rej) => {
					const cancel = cancelableExec(`${listCommand} package.json`, {})(res, rej);
					setTimeout(cancel, 5);
				})
				.finally(() => { assert.fail("cancelable should not continue"); }),

				new Promise(resolve => setTimeout(resolve, 3000, "test-end"))
			])
			.then(result => {
				assert.strictEqual(result, "test-end");
			})
		);
	});

	describe.skip("wrapped fetch", function () {
		it("should be simple", () => {
			return Promise.resolve(6)
			.then(x => assert.strictEqual(x, 6));
		});
	});
});
