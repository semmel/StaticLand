import resolve from '@rollup/plugin-node-resolve';

const
	now = new Date(),
	packageConfig = require('./package.json'),
	bannerText = `/* @license Apache-2.0
	${packageConfig.name} v.${packageConfig.version} visisoft.de
	(Build date: ${now.toLocaleDateString()} - ${now.toLocaleTimeString()})
	*/`,
	
	externals = ["semmel-ramda", "baconjs", "node-fetch", "abort-controller"],
	
	config = [
		{
			input: "index.js",
			external: externals,
			output: {
				format: "cjs",
				file: "./dist/cjs/staticland.js",
				banner: bannerText,
			},
			plugins: [
				resolve()
			]
		},
		{
			input: "./src/promise.js",
			external: externals,
			output: {
				format: "cjs",
				file: "./dist/cjs/promise.js",
				banner: bannerText,
			},
			plugins: [
				resolve()
			]
		},
		{
			input: "./src/cancelableNodeJS.js",
			external: externals,
			output: {
				format: "cjs",
				file: "./dist/cjs/cancelable.js",
				banner: bannerText,
			},
			plugins: [
				resolve()
			]
		},
		{
			input: "./src/maybe.js",
			external: externals,
			output: {
				format: "cjs",
				file: "./dist/cjs/maybe.js",
				banner: bannerText,
			},
			plugins: [
				resolve()
			]
		},
		{
			input: "./src/either.js",
			external: externals,
			output: {
				format: "cjs",
				file: "./dist/cjs/either.js",
				banner: bannerText,
			},
			plugins: [
				resolve()
			]
		},
		{
			input: "./src/transformations.js",
			external: externals,
			output: {
				format: "cjs",
				file: "./dist/cjs/transformations.js",
				banner: bannerText,
			},
			plugins: [
				resolve()
			]
		}
	];

export default config;
