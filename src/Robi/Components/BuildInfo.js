import { Get } from '../Actions/Get.js'
import { Container } from './Container.js';
import { LoadingSpinner } from './LoadingSpinner.js' 
import { SingleLineTextField } from './SingleLineTextField.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function BuildInfo(param) {
    const {
        parent,
    } = param;

    const card = Container({
        width: '100%',
        direction: 'column',
        padding: '0px 20px',
        height: '100px',
        parent
    });

    card.add();

    // Show loading
    const loadingIndicator = LoadingSpinner({
        message: 'Loading robi build',
        type: 'robi',
        parent: card
    });

    loadingIndicator.add();

    // Settings
    const appSettings = await Get({
        list: 'Settings',
        filter: `Key eq 'Build' or Key eq 'Version'`
    });

    // Remove loading
    loadingIndicator.remove();

    // Version
    const nameField = SingleLineTextField({
        label: 'Version',
        value: appSettings.find(item => item.Key === 'Version')?.Value,
        readOnly: true,
        parent: card
    });

    nameField.add();

    // Build
    const accountField = SingleLineTextField({
        label: 'Build',
        value: appSettings.find(item => item.Key === 'Build')?.Value,
        readOnly: true,
        fieldMargin: '0px 0px 20px 0px',
        parent: card
    });

    accountField.add();
}
// @END-File
