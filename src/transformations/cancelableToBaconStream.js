import * as Bacon  from 'baconjs';

const
	cancelableToBaconStream = cc => Bacon.fromBinder(sink => {
		return cc(
			x => {
				sink(x);
				sink(new Bacon.End());
			},
			e => {
				sink(new Bacon.Error(e));
				sink(new Bacon.End());
			}
		);
	});

export default cancelableToBaconStream;
