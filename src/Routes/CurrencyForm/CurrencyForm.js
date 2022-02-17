// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.
// Otherwise, changes made from CLI and GUI tools won't work properly.

import { App } from '../../Robi/Robi.js'
import { Row, Table } from '../../Robi/RobiUI.js'

// @START-CurrencyForm
export default async function CurrencyForm({ parent }) {
    // @START-Rows
    Row(async (parent) => {
        console.log(App.lists());

        await Table({
            list: 'Date',
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
// @END-CurrencyForm
