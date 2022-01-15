import { CreateItem } from '../Actions/CreateItem.js'
import { ChoiceField } from './ChoiceField.js'
import { DateField } from './DateField.js'
import { MultiLineTextField } from './MultiLineTextField.js'
import { MultiChoiceField } from './MultiChoiceField.js'
import { NumberField } from './NumberField.js'
import { SingleLineTextField } from './SingleLineTextField.js' 

// @START-File
/**
 * 
 * @param {*} param
 * @returns 
 */
export async function NewForm({ event, fields, list, modal, parent, table }) {
    const fieldsToCreate = fields?.filter(field => field.name !== 'Id');
    const components = fieldsToCreate?.map((field, index) => {
        const { name, display, type, value, validate, choices, fillIn } = field;

        let component = {};

        switch (type) {
            case 'slot':
                component = SingleLineTextField({
                    label: display || name,
                    value,
                    parent,
                    onKeydown() {
                        console.log('down');
                    },
                    onFocusout
                });
                break;
            case 'mlot':
                component = MultiLineTextField({
                    label: display || name,
                    value,
                    parent,
                    onFocusout
                });
                break;
            case 'number':
                component = NumberField({
                    label: display || name,
                    value,
                    parent,
                    onFocusout
                });
                break;
            case 'choice':
                component = ChoiceField({
                    label: display || name,
                    value,
                    options: choices.map(choice => {
                        return {
                            label: choice
                        };
                    }),
                    parent,
                    onFocusout
                });
                break;
            case 'multichoice':
                component = MultiChoiceField({
                    label: display || name,
                    value,
                    fillIn,
                    choices,
                    parent,
                    onFocusout
                });
                break;
            case 'date':
                component = DateField({
                    label: display || name,
                    value,
                    parent,
                    onFocusout
                });
                break;
        }

        function onFocusout() {
            return !validate ? undefined : () => {
                const value = component.value();
    
                if (validate(value)) {
                    component.isValid(true);
                } else {
                    component.isValid(false);
                }
            }
        }

        component.add();

        return {
            component,
            field
        };
    });

    return {
        async onCreate(event) {
            const data = {};

            components
                .forEach(item => {
                    const { component, field } = item;
                    const { name, type, validate } = field;

                    const value = component.value();

                    switch (type) {
                        case 'slot':
                        case 'mlot':
                        case 'choice':
                        case 'date':
                            if (value) {
                                if (validate) {
                                    const isValidated = validate(value);

                                    if (isValidated) {
                                        component.isValid(true);
                                        data[name] = value;
                                    } else {
                                        component.isValid(false);
                                    }
                                } else {
                                    data[name] = value;
                                }
                            }
                            break;
                        case 'multichoice':
                            if (value) {
                                data[name] = {
                                    results: value
                                }
                            }
                            break;
                        case 'number':
                            if (value) {
                                data[name] = parseInt(value);
                            }
                            break;
                    }
                });

            console.log(data);

            return false;

            const newItem = await CreateItem({
                list,
                data
            });

            return newItem;
        }
    };
}
// @END-File
