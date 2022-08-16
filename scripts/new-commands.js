import { writeFile } from 'fs/promises'
import { action } from './templates/action.js'
import { component } from './templates/component.js'

const [ command, name, type ] = process.argv.slice(2);

try {
    let template;
    let path;
    
    switch(command) {
        case 'action':
            path = 'Actions';
            template = action({ name, type });
            break;
        case 'component':
            path = 'Components';
            template = component({ name, type });
            break;
        default:
            break;
    }

    // TODO: add path arg for instance of Robi app (custom) vs Robi action?
    await writeFile(`src/Robi/${path}/${name}.js`, template);
} catch (err) {
    console.error(err);
}