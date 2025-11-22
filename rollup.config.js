import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import banner from './build/banner.js';   // <-- THIS WAS MISSING

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/grafana-logs.user.js',
        format: 'iife',
        banner,           // <-- NOW banner is defined
    },
    plugins: [
        json(),           // allow package.json import
        resolve(),
        commonjs()
    ]
};
