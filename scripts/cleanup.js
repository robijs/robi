import { readdir, rm } from 'fs/promises'
import chalk from 'chalk'

let dirs = await readdir('./src/Routes');

dirs = dirs.filter(dir => dir.includes('_ARCHIVED'));

if (dirs.length === 0) {
    console.log(chalk.green(`/src/Routes is clean. There are no archived routes to delete.\n`));
    process.exit();
}

console.log(`(${dirs.length}) routes to delete:\n`);

for (let dir of dirs) {
    console.log(`\t${chalk.red('⨂')} - removed ${dir}`);

    await rm(`./src/Routes/${dir}`, { recursive: true, force: true });
}

console.log(chalk.green(`\n(${dirs.length}) routes deleted\n`));