import { Alert } from '../Components/Alert.js'

// @START-File
/**
 * 
 * @param {Object} param - Interface to this Robi action
 */
export function FieldMessage({ field, message, ctr }) {
    const className = `field-message-${field.id()}`;
    const node = document.querySelector(`.${className}`);

    if (!node) {
        const alert = Alert({
            type: 'robi-reverse',
            text: message,
            classes: ['alert-in', 'w-100', className],
            top: (ctr || field).get().offsetHeight + 5,
            delay: 4600,
            position: 'beforeend',
            parent: ctr || field
        });

        alert.add();

        setTimeout(() => {
            alert.remove();
        }, 5000);
    } else {
        console.log(`${className} already added`);
    }

    return;
}
// @END-File
