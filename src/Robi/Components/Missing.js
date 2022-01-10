import { Alert } from './Alert.js'

// @START-File
/**
 * 
 * @param {*} param 
 */
export async function Missing({ parent }) {
    const alertBanner = Alert({
        type: 'info',
        text: `Sorry! That page doesn't appear to exist. Please choose an option from the sidebar on the left.`,
        parent,
        margin: '20px 0px 0px 0px'
    });

    alertBanner.add();
}
// @END-File
