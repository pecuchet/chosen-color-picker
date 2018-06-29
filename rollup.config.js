import pkg from './package.json';
import {terser} from "rollup-plugin-terser";

export default [
    {
        input: 'color-range-picker.js',
        output: [
            {file: pkg.main, format: 'es'},
        ],
        plugins: [
            terser()
        ]
    }
];
