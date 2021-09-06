
/** Actions */
import Component from '../Actions/Action_Component.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

export default function Component_AppContainer() {
    const component = Component({
        html: /*html*/ `
            <div class='appcontainer'></div>
        `,
        style: /*css*/ `
            .appcontainer {
                display: none;
            }

            *, html {
                font-family: ${Setting_App.fontFamily || ` -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`};
                box-sizing: border-box;
                color: ${Setting_App.primaryColor};
            }
            
            body {
                padding: 0px;
                margin: 0px;
                box-sizing: border-box;
                background: ${Setting_App.secondaryColor};
                overflow: hidden;
            }
            
            body::-webkit-scrollbar { 
                display: none; 
            }
            
            ::-webkit-scrollbar {
                width: 10px;
                height: 10px;
            }
            
            ::-webkit-scrollbar-track {
                background: inherit;
            }
            
            ::-webkit-scrollbar-thumb {
                background: ${Setting_App.primaryColor};
                width: 8px;
                height: 8px;
                border: 3px solid transparent;
                border-radius: 8px;
                background-clip: content-box;
            }
            
            table {
                border-collapse: collapse;
            }
            
            /* Stop Chrome from changing input background color when autocomplete enabled */
            input:-webkit-autofill,
            input:-webkit-autofill:hover, 
            input:-webkit-autofill:focus, 
            input:-webkit-autofill:active  {
                box-shadow: 0 0 0 30px white inset !important;
            }
            
            .highlight {
                background: #fff3d4 !important;
                border-right: solid 3px #f6b73c !important;
            }
            
            .smooth-tranisition {
                transition: all 300ms ease-in-out;
            }

            .icon {
                display: inline-block;
                width: 1em;
                height: 1em;
                stroke-width: 0;
                stroke: ${Setting_App.secondaryColor};
                fill: ${Setting_App.secondaryColor};
            }

            /** Wait */
            .appcontainer.wait,
            .appcontainer.wait * {
                pointer-events: none;
                cursor: wait !important;
            }
        `,
        position: 'afterbegin',
        events: []
    });

    component.wait = (value) => {
        if (value) {
            component.get().classList.add('wait');
        } else {
            component.get().classList.remove('wait');
        }
    }

    return component;
}
