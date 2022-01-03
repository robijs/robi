// @START-File
/**
 * 
 * @param {*} param0 
 * @returns 
 */
export function RouteTemplate({ name, title }) {
    return [
        `// This file can be edited programmatically.`,
        `// If you know the API, feel free to make changes by hand.`,
        `// Just be sure to put @START and @END sigils in the right places.`,
        `// Otherwise, changes made with GUI tools will not render properly.`,
        ``,
        `import { Title } from '../../Robi/RobiUI.js'`,
        ``,
        `// @START-${name}`,
        `export default async function ${name}(param) {`,
        `    const {`,
        `        parent,`,
        `    } = param;`,
        ``,
        `    // @START-routeTitle`,
        `    const routeTitle = Title({`,
        `        title: /* @START-Title */'${title || name}'/* @END-Title */,`,
        `        parent`,
        `    });`,
        `    `,
        `    routeTitle.add();`,
        `    // @END-routeTitle`,
        `}`,
        `// @END-${name}`,
        ``
    ].join('\n');
}
// @END-File
