import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

const
	config = {
		output: {
			format: "esm"
		},
		plugins: [
			commonjs({
				sourceMap: false
			}),
			resolve({
				preferBuiltins: false,
				browser: true
			})
		]
	};

export default config;