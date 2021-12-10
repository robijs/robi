import { Get, CreateItem, Store } from '../../Robi/Robi.js'
import { BootstrapDropdown, DateField, MultiLineTextField, NumberField, SingleLineTextField } from  '../../Robi/RobiUI.js'

/**
 *
 * @param {*} param
 * @returns
 */
export async function NewStep(param) {
    const { event, fields, list, modal, parent, table } = param;

    console.log(param);

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
                component = BootstrapDropdown({
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
        async onCreate(event) {
            // FIXME: don't rely on hacking the url, pass in the itemId
            const MeasureId = parseInt(location.href.split('#')[1].split('/')[1])
            const data = {
                MeasureId
            };

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

            const newItem = await CreateItem({
                list,
                data
            });

            // TODO: Hack. Don't just get all items. Add/remove from store as needed.
            // Get all checklist items
            const checklist = await Get({
                list: 'MeasuresChecklist',
                select: `*,Author/Title,Editor/Title`,
                expand: `File,Author,Editor`,
                filter: `MeasureId eq ${MeasureId}`
            });

            // Set store
            Store.setData(`measure ${MeasureId} checklist`, checklist);

            // TODO: Add to stored checklist items
            return newItem;
        }
    };
}