const cancelableToPromise = cancelable => new Promise(cancelable);

export default cancelableToPromise;
