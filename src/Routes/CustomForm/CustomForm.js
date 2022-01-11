// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made with GUI tools will not render properly.

import { App, CustomNewForm, CustomEditForm, NewFormTemplate, EditFormTemplate } from '../../Robi/Robi.js'
import { Row, Table } from '../../Robi/RobiUI.js'

// @START-CustomForm
export default async function CustomForm({ parent }) {
    // @START-Rows
    Row(async (parent) => {
        const { list, display, fields } = App.list('CustomForm');
        // const newForm = NewFormTemplate({ list, display, fields });

        // console.log(newForm);

        const editForm = EditFormTemplate({ list, display, fields });

        console.log(editForm);
    });
    // @Row
    Row(async (parent) => {
        await Table({
            list: 'CustomForm',
            parent,
            advancedSearch: true,
            toolbar: [
                {
                    label: 'All',
                    filter(data) {
                        return data;
                    }
                }
            ]
        });
    });
    // @END-Rows
}
// @END-CustomForm
