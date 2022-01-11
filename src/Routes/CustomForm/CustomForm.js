// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made with GUI tools will not render properly.

import { App, CustomNewForm, CustomEditForm } from '../../Robi/Robi.js'
import { Row, Table } from '../../Robi/RobiUI.js'

// @START-CustomForm
export default async function CustomForm({ parent }) {
    // @START-Rows
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
    // @Row
    Row(async (parent) => {

    });
    // @END-Rows
}
// @END-CustomForm
