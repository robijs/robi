// This file may be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made from the front end may not render properly.

import { Title } from '../../Robi/RobiUI.js'

// @START-File
export default function MultiWordTitle(param) {
    const {
        parent,
    } = param;

    // @START-ViewTitle
    const routeTitle = Title({
        title: /* @START-Title */'Multi Word Title'/* @END-Title */,
        parent
    });
    // @END-ViewTitle
    
    routeTitle.add();
}
// @END-File
