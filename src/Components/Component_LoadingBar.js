/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Components */
import Component from '../Actions/Action_Component.js'

export default function Component_LoadingBar(param) {
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