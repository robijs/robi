// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made with GUI tools will not render properly.

import { Title, ChangeTheme as theme } from '../../Robi/RobiUI.js'

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
    
    routeTitle.add();
    // @END-routeTitle
    
    // @START-Component-ChangeTheme
    theme({
        parent
    });
    // @END-Component-ChangeTheme
}
// @END-ChangeTheme
