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
        `// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.`,
        `// Otherwise, changes made from CLI and GUI tools won't work properly.`,
        ``,
        `import { CreateItem } from '../../Robi/Robi.js'`,
        `import { ${modules()} } from '../../Robi/RobiUI.js'`,
        ``,
        `// @START-${list}`,
        `export default async function NewForm({ fields, list, modal, parent }) {`,
        `    console.log(list, 'custom new form');`,
        ``,
        `    // @START-Title`,
        `    modal.setTitle('New Item');`,
        `    // @END-Title`,
        ``,
        `    // @Start-Props`,
        `    const [`
    ];

    function modules() {
        return [ 'Row' ].concat(fieldsToCreate.map(field => {
            const {type } = field;

            switch (type) {
                case 'slot':
                    return 'SingleLineTextField';
                case 'mlot':
                    return 'MultiLineTextField';
                case 'number':
                    return 'NumberField';
                case 'choice':
                    return 'ChoiceField';
                case 'multichoice':
                    return 'MultiChoiceField';
                case 'date':
                    return 'DateField';
            }
        })).sort().join(', ');
    }

    template = template.concat(fieldsToCreate.map(field => `        ${field.name}_props,`));

    template = template.concat([
        `    ] = fields;`,
        `    // @END-Props`,
        ``,
        `    // @START-Fields`
    ]);

    template = template.concat(fieldsToCreate.map(field => `    let ${field.name}_field;`));

    template = template.concat([
        `    // @END-Fields`,
        ``,
        `    // @START-Rows`
    ]);

    fieldsToCreate.forEach((field, index) => {
        const { name, display, type, choices, action, value } = field;

        let row = [
            `    Row(async (parent) => {`
        ];
        let component = [];

        switch (type) {
            case 'slot':
                component = [
                    `        const { name, display } = ${name}_props`,
                    ``,
                    `        ${name}_field = SingleLineTextField({`,
                    `            label: display || name,`,
                    `            fieldMargin: '0px',`,
                    `            parent`,
                    `        });`,
                    ``,
                    `        ${name}_field.add();`
                ];
                break;
            case 'mlot':
                component = [
                    `        const { name, display } = ${name}_props`,
                    ``,
                    `        ${name}_field = MultiLineTextField({`,
                    `            label: display || name,`,
                    `            fieldMargin: '0px',`,
                    `            parent`,
                    `        });`,
                    ``,
                    `        ${name}_field.add();`
                ];
                break;
            case 'number':
                component = [
                    `        const { name, display } = ${name}_props`,
                    ``,
                    `        ${name}_field = NumberField({`,
                    `            label: display || name,`,
                    `            fieldMargin: '0px',`,
                    `            parent`,
                    `        });`,
                    ``,
                    `        ${name}_field.add();`
                ];
                break;
            case 'choice':
                component = [
                    `        const { name, display, value, choices } = ${name}_props`,
                    ``,
                    `        ${name}_field = ChoiceField({`,
                    `            label: display || name,`,
                    `            fieldMargin: '0px',`,
                    `            value: value || '',`,
                    `            options: choices.map(choice => {`,
                    `                return {`,
                    `                    label: choice`,
                    `                };`,
                    `            }),`,
                    `            parent`,
                    `        });`,
                    ``,
                    `        ${name}_field.add();`
                ];
                break;
            case 'multichoice':
                component = [
                    `        const { name, display, choices, fillIn } = ${name}_props`,
                    ``,
                    `        ${name}_field = MultiChoiceField({`,
                    `            label: display || name,`,
                    `            fieldMargin: '0px',`,
                    `            choices,`,
                    `            fillIn,`,
                    `            parent`,
                    `        });`,
                    ``,
                    `        ${name}_field.add();`
                ]
                break;
            case 'date':
                component = [
                    `        const { name, display } = ${name}_props`,
                    ``,
                    `        ${name}_field = DateField({`,
                    `            label: display || name,`,
                    `            margin: '0px',`,
                    `            parent`,
                    `        });`,
                    ``,
                    `        ${name}_field.add();`
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
        `    // @START-Return`,
        `    return {`,
        `        async onCreate(event) {`,
        `            let isValid = true;`,
        ``,
        `            const data = {};`,
        ``
    ]);

    fieldsToCreate?.forEach(field => {
        template = template.concat([
            setFieldValue(field),
            ``
        ]);
    });

    function setFieldValue(field) {
        const { type, name } = field;

        switch (type) {
            case 'slot':
            case 'mlot':
            case 'choice':
            case 'date':
                return [
                    `            if (${name}_props.validate) {`,
                    `                const isValidated = validate(${name}_field.value());`,
                    `            `,
                    `                if (isValidated) {`,
                    `                    data.${name} = ${name}_field.value();`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    isValid = false;`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            } else if (value) {`,
                    `                data.${name} = ${name}_field.value();`,
                    `            }`,
                ].join('\n');
            case 'multichoice':
                return [
                    `            if (${name}_props.validate) {`,
                    `                const isValidated = validate(${name}_field.value());`,
                    `            `,
                    `                if (isValidated) {`,
                    `                    data.${name} = {`,
                    `                        results: ${name}_field.value()`,
                    `                    }`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    isValid = false;`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            } else if (value) {`,
                    `                data.${name} = {`,
                    `                    results: ${name}_field.value()`,
                    `                }`,
                    `            }`,
                ].join('\n');
            case 'number':
                return [
                    `            if (${name}_props.validate) {`,
                    `                const isValidated = validate(${name}_field.value());`,
                    `            `,
                    `                if (isValidated) {`,
                    `                    data.${name} = ${name}_field.value();`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    isValid = false;`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            } else if (value) {`,
                    `                data.${name} = parseInt(${name}_field.value());`,
                    `            }`,
                ].join('\n');
        }
    }

    template = template.concat([
        `            console.log(isValid, data);`,
        ``,
        `            if (!isValid) {`,
        `                return false;`,
        `            }`,
        ``,
        `            const newItem = await CreateItem({`,
        `                list,`,
        `                data`,
        `            });`,
        ``,
        `            return newItem;`,
        `        },`,
        `        label: 'Create'`,
        `    };`,
        `    // @END-Return`,
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
    //     `import { ChoiceField, DateField, MultiLineTextField, NumberField, SingleLineTextField } from '../../Robi/RobiUI.js'`,
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
    //     `                component = ChoiceField({`,
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
