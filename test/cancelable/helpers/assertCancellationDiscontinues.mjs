export default function ({assert, cancelable, isSynchronous, delay = 0}) {
	const
		computationPromise = new Promise((resolve, reject) => {
			const abort = cancelable(resolve, reject);
			if (isSynchronous) {
				abort();
			}
			else {
				setTimeout(abort, delay);
			}
		});
	
	return Promise.race([
		computationPromise
		.finally(() => {
			assert.fail("cancelable should not settle");
		}),
		new Promise(res => setTimeout(res, 2 * delay))
	]);
}
