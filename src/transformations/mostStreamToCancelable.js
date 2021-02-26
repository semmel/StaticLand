import pkg from '@most/scheduler'; // tree-shaking goes takes a dump

const
	{ newDefaultScheduler } = pkg,
	mostStreamToCancelable = observable => (res, rej) => {
		let last;
		const disposer = observable.run(
			{
				event: (unused, x) => { last = x; },
				error: (unused, e) => { rej(e); },
				end: () => { res(last); }
			},
			newDefaultScheduler()
		);
		
		return () => { disposer.dispose(); };
	};

export default mostStreamToCancelable;
