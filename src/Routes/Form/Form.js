// This file may be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.
// Otherwise, changes made from CLI and GUI tools may break this file.

// @START-Imports
import { } from '../../Robi/Robi.js'
import { Row, Table } from '../../Robi/RobiUI.js'
// @END-Imports

// @START-Form
export default async function Form({ parent }) {
    // @START-Rows
    Row((parent) => {
        Table({
            list: 'AllTypes',
            parent
        });
    }, { parent });
    // @Row
    Row((parent) => {
    
    }, { parent });
    // @END-Rows
}
// @END-Form
