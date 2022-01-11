// @START-File
/**
 * 
 * @param {*} param0 
 * @returns 
 */
export function FormTemplate({ list, display, fields }) {
    return [
        `// This file can be edited programmatically.`,
        `// If you know the API, feel free to make changes by hand.`,
        `// Just be sure to put @START and @END sigils in the right places.`,
        ``,
        `${list}`,
        `${display}`,
        `${fields}`
    ].join('\n');
}
// @END-File
