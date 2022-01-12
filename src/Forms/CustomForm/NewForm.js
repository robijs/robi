// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.
// Otherwise, changes made from CLI and GUI tools won't work properly.

import { CreateItem } from '../../Robi/Robi.js'
import { BootstrapDropdown, MultiChoiceField, MultiLineTextField, NumberField, Row, SingleLineTextField } from '../../Robi/RobiUI.js'

// @START-CustomForm
export default async function NewForm({ event, fields, list, modal, parent, table }) {
    console.log(list, 'custom new form');

    // @START-Title
    modal.setTitle('New Item');
    // @END-Title

    // @Start-Props
    const [
        SLOT_props,
        MLOT_props,
        Number_props,
        Choice_props,
        MultiChoice_props,
    ] = fields;
    // @END-Props

    // @START-Fields
    let SLOT_field;
    let MLOT_field;
    let Number_field;
    let Choice_field;
    let MultiChoice_field;
    // @END-Fields

    // @START-Rows
    Row(async (parent) => {
        const { name, display } = SLOT_props

        SLOT_field = SingleLineTextField({
            label: display || name,
            fieldMargin: '0px',
            parent
        });

        SLOT_field.add();
    }, { parent });
    // @Row
    Row(async (parent) => {
        const { name, display } = MLOT_props

        MLOT_field = MultiLineTextField({
            label: display || name,
            fieldMargin: '0px',
            parent
        });

        MLOT_field.add();
    }, { parent });
    // @Row
    Row(async (parent) => {
        const { name, display } = Number_props

        Number_field = NumberField({
            label: display || name,
            fieldMargin: '0px',
            parent
        });

        Number_field.add();
    }, { parent });
    // @Row
    Row(async (parent) => {
        const { name, display, value, choices } = Choice_props

        Choice_field = BootstrapDropdown({
            label: display || name,
            fieldMargin: '0px',
            value: value || '',
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
            fieldMargin: '0px',
            choices,
            fillIn,
            parent
        });

        MultiChoice_field.add();
    }, { parent });
    // @END-Rows

    // @START-Return
    return {
        async onCreate(event) {
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

            const newItem = await CreateItem({
                list,
                data
            });

            return newItem;
        },
        label: 'Create'
    };
    // @END-Return
}
// @END-CustomForm