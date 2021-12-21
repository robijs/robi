export function componentTemplate({ name }) {
    return [
        `// This file may be edited programmatically.`,
        `// If you know the API, feel free to make changes by hand.`,
        `// Just be sure to put @START and @END sigils in the right places.`,
        `// Otherwise, changes made from the front end may not render properly.`,
        ``,
        `import { Title } from '../../Robi/Robi.js'`,
        ``,
        `// @START-File`,
        `export function ${name}(param) {`,
        `    const {`,
        `        parent,`,
        `    } = param;`,
        ``,
        `// View title`,
        `const viewTitle = Title({`,
        `    title: /* @START-Title */'Test'/* @END-Title */,`,
        `    parent,`,
        `});`,
        ``,
        `viewTitle.add();`,
        `// @END-File`,
        ``
    ].join('\n');
}
