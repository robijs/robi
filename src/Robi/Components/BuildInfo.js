import { Get } from '../Core/Actions.js';
import { Card, SingleLineTextField } from './Components.js';
import { App } from './Settings.js';

/**
 *
 * @param {*} param
 */

export async function BuildInfo(param) {
    const {
        parent,
    } = param;

    const accountInfoCard = Card({
        title: 'Build',
        titleColor: App.get('primaryColor'),
        width: '100%',
        margin: '20px 0px 0px 0px',
        parent
    });

    accountInfoCard.add();
    // Show loading
    parent.append(/*html*/ `
        <div class='loading-spinner w-100 d-flex flex-column justify-content-center align-items-center'>
            <div class="mb-2" style='font-weight: 600; color: darkgray'>Loading build</div>
            <div class="spinner-grow" style='color: darkgray' role="status"></div>
        </div>
    `);

    // Settings
    const appSettings = await Get({
        list: 'Settings',
        filter: `Key eq 'Build' or Key eq 'Version'`
    });

    // Remove loading
    parent.find('.loading-spinner').remove();

    // Version
    const nameField = SingleLineTextField({
        label: 'Version',
        value: appSettings.find(item => item.Key === 'Version')?.Value,
        readOnly: true,
        fieldMargin: '10px 0px 0px 0px',
        parent: accountInfoCard
    });

    nameField.add();

    // Build
    const accountField = SingleLineTextField({
        label: 'Build',
        value: appSettings.find(item => item.Key === 'Build')?.Value,
        readOnly: true,
        fieldMargin: '0px 0px 0px 0px',
        parent: accountInfoCard
    });

    accountField.add();
}
