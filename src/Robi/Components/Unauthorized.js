import { Alert } from './Alert.js'

// @START-File
/**
 * 
 * @param {*} param 
 */
export async function Unauthorized({ parent }) {
    const alertBanner = Alert({
        type: 'warning',
        text: `Sorry! You don't have access to this page. Please select a different option from the menu on the left.`,
        parent,
        margin: '20px 0px 0px 0px'
    });

    alertBanner.add();
}
// @END-File
