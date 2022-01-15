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
        const { name, display, type, choices, action, value, fillIn } = field;

        let component = {};

        switch (type) {
            case 'slot':
                component = SingleLineTextField({
                    label: display || name,
                    parent
                });
                break;
            case 'mlot':
                component = MultiLineTextField({
                    label: display || name,
                    parent
                });
                break;
            case 'number':
                component = NumberField({
                    label: display || name,
                    parent
                });
                break;
            case 'choice':
                component = ChoiceField({
                    label: display || name,
                    value: choices[0],
                    options: choices.map(choice => {
                        return {
                            label: choice
                        };
                    }),
                    parent
                });
                break;
            case 'multichoice':
                component = MultiChoiceField({
                    label: display || name,
                    fillIn,
                    choices,
                    parent
                });
                break;
            case 'date':
                component = DateField({
                    label: display || name,
                    value: '',
                    parent
                });
                break;
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
                                        data[name] = value;
                                    } else {
                                        component.invalid();
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

            return;

            const newItem = await CreateItem({
                list,
                data
            });

            return newItem;
        }
    };
}
// @END-File
