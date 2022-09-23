import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import {terser} from 'rollup-plugin-terser';

/**
 * @type {() => import('rollup').RollupOptions}
 */
export default commandLineArgs => ({
	treeshake: commandLineArgs.watch ? false : undefined,
	input: 'src/index.ts',
	output: {
		file: 'public/bundle.js',
		minifyInternalExports: commandLineArgs.watch ? false : undefined,
		sourcemap: true,
		format: 'iife',
	},
	plugins: [
		replace({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			__buildDate__: () => JSON.stringify(new Date()),
			preventAssignment: true
		}),
		external(),
		resolve(),
		commonjs(),
		typescript({tsconfig: './tsconfig.json'}),
		json(),
		postcss(),
		commandLineArgs.watch ? undefined : terser(),
	],
})
