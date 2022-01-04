// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made with GUI tools will not render properly.

import { Store } from '../../Robi/Robi.js'
import { IconField, Title } from '../../Robi/RobiUI.js'

// @START-SelectIcon
export default async function SelectIcon(param) {
    const {
        parent,
    } = param;

    // @START-routeTitle
    const routeTitle = Title({
        title: /* @START-Title */'Select Icon'/* @END-Title */,
        parent
    });
    
    routeTitle.add();
    // @END-routeTitle

    const iconField = IconField({
        parent,
        icons: Store.get('svgdefs').getIcons()
    });

    iconField.add();
}
// @END-SelectIcon
