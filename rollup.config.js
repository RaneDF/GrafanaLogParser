import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import banner from './build/banner.js';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/grafana-log-parser.user.js',
        format: 'iife',
        banner,
    },
    plugins: [
        json(),
        resolve(),
        commonjs()
    ]
};
