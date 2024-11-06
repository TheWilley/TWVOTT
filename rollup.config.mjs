// rollup.config.mjs
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/twvott.ts',
    output: [
        {
            file: 'dist/twvott.cjs.js',
            format: 'cjs',
        },
        {
            file: 'dist/twvott.esm.js',
            format: 'esm',
        },
        {
            file: 'dist/twvott.umd.js',
            format: 'umd',
            name: 'twvott',
        }
    ],
    plugins: [
        commonjs(),
        typescript({ tsconfig: './tsconfig.json' })
    ]
};
