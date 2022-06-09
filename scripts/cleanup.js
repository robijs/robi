import { readdir, rm } from 'fs/promises'
import chalk from 'chalk'

let dirs = await readdir('./src/Routes');

dirs = dirs.filter(dir => dir.includes('_ARCHIVED'));

console.log(`(${dirs.length}) routes to delete\n`);

for (let dir of dirs) {
    console.log(`${chalk.red('⨂')} Removed archived route at ./src/Routes/${dir}`);

    await rm(`./src/Routes/${dir}`, { recursive: true, force: true });
}

console.log(chalk.green(`\n(${dirs.length}) routes deleted\n`));