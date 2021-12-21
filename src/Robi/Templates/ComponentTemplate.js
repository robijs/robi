// @START-File
/**
 * 
 * @param {*} param0 
 * @returns 
 */
export function ComponentTemplate({ name }) {
    return [
        `// This file may be edited programmatically.`,
        `// If you know the API, feel free to make changes by hand.`,
        `// Just be sure to put @START and @END sigils in the right places.`,
        `// Otherwise, changes made from the front end may not render properly.`,
        ``,
        `import { Component } from '../Robi.js'`,
        ``,
        `// @START-File`,
        `/**`,
        ` * `,
        ` * @param {Object} param - Object passed in as only argument to a Robi component`,
        ` * @param {(Object | HTMLElement | String)} param.parent - A Robi component, HTMLElement, or css selector as a string. `,
        ` * @param {String} param.position - Options: beforebegin, afterbegin, beforeend, afterend.`,
        ` * @returns {Object} - Robi component.`,
        ` */`,
        `export function ${name}(param) {`,
        `    const {`,
        `        parent,`,
        `        position`,
        `    } = param;`,
        ``,
        `    const component = Component({`,
        `        html: /*html*/ \``,
        `            <div class=''>`,
        ``,
        `            </div>`,
        `        \`,`,
        `        style: /*css*/ \``,
        `            #id {`,
        ``,
        `            }`,
        `        \`,`,
        `        parent,`,
        `        position,`,
        `        events: [`,
        `            {`,
        `                selector: '#id',`,
        `                event: 'click',`,
        `                listener(event) {`,
        `                    console.log(\`\${component.get().id} clicked\`);`,
        `                }`,
        `            }`,
        `        ],`,
        `        onAdd() {`,
        ``,
        `        }`,
        `    });`,
        ``,
        `    return component;`,
        `}`,
        `// @END-File`,
        ``
    ].join('\n');
}
// @END-File
