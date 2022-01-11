// @START-File
/**
 * 
 * @param {*} param0 
 * @returns 
 */
export function NewFormTemplate({ list, display, fields }) {
    if (!list && !fields) {
        return;
    }

    console.log(fields);

    const fieldsToCreate = fields.filter(field => field.name !== 'Id');

    let template = [
        `// This file can be edited programmatically.`,
        `// If you know the API, feel free to make changes by hand.`,
        `// Just be sure to put @START and @END sigils in the right places.`,
        `// Otherwise, changes made with CLI and GUI tools will not render properly.`,
        ``,
        `import { CreateItem } from '../../Robi/Robi.js'`,
        `import { BootstrapDropdown, DateField, MultiLineTextField, NumberField, Row, SingleLineTextField } from '../../Robi/RobiUI.js'`,
        ``,
        `// @START-${list}`,
        `export default async function NewForm({ event, fields, list, modal, parent, table }) {`,
        `    console.log(list, 'new form');`,
        ``,
        `    // @START-Rows`
    ];

    fieldsToCreate?.forEach((field, index) => {
        const { name, display, type, choices, action, value } = field;

        let row = [
            `    Row(async (parent) => {`,
            `        const { name, display, type, choices, action } = field;`
        ];
        let component = [];

        switch (type) {
            case 'slot':
                component = [
                    `        const field_${name} = SingleLineTextField({`,
                    `            label: display || name,`,
                    `            parent`,
                    `        })`
                ];
                break;
            case 'mlot':
                component = [
                    `        const field_${name} = MultiLineTextField({`,
                    `            label: display || name,`,
                    `            parent`,
                    `        })`
                ];
                break;
            case 'number':
                component = [
                    `        const field_${name} = NumberField({`,
                    `            label: display || name,`,
                    `            parent`,
                    `        })`
                ];
                break;
            case 'choice':
                component = [
                    `        const field_${name} = BootstrapDropdown({`,
                    `            label: display || name,`,
                    `            value: value || choices[0],`,
                    `            options: choices.map(choice => {`,
                    `                return {`,
                    `                    label: choice`,
                    `                };`,
                    `            }),`,
                    `            parent`,
                    `        });`,
                ];
                break;
            case 'date':
                component = [
                    `        const field_${name} = DateField({`,
                    `            label: display || name,`,
                    `            parent`,
                    `        })`
                ];
                break;
        }

        row = row.concat(component);
        row = row.concat([
            `    }, { parent });`,
        ]);

        if (index !== fieldsToCreate.length - 1) {
            row.push(`    // @Row`);
        }

        template = template.concat(row);
    });

    template = template.concat([
        `    // @END-Rows`,
        ``,
        `    return {`,
        `        async onCreate(event) {`,
        `            const data = {};`,
    ]);

    fieldsToCreate?.forEach(field => {
        const { name } = field;
        template = template.concat([
            ``,
            `            if (field_${name}.value()) {`,
            `                data[name] = field_${name}.value();`,
            `            }`,
            ``,
        ])
    });

    template = template.concat([
        `            console.log(data);`,
        ``,
        `            const newItem = await CreateItem({`,
        `                list,`,
        `                data`,
        `            });`,
        ``,
        `            return newItem;`,
        `        }`,
        `    };`,
        `}`,
        `// @END-${list}`,
        ``
    ]).join('\n');

    return template;

    // return [
    //     `// This file can be edited programmatically.`,
    //     `// If you know the API, feel free to make changes by hand.`,
    //     `// Just be sure to put @START and @END sigils in the right places.`,
    //     `// Otherwise, changes made with CLI and GUI tools will not render properly.`,
    //     ``,
    //     `import { CreateItem } from '../../Robi/Robi.js'`,
    //     `import { BootstrapDropdown, DateField, MultiLineTextField, NumberField, SingleLineTextField } from '../../Robi/RobiUI.js'`,
    //     ``,
    //     `// @START-${list}`,
    //     `export default async function NewForm({ event, fields, list, modal, parent, table }) {`,
    //     `    console.log(list, 'new form');`,
    //     ``,
    //     `    const fieldsToCreate = fields?.filter(field => field.name !== 'Id');`,
    //     `    const components = fieldsToCreate?.map((field, index) => {`,
    //     `        const { name, display, type, choices, action } = field;`,
    //     `    `,
    //     `        let component = {};`,
    //     `    `,
    //     `        switch (type) {`,
    //     `            case 'slot':`,
    //     `                component = SingleLineTextField({`,
    //     `                    label: display || name,`,
    //     `                    parent`,
    //     `                });`,
    //     `                break;`,
    //     `            case 'mlot':`,
    //     `                component = MultiLineTextField({`,
    //     `                    label: display || name,`,
    //     `                    parent`,
    //     `                });`,
    //     `                break;`,
    //     `            case 'number':`,
    //     `                component = NumberField({`,
    //     `                    label: display || name,`,
    //     `                    parent`,
    //     `                });`,
    //     `                break;`,
    //     `            case 'choice':`,
    //     `                component = BootstrapDropdown({`,
    //     `                    label: display || name,`,
    //     `                    value: choices[0],`,
    //     `                    options: choices.map(choice => {`,
    //     `                        return {`,
    //     `                            label: choice`,
    //     `                        };`,
    //     `                    }),`,
    //     `                    parent`,
    //     `                });`,
    //     `                break;`,
    //     `            case 'date':`,
    //     `                component = DateField({`,
    //     `                    label: display || name,`,
    //     `                    value: '',`,
    //     `                    parent`,
    //     `                });`,
    //     `                break;`,
    //     `        }`,
    //     `    `,
    //     `        component.add();`,
    //     `    `,
    //     `        return {`,
    //     `            component,`,
    //     `            field`,
    //     `        };`,
    //     `    });`,
    //     `    `,
    //     `    return {`,
    //     `        async onCreate(event) {`,
    //     `            const data = {};`,
    //     `    `,
    //     `            components`,
    //     `                .forEach(item => {`,
    //     `                    const { component, field } = item;`,
    //     `                    const { name, type } = field;`,
    //     `    `,
    //     `                    const value = component.value();`,
    //     `    `,
    //     `                    switch (type) {`,
    //     `                        case 'slot':`,
    //     `                        case 'mlot':`,
    //     `                        case 'choice':`,
    //     `                            if (value) {`,
    //     `                                data[name] = value;`,
    //     `                            }`,
    //     `                            break;`,
    //     `                        case 'number':`,
    //     `                            if (value) {`,
    //     `                                data[name] = parseInt(value);`,
    //     `                            }`,
    //     `                            break;`,
    //     `                    }`,
    //     `                });`,
    //     `    `,
    //     `            console.log(data);`,
    //     `    `,
    //     `            const newItem = await CreateItem({`,
    //     `                list,`,
    //     `                data`,
    //     `            });`,
    //     `    `,
    //     `            return newItem;`,
    //     `        }`,
    //     `    };`,
    //     `}`,
    //     `// @END-${list}`,
    //     ``
    // ].join('\n');
}
// @END-File
