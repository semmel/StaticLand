const
	traversableMonadSetoidMethodHandler = {
		get(target, key, receiver) {
			switch (key) {
				case "fantasy-land/map":
					return fn => target.map(fn);
				case "fantasy-land/chain":
					return fn => target.chain(fn);
				case 'fantasy-land/ap':
					return f_fn => target.ap(f_fn);
				case 'fantasy-land/equals':
					return other => target.equals(other);
				case "fantasy-land/traverse":
					return (F, fn) => target.traverse(F, fn);
				default:
					return target[key];
			}
		}
	},
	
	traversableMonadHandler = {
		construct(target, args) {
			return new Proxy(new target(...args), traversableMonadSetoidMethodHandler);
		}
	};

export {
	traversableMonadHandler
};
