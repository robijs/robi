// This file may be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made from the front end may not render properly.

import { Title } from '../../Robi/RobiUI.js'

// @START-ChangeTheme
export default function ChangeTheme(param) {
    const {
        parent,
    } = param;

    // @START-routeTitle
    const routeTitle = Title({
        title: /* @START-Title */'Change Theme'/* @END-Title */,
        parent
    });
    // @END-routeTitle
    
    routeTitle.add();
}
// @END-ChangeTheme
