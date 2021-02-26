
const
	cancelableToMostStream = cc => ({ run: (sink, scheduler) => ({
		dispose: cc(
			x => { sink.event(scheduler.currentTime(), x); sink.end(); },
			e => { sink.error(scheduler.currentTime(), e); sink.end(); }
		)
	})});

export default cancelableToMostStream;
