import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import packageConfig from './package.json' assert { type: 'json' };

const
	now = new Date(),
	bannerText = `/* @license Apache-2.0
	${packageConfig.name} v.${packageConfig.version} visisoft.de
	(Build date: ${now.toLocaleDateString()} - ${now.toLocaleTimeString()})
	*/`,
	
	externals = ["ramda", "baconjs"],
	
	commonOutputConfig = {
		format: "cjs",
		banner: bannerText,
		dynamicImportInCjs: false  // for NodeJS v12 and lower – remove for NodeJS v14
	},
	
	config = [
		{
			input: "index.js",
			external: externals,
			output: {
				file: "dist/cjs/staticland.js",
				...commonOutputConfig
			},
			plugins: [
				resolve(),
				commonjs()
			]
		},
		{
			input: "./src/promise.js",
			external: externals,
			output: {
				file: "dist/cjs/promise.js",
				...commonOutputConfig
			},
			plugins: [
				resolve()
			]
		},
		{
			input: "./src/cancelable.js",
			external: externals,
			output: {
				file: "dist/cjs/cancelable.js",
				...commonOutputConfig
			},
			plugins: [
				resolve()
			]
		},
		{
			input: "./src/maybe.js",
			external: externals,
			output: {
				file: "dist/cjs/maybe.js",
				...commonOutputConfig
			},
			plugins: [
				resolve()
			]
		},
		{
			input: "./src/either.js",
			external: externals,
			output: {
				file: "./dist/cjs/either.js",
				...commonOutputConfig
			},
			plugins: [
				resolve()
			]
		},
		{
			input: "./src/list.js",
			external: externals,
			output: {
				file: "./dist/cjs/list.js",
				...commonOutputConfig
			},
			plugins: [
				resolve()
			]
		},
		{
			input: "./src/transformations.js",
			external: externals,
			output: {
				file: "./dist/cjs/transformations.js",
				...commonOutputConfig
			},
			plugins: [
				resolve()
			]
		},
		{
			input: "./src/lens.js",
			external: externals,
			output: {
				file: "./dist/cjs/lens.js",
				...commonOutputConfig
			},
			plugins: [
				resolve()
			]
		},
		{
			input: "./src/fantasyland.js",
			external: externals,
			output: {
				file: "./dist/cjs/fantasyland.js",
				...commonOutputConfig
			},
			plugins: [
				resolve()
			]
		},
	];

export default config;
