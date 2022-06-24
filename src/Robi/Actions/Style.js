// @START-File
/**
 * 
 * @param {Object} param
 * @param {String} param.name
 * @param {String} param.style
 * @param {String} param.locked
 * @param {Boolean} param.position
 */
export function Style(param) {
    const {
        name,
        style,
        locked,
        position
    } = param;

    const node = document.querySelector(`style[data-name='${name}']`);

    if (node) {
        const css = /*html*/ `
            <style type='text/css' data-name='${name || id}' data-type='style' data-locked='${locked ? 'yes' : 'no'}'>
                ${style}
            </style>
        `;

        node.insertAdjacentHTML('beforebegin', css);
        node.remove();
    } else {
        const css = /*html*/ `
            <style type='text/css' data-name='${name || id}' data-type='style' data-locked='${locked ? 'yes' : 'no'}'>
                ${style}
            </style>
        `;
        const head = document.querySelector('head');

        head.insertAdjacentHTML(position || 'beforeend', css);
    }
}
// @END-File
