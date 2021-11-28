/**
 * 
 * @param {*} param 
 */
export function Style(param) {
    const {
        name,
        style
    } = param;

    const node = document.querySelector(`style[data-name='${name}']`);

    if (node) {
        node.remove();
    }

    const css = /*html*/ `
        <style type='text/css' data-name='${name || id}'>
            ${style}
        </style>
    `;
    const head = document.querySelector('head');

    head.insertAdjacentHTML('beforeend', css);
}