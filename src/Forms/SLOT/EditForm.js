// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made with CLI and GUI tools will not render properly.

import { UpdateItem } from '../../Robi/Robi.js'
import { ChoiceField, DateField, MultiLineTextField, NumberField, SingleLineTextField } from '../../Robi/RobiUI.js'

// @START-SLOT
export default async function EditForm({ event, fields, item, list, modal, parent, table }) {
    console.log(list, 'edit form');

    const fieldsToCreate = fields?.filter(field => field.name !== 'Id');
    const components = fieldsToCreate?.map((field, index) => {
        const { name, display, type, choices, action } = field;
    
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
        async onUpdate(event) {
            const data = {};

            components
                .forEach(item => {
                    const { component, field } = item;
                    const { name, type } = field;

                    const value = component.value();

                    switch (type) {
                        case 'slot':
                        case 'mlot':
                        case 'choice':
                            if (value) {
                                data[name] = value;
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

            const updatedItem = await UpdateItem({
                list,
                itemId: item.Id,
                data
            });

            return updatedItem;
        },
        async onDelete(event) {
            const deletedItem = await DeleteItem({
                list,
                itemId: item.Id
            });

            return deletedItem;
        }
    };
}
// @END-SLOT
