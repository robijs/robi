// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made with CLI and GUI tools will not render properly.

import { UpdateItem, DeleteItem } from '../../Robi/Robi.js'
import { BootstrapDropdown, MultiChoiceField, MultiLineTextField, NumberField, Row, SingleLineTextField } from '../../Robi/RobiUI.js'

// @START-CustomForm
export default async function EditForm({ event, fields, item, list, modal, parent, table }) {
    console.log(list, 'custom edit form');

   const [
        SLOT_props,
        MLOT_props,
        Number_props,
        Choice_props,
        MultiChoice_props,
    ] = fields;

    let SLOT_field;
    let MLOT_field;
    let Number_field;
    let Choice_field;
    let MultiChoice_field;

    // @START-Rows
    Row(async (parent) => {
        const { name, display } = SLOT_props

        SLOT_field = SingleLineTextField({
            label: display || name,
            value: item[name],
            parent
        });

        SLOT_field.add();
    }, { parent });
    // @Row
    Row(async (parent) => {
        const { name, display } = MLOT_props

        MLOT_field = MultiLineTextField({
            label: display || name,
            value: item[name],
            parent
        });

        MLOT_field.add();
    }, { parent });
    // @Row
    Row(async (parent) => {
        const { name, display } = Number_props

        Number_field = NumberField({
            label: display || name,
            value: item[name],
            parent
        });

        Number_field.add();
    }, { parent });
    // @Row
    Row(async (parent) => {
        const { name, display, value, choices } = Choice_props

        Choice_field = BootstrapDropdown({
            label: display || name,
            value: item[name],
            options: choices.map(choice => {
                return {
                    label: choice
                };
            }),
            parent
        });

        Choice_field.add();
    }, { parent });
    // @Row
    Row(async (parent) => {
        const { name, display, choices, fillIn } = MultiChoice_props

        MultiChoice_field = MultiChoiceField({
            label: display || name,
            choices,
            fillIn,
            value: item[name],
            parent
        });

        MultiChoice_field.add();
    }, { parent });
    // @END-Rows

    return {
        async onUpdate(event) {
            const data = {};

            if (SLOT_field.value()) {
                data.SLOT = SLOT_field.value();
            }

            if (MLOT_field.value()) {
                data.MLOT = MLOT_field.value();
            }

            if (Number_field.value()) {
                data.Number = Number_field.value();
            }

            if (Choice_field.value()) {
                data.Choice = Choice_field.value();
            }

            if (MultiChoice_field.value()) {
                data.MultiChoice = MultiChoice_field.value();
            }

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
// @END-CustomForm
