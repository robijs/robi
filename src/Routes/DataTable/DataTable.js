// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made with GUI tools will not render properly.

import { App } from '../../Robi/Robi.js';
import { Title } from '../../Robi/RobiUI.js'

// @START-DataTable
export default async function DataTable(param) {
    const {
        parent,
    } = param;

    // @START-routeTitle
    const routeTitle = Title({
        title: /* @START-Title */'Data Table'/* @END-Title */,
        parent
    });

    routeTitle.add();
    // @END-routeTitle
}

// NOTE: Search service only returns what's been crawled. Not real time.
// NOTE: Instead, if someone what's to search 100+ columns, we can build multiple REST queries up to the URL char limit. Then concat the results. Slower, but it'll work.

// @END-DataTable
