import * as Bacon  from 'baconjs';

const
	noop = () => undefined,
	
	cancelableToBaconStream = cc => Bacon.fromBinder(sink => {
		let toAbort = cc(
			x => {
				toAbort = noop;
				sink(x);
				sink(new Bacon.End());
			},
			e => {
				toAbort = noop;
				sink(new Bacon.Error(e));
				sink(new Bacon.End());
			}
		);
		
		return () => { toAbort(); };
	});

export default cancelableToBaconStream;
