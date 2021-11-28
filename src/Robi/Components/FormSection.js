import { Get } from '../Actions/Get.js'
import { Style } from '../Actions/Style.js'
import { Alert } from './Alert.js'
import { BootstrapDropdown } from './BootstrapDropdown.js'
import { Container } from './Container.js'
import { LinksField } from './LinksField.js'
import { MultiChoiceField } from './MultiChoiceField.js'
import { MultiLineTextField } from './MultiLineTextField.js'
import { NumberField } from './NumberField.js'
import { SingleLineTextField } from './SingleLineTextField.js'
import { TaggleField } from './TaggleField.js'
import { AttachmentsContainer } from './AttachmentsContainer.js'
import { App, Store } from '../Core.js'

/**
 *
 * @param {*} param
 */
export function FormSection(param) {
    const { section, listInfo, item, parent: parentConatiner, heading } = param;
    const { name, path, info, rows } = section;
    const { list, fields } = listInfo;

    const parent = Container({
        display: 'block',
        width: '100%',
        padding: '0px 0px 30px 0px',
        parent: parentConatiner
    });

    parent.add();

    if (heading) {
        const sectionTitle = Alert({
            type: 'robi-primary',
            width: '100%',
            text: /*html*/ `
                <h6 class='mb-0'>${heading}</h6>
            `,
            parent
        });

        sectionTitle.add();
    }

    if (section.info) {
        const infoAlert = Alert({
            type: 'robi-secondary',
            text: info,
            margin: '0px 20px 20px 20px',
            parent
        });

        infoAlert.add();
    }

    // TODO: Pass form name in, this is supposed to be generic
    const formData = item ? Store.getData(`edit measure ${item.Id}`) : Store.getData('new measure');

    console.log('Form Data:', formData);

    let components = [];

    rows.forEach(row => {
        const { name: rowName, fields: rowFields, description: rowDescription, type } = row;

        // console.log(rowName, rowFields);
        const rowContainer = !type ?
            Container({
                display: 'block',
                width: '100%',
                padding: '10px 20px',
                parent
            }) :
            Alert({
                // width: '100%', // causes node to spill out on the right
                text: /*html*/ `
                    <div class='mb-2'>${rowDescription}</div>
                `,
                margin: '0px 20px 20px 20px',
                type,
                parent
            });

        rowContainer.add();

        if (rowName) {
            rowContainer.append(/*html*/ `
                <div class='mb-1'>
                    <h6 style='color: ${App.get('defaultColor')}; font-weight: 700'>${rowName}</h6>
                </div>
            `);
        }

        const fieldRow = Container({
            display: 'flex',
            align: 'flex-end',
            width: '100%',
            parent: rowContainer
        });

        fieldRow.add();

        Style({
            name: `form-row-${fieldRow.get().id}`,
            style: /*css*/ `
                #${fieldRow.get().id} .form-field {
                    flex: 1;
                }

                #${fieldRow.get().id} .form-field:not(:last-child) {
                    margin-right: 20px;
                }
            `
        });

        rowFields?.forEach(field => {
            const { name, label, style, component: renderComponent, description: customDescription } = field;
            const parent = fieldRow;

            let component = {};

            // Bail out if component
            if (renderComponent) {
                // TODO: generalize properties
                console.log(renderComponent);
                // component = AddFileTypes({
                //     types: formData.FileTypes,
                //     onChange(event) {
                //         formData.FileTypes = component.value();
                //     },
                //     parent
                // });
                // component.add();
            }

            let fieldMargin = '0px';

            if (name === 'Files') {
                component = AttachmentsContainer({
                    label: label || display || name,
                    description: customDescription,
                    // value: formData[name],
                    value: formData.Files,
                    list,
                    itemId: item?.Id,
                    parent,
                    fieldMargin,
                    onChange(files) {
                        console.log('files value', files);
                        formData.Files = files;
                    }
                });
            } else {
                const { display, description: defaultDescription, type, choices, fillIn, action } = fields?.find(item => item.name === name);
                const description = customDescription || defaultDescription;

                switch (type) {
                    case 'slot':
                        let placeholder = '';
                        let addon = '';

                        if (name.toLowerCase().includes('email')) {
                            // placeholder = 'first.mi.last.civ@mail.mil';
                            addon = '@';
                        } else if (name.toLowerCase().includes('name')) {
                            // placeholder = 'First Last'
                        } else if (name.toLowerCase().includes('office')) {
                            // placeholder = 'Example: J-5 AED'
                        }

                        component = SingleLineTextField({
                            label: label || display || name,
                            description,
                            value: formData[name],
                            placeholder,
                            action,
                            addon,
                            parent,
                            fieldMargin,
                            async onKeyup(event) {
                                // Set form data
                                formData[name] = component.value();

                                // Drop down Menu
                                const query = event.target.value;
                                const menu = component.find('.dropdown-menu');

                                console.log(query);

                                if (query) {
                                    if (!menu) {
                                        console.log('add menu');

                                        const height = component.get().offsetHeight;
                                        const width = component.get().offsetWidth;

                                        component.find('.form-control').insertAdjacentHTML('afterend', /*html*/ `
                                            <div class='dropdown-menu show' style='position: absolute; width: ${width}px; inset: 0px auto auto 0px; margin: 0px; transform: translate(0px, ${height + 5}px);'>
                                                <div class='d-flex justify-content-between align-items-center mt-2 mb-2 ml-3 mr-3'>
                                                    <div style='color: ${App.get('primaryColor')};'>Searching for measures with similar names...</div>
                                                    <div class='spinner-grow spinner-grow-sm' style='color: ${App.get('primaryColor')};' role='status'></div>
                                                </div> 
                                            </div>
                                        `);

                                        // Get list items
                                        const listItems = await Get({
                                            list: 'Measures'
                                        });

                                    } else {
                                        console.log('menu already added');
                                    }
                                } else {
                                    if (menu) {
                                        console.log('remove menu');
                                        menu.remove();
                                    } else {
                                        console.log('menu already removed');
                                    }
                                }

                            }
                        });
                        break;
                    case 'mlot':
                        if (name.toLowerCase() === 'tags') {
                            component = TaggleField({
                                label: label || display || name,
                                description,
                                tags: formData[name],
                                parent,
                                fieldMargin,
                                onTagAdd(event, tag) {
                                    // console.log('tags: ', component.value());
                                    // Set form data
                                    formData[name] = component.value();
                                },
                                onTagRemove(event, tag) {
                                    // console.log('tags: ', component.value());
                                    // Set form data
                                    formData[name] = component.value();
                                }
                            });
                        } else if (name.toLowerCase() === 'dashboardlinks' || name.toLowerCase() === 'links') { // TODO: I don't like this, assumes too much
                            component = LinksField({
                                label: label || display || name,
                                links: formData[name],
                                description,
                                parent,
                                fieldMargin,
                                onChange(event) {
                                    // Set form data
                                    formData[name] = JSON.stringify(component.value());
                                }
                            });
                        } else {
                            component = MultiLineTextField({
                                label: label || display || name,
                                value: formData[name],
                                description,
                                parent,
                                fieldMargin,
                                onKeyup(event) {
                                    // Set form data
                                    formData[name] = component.value();
                                }
                            });
                        }

                        break;
                    case 'number':
                        component = NumberField({
                            label: label || display || name,
                            description,
                            fieldMargin,
                            parent
                        });
                        break;
                    case 'choice':
                        component = BootstrapDropdown({
                            label: label || display || name,
                            description,
                            value: formData[name],
                            options: choices.map(choice => {
                                return {
                                    label: choice
                                };
                            }),
                            parent,
                            fieldMargin,
                            action(event) {
                                formData[name] = component.value();
                            }
                        });
                        break;
                    case 'multichoice':
                        console.log(name);
                        component = MultiChoiceField({
                            label: label || display || name,
                            choices,
                            fillIn,
                            value: formData[name]?.results,
                            parent,
                            fieldMargin,
                            onChange(event) {
                                formData[name] = {
                                    results: component.value()
                                };
                            }
                        });
                        break;
                    default:
                        console.log('missing component for field type: ', type);
                        return;
                }
            }

            // Add to DOM
            component.add();

            if (style) {
                for (const property in style) {
                    // console.log(`${property}: ${style[property]}`);
                    component.get().style[property] = style[property];
                }
            }

            // Push to list of components
            components.push({
                component,
                field
            });
        });
    });
}
