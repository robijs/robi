import { 
    Toast,
    LoadingBar,
    SvgDefs,
    Sidebar,
    AppContainer,
    MainContainer,
    FixedToast,
    Modal,
    BootstrapButton,
    ProgressBar,
    InstallConsole,
    Container,
    LoadingSpinner,
    ViewContainer
} from './Components.js'
import { Lists } from './Models.js'
import { App, Routes } from './Settings.js';
import Store from './Store.js'
import { ReleaseNotes } from './ViewParts.js'
import lists from '../lists.js';

// @START
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
// @END