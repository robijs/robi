// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.
// Otherwise, changes made from CLI and GUI tools won't work properly.

import { CreateItem } from '../../Robi/Robi.js'
import { MultiLineTextField, Row, SingleLineTextField } from '../../Robi/RobiUI.js'

// @START-SLOT
export default async function NewForm({ event, fields, list, modal, parent, table }) {
    console.log(list, 'custom new form');

    // @START-Title
    modal.setTitle('New Item');
    // @END-Title

    // @Start-Props
    const [
        SLOT_props,
    ] = fields;
    // @END-Props

    // @START-Fields
    let SLOT_field;
    let custom_field;
    // @END-Fields

    // @START-Rows
    Row(async (parent) => {
        custom_field = MultiLineTextField({
            label: 'Notes',
            fieldMargin: '0px',
            parent
        });

        custom_field.add();
    }, { parent });
    // @Row
    Row(async (parent) => {
        const { name, display } = SLOT_props

        SLOT_field = SingleLineTextField({
            label: display || name,
            fieldMargin: '0px',
            parent
        });

        SLOT_field.add();
    }, { parent });
    // @END-Rows

    // @START-Return
    return {
        async onCreate(event) {
            const data = {};

            if (SLOT_field.value()) {
                data.SLOT = SLOT_field.value();
            }

            // if (custom_field.value()) {
            //     data.SLOT = custom_field.value();
            // }

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
// @END-SLOT
