// This file may be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.
// Otherwise, changes made from CLI and GUI tools may break this file.

// @START-Imports
import { GetArticle } from '../../Robi/Robi.js'
import { Row } from '../../Robi/RobiUI.js'
// @END-Imports

// @START-Robi
export default async function Robi({ parent }) {
    // @START-Rows
    Row(async (parent) => {
        const md = await GetArticle({
            path: '../src/Routes/Robi/Articles',
            name: 'Test'
        });
        
        parent.append(md);
    }, { parent });
    // @END-Rows
}
// @END-Robi
