Cancelable
===========

Cancelable Computation
-----------------------

A Cancelable Computation is a function which performs a cancelable asynchronous computation. 

`CancelableComputation e a :: ((a -> void), (e -> void)) -> (() -> void)`

In general Cancelable Computations serves the same purpose as a Promises. Contrary to Promises, Cancelable Computations are

- lazily executed,
- have no internal mutating state - thus are referentially transparent, and
- cancellation is not propagated to the consumer. 

### Executing Work
The computation is started when the Cancelable Computation function is called - **laziness**.

```javascript
// Pseudocode
let cancelableWork = (res, rej) => {
	beginSomeLongWork()  
   whenLongWorkDone with result invoke res(result)
   whenLongWorkFailed with error invoke rej(error)
   
	return () => {
		// abort the work
	};
};
```

### Propagating the Outcome
The result or failing of the computation (aka settlement) is communicated via the two callback arguments ("continuations") in the same way as the *computation function in a Promise constructor*. Differently however, the settlement of the computation should not be communicated synchronously - **enforced asynchronicity**

```javascript
let ccFoo = (res, rej) => { 
	res("foo");   // BAD CODE! Do not invoke the callbacks synchronously!  
	return () => undefined; 
};

let ccBar = (res, rej) => { 
	const timer = setTimeout(res, 0, "bar");   // Always invoke the callbacks asynchronously!  
	return () => { clearTimeout(timer); }; 
};
```

Such computation functions are the standard pattern in other libraries to create asynchronous tasks, e.g. creating [Fluture Futures](https://github.com/fluture-js/Fluture#creating-futures) or [Async in Crocks](https://crocks.dev/docs/crocks/Async.html#construction). In those other libraries however, the *order* of arguments *differs* from that of the Promise constructor; The rejection continuation comes *before* the success continuation.

### Consuming and Running Cancelables

- Simply use the Promise constructor to create a Promise from the Cancelable `new Promise(cancelableComputation)`.
  Note that if the computation is cancelled such a "consumption" Promise will never settle. See the section titled [Cancellation Discontinues](#cancellation-discontinues).
- Invoke the Cancelable and provide two callbacks as arguments `toCancel = cancelableComputation(onSuccess, onFailure)`


### Cancellation

The Cancelable Computation Function returns a function to abort/*cancel* the computation. 

A Cancelable Computation can be aborted by calling the `abort` function which is returned when the execution of the Cancelable Computation is started by invoking it with two callbacks. Thus, the computation cannot be canceled before it is started.

```javascript
let abort = cancelableComputation(onSuccess, onFailure);
abort(); // Abort immediately. onSuccess and onFailure are never called
```

When a Cancelable Computation aborts, the implementation must assert that neither the success, nor the failure callback are called. 

This is another *difference* to many cancelable computations represented by Promises. For example, aborting a `fetch` computation is known to reject the resulting promise with `AbortError`. Thus, a Cancelable `fetch` Computation should guarantee that the `AbortError` rejection does not reach the onFailure callback. 

When Cancelables are sequentially chained together by composing Cancelable-returning functions e.g. via [`chain`](cancelable-api.md#chainf-cancelable), the cancellation travels the chain up, cancelling the computation which is active in the moment of calling `abort()`.


Generators of Cancelable Computations
-------------------------

The parameters of the asynchronous computation are given to a *Cancelable Computation Generator Function* which returns a Cancelable Computation configured to that parameters.

This way the configuration of the computation is separated from its execution (*laziness*).

The typical example in many similar libraries is that of a timer:

```javascript
// laterResolve :: (Number, t) -> CancelableComputation * t
const laterResolve = (dt, value) => resolve => {
    const timer = setTimeout(resolve, dt, value);
    return () => { clearTimeout(timer); };
};
```

Rationale
---------

### No Synchronicity

The reason that a Cancelable Computation cannot synchronously invoke the callbacks with the outcome of the computation, is that otherwise certain combinators were not possible to implement. E.g. mutual cancellation of two simultaneously running computations in [`race`](cancelable-api.md#racecancelablea-cancelableb) would be much harder to implement. 

### Cancellation Discontinues

The two continuation callbacks are to collect the result of the successful computation and any computational error or exceptional path of execution. Aborting/Cancelling the computation by the consumer is not considered to be any of those two purposes. Since the calling code is (obviously) aware of the cancellation it can perform steps to publish that cancellation.

The current cancellation behaviour could be extended be supporting asynchronous cancellation - i.e. the cancel function returning a Promise instead of void. However, cancelling the cancellation itself seems to be much of an overkill.

### Copying/Sharing

A benefit of Native Promises is that they can be freely copied and shared in a program. Being eager they rather represent the eventual outcome of a computation than the computation itself. Thus copying makes much sense. However, the *internal state* of a Promise is time-dependent and thus opaque, i.e. not referentially transparent to the calling code. Depending on when probed by the surrounding code, Promises behave differently; E.g. a `Promise.race` will take a different route when one of its inputs is already settled.

Being just referentially transparent functions, such opaque Promise behaviour is not possible with copies of Cancelable Computations. Everytime the same Cancelable get consumed the asynchronous computation is started anew, and the outcome and temporal behaviour will always be the same.

Nevertheless — sharing/multicasting asynchronous computations being valuable — there are at least two ways making Cancelables shareable while maintaining the asynchronous character:

- convert to Promise `new Promise(cancelableComputation)` but thereby loosing cancelability, or
- caching/making them stateful with [`share`](cancelable-api.md#sharecancelable)

`share` picks up many disadvantages of Promise but keeps the benefit of being able to get cancelled when all consumers decide to do so.

```javascript
let ccs = share(later(10, "X"));
ccs(console.log, console.log); // ~> "X" (logged after 10)
// …
ccs(console.log, console.log); // ~> "X" (logged already on next tick!)
```

Cancelling a shared Cancelable Computation merely means unsubscribing the continuation callbacks. It should be done when the code has lost interest in the outcome of the computation. The shared computation will continue to run if there are still any subscribers which have not cancelled. Otherwise, the internal state is reset, so that the computation will be recommenced on the next call. This way the internal state might toggle between "initial" and "pending" several times. Once allowed completing, the Shared Cancelable will simply yield the internally stored outcome to the caller.
