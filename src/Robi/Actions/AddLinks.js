import { App } from '../Core.js'

// @START
/**
 * 
 * @param {*} param 
 * @returns 
 */
export function AddLinks(param) {
    const {
        links,
    } = param;

    const head = document.querySelector('head');

    if (!links) {
        return;
    }

    links.forEach(link => head.append(createLinkElement(link)));

    function createLinkElement(link) {
        const {
            rel,
            as,
            href,
            path
        } = link;

        const linkElement = document.createElement('link');

        linkElement.setAttribute('rel', rel || 'stylesheet');

        if (as) {
            linkElement.setAttribute('as', as);
        }

        const relativePath = App.get('mode') === 'prod' ? `${App.get('site')}/${App.get('library')}/src` : `/src/`;

        // TODO: default relative path might not be right, test locally and on SP
        linkElement.setAttribute('href', `${path || relativePath}${href}`);

        return linkElement;
    }
}
