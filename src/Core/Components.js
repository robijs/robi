import { App } from '../Core/Settings.js'
import Store from './Store.js'
import { Component } from './Actions.js'

export function Toast(param) {
    const {
        text,
        type,
        delay,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='notification ${type || 'information'}'>
                <div>${text}</div>
            </div>
        `,
        style: /*css*/ `
            #id.notification {
                position: fixed;
                z-index: 10000;
                top: 20px;
                right: 5px;
                font-size: 1em;
                padding: 10px 20px;
                max-width: 350px;
                border: 1px solid rgba(0,0,0,.1);
                box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 10%);
                border-radius: 4px;
                animation: slidein 500ms ease-in-out forwards, slidein 500ms ease-in-out ${delay || '5s'} reverse forwards;
            }

            #id.bs-toast {
                background-color: rgba(255,255,255);
                background-clip: padding-box;
                border: 1px solid rgba(0,0,0,.1);
                box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 10%);
            }

            #id.bs-toast-light {
                background-color: rgba(255,255,255,.85);
                background-clip: padding-box;
                border: 1px solid rgba(0,0,0,.1);
                box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 10%);
            }

            #id.success {
                color: white;
                background: mediumseagreen;
            }

            #id.information {
                background: mediumseagreen;
            }

            #id.error {
                background: crimson;
            }

            #id.notification:not(.bs-toast) * {
                color: white;
            }

            #id .dismiss {
                font-size: 1.2em;
                position: absolute;
                top: 3px;
                right: 3px;
            }

            @keyframes slidein {
                from {
                    /* opacity: 0; */
                    transform: translate(400px);
                }

                to {
                    /* opacity: 1; */
                    transform: translate(-10px);
                }
            }
        `,
        position,
        parent,
        events: [
            
        ],
        onAdd() {
            setTimeout(() => {
                component.remove();
            }, delay || 6000);

            const allToasts = Store.get('maincontainer').findAll('.notification');

            if (allToasts.length > 1) {
                component.get().style.top = `${allToasts[allToasts.length - 1].getBoundingClientRect().height + 40}px`;
            }

            console.log(allToasts);
        }
    });

    return component;
}

export function LoadingBar(param) {
    const {
        displayTitle,
        displayLogo,
        displayText,
        parent,
        totalCount
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='loading-bar'>
                <div class='loading-message'>
                    <div class='loading-message-logo'></div>
                    <div class='loading-message-title'>${displayTitle}</div>
                    <div class='loading-message-text'>${displayText}</div>
                    <div class='loading-bar-container'>
                        <div class='loading-bar-status'></div>
                    </div>
                </div>
            </div>
        `,
        style:  /*css*/ `
            .loading-bar {
                display: flex;
                justify-content: center;
                width: 50%;
                height: 100%;
                margin: auto;
                position: fixed;
                top: 0; 
                left: 0; 
                bottom: 100px; /* @hack */ 
                right: 0;
                animation: fadein 350ms ease-in-out forwards;
            }

            .loading-message {
                width: 90%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            .loading-message-title{
                font-size: 5em; /* original value 3em */
                font-weight: 500;
                text-align: center;
            }

            /** TURNED OFF */
            .loading-message-text {
                display: none;
                font-size: 1.5em;
                font-weight: 400;
                text-align: center;
            }

            .loading-bar-container {
                width: 25%; /** original value 15% */
                margin-top: 10px;
                background: lightgray;
                border-radius: 2px;
            }
            
            .loading-bar-status {
                width: 0%;
                height: 8px;
                background: lightslategray;
                border-radius: 2px;
                transition: width 100ms ease-in-out;
            }

            /* Logo */
            .loading-message-logo {
                background: url(${displayLogo}) center;
                background-repeat: no-repeat;
                width: 100%;
                height: 120px;
                background-size: 120px;
            }

            @keyframes fadein {
                from {
                    opacity: 0;
                    transform: scale(0);
                }

                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            .fadeout {
                animation: fadeout 350ms ease-in-out forwards;
            }

            @keyframes fadeout {
                from {
                    opacity: 1;
                    transform: scale(1);
                    
                }

                to {
                    opacity: 0;
                    transform: scale(0);
                }
            }
        `,
        parent: parent,
        position: 'beforeend',
        events: [
            {
                selector: '.loading-bar',
                event: 'listItemsReturned',
                listener() {
                    component.update(++counter);
                }
            }
        ]
    });

    let counter = 1;

    component.update = (param) => {
        const {
            newDisplayText
        } = param;

        const progressBar = component.get();
        const statusBar = progressBar.querySelector('.loading-bar-status');
        const text = progressBar.querySelector('.loading-message-text');
        const percentComplete = (counter / totalCount) * 100;

        if (newDisplayText) {
            text.innerText = newDisplayText;
        }

        if (statusBar) {
            statusBar.style.width = `${percentComplete}%`;
            counter++;
        }
    }

    component.end = () => {
        return new Promise((resolve, reject) => {
            const loadingBar = component.get();

            if (loadingBar) {
                loadingBar.classList.add('fadeout');
        
                loadingBar.addEventListener('animationend', (event) => {
                    loadingBar.remove();
                    resolve(true);
                });
            }
        });
    }

    return component;
}

