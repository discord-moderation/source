import { buildSync } from 'esbuild';
import { globby } from 'globby';
import chalk from 'chalk';

const { red, green, yellowBright } = chalk;
const paths = await globby('./src/**/**/*.ts');
const data = buildSync({
    minify: false,
    sourcemap: 'external',
    outdir: 'dist',
    platform: 'node',
    entryPoints: paths,
    target: 'node16',
    format: 'cjs',
    logLevel: 'info'
});

if(data.warnings.length > 0) {
    const warnings = data.warnings.map((warn) => warn.detail);

    console.log(
        yellowBright(`discord-moderation built with warnings!\n${warnings.join('\n')}`)
    );
}
else if(data.errors.length > 0) {
    const errors = data.errors.map((error) => error.detail);

    console.log(
        red(`discord-moderation built with errors!\n${errors.join('\n')}`)
    );
}
else {
    console.log(
        green('\n\n Built discord-moderation without errors! \n\n')
    );
}