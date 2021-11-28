import { Component } from '../Actions/Component.js'

/**
 *
 * @param {*} param
 * @returns
 */
export function LoadingSpinner(param) {
    const {
        font, type, message, classes, parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='loading-spinner w-100 d-flex flex-column justify-content-center align-items-center ${classes?.join(' ')}'>
                <div class="mb-2" style='font-weight: 600; color: darkgray'>${message || 'Loading'}</div>
                <div class="spinner-grow ${type ? `text-${type}` : ''}" style='color: darkgray' role="status"></div>
            </div>
        `,
        style: /*css*/ `
            #id * {
                color: inherit;
            }
        
            ${font ?
            /*css */ `
                    #id * {
                        font-family: ${font}
                    }
                ` :
                ''}
        `,
        parent,
        position,
        events: []
    });

    return component;
}
