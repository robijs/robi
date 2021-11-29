import { HSLDarker } from '../Actions/Colors.js';
import { Component } from '../Actions/Component.js'
import { App } from '../Core.js';

/**
 *
 * @returns
 */
export function AppContainer() {
    const component = Component({
        html: /*html*/ `
            <div class='appcontainer'></div>
        `,
        style: /*css*/ `
            .appcontainer {
                display: none;
                background: ${App.get('secondaryColor')};
            }

            *, html {
                font-family: ${App.fontFamily || ` -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`};
                box-sizing: border-box;
                color: ${App.get('defaultColor')};
            }
            
            body {
                padding: 0px;
                margin: 0px;
                box-sizing: border-box;
                background: ${App.get('secondaryColor')};
                overflow: hidden;
            }
            
            body::-webkit-scrollbar { 
                display: none; 
            }
            
            ::-webkit-scrollbar {
                width: 12px;
                height: 12px;
            }
            
            ::-webkit-scrollbar-track {
                background: inherit;
            }
            
            ::-webkit-scrollbar-thumb {
                background: gray;
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
            }

            /** Wait */
            .appcontainer.wait,
            .appcontainer.wait * {
                pointer-events: none;
                cursor: wait !important;
            }

            /* Override default Bootstrap Alert */
            #id .alert {
                font-size: 14px;
                border-radius: 10px;
                border: none;
            }
            
            @keyframes fade-in-bottom {
                0% {
                    bottom: -10px;
                    transform: scale(.5);
                    opacity: 0;
                }
            
                100% {
                    bottom: 10px;
                    transform: scale(1);
                    opacity: 1;
                }
            }

            /* Overrides */
            .btn {
                font-size: 14px;
                border-radius: 10px;
            }

            .btn:focus,
            .btn:active {
                box-shadow: none !important;
            }

            .btn-primary {
                background-color: royalblue !important;
                border-color: royalblue !important;
            }

            .btn-primary:hover {
                background-color: royalblue !important;
                border-color: royalblue !important;
            }

            .btn-primary:active,
            .btn-primary:focus {
                background-color: royalblue !important;
                border-color: royalblue !important;
            }

            /* Robi buttons */
            .btn-robi-reverse,
            .btn-robi-reverse:hover {
                background: ${App.get('primaryColor')};
                color: white !important;
                font-weight: 500;
            }

            .btn-robi,
            .btn-robi:hover {
                color: ${App.get('primaryColor')};
                background: #e9ecef;
                font-weight: 500;
            }

            .btn-robi-success,
            .btn-robi-success:hover {
                color: seagreen;
                background: #e9ecef;
                font-weight: 500;
            }

            .btn-light:hover {
                color: #212529 !important;
                background-color: #f8f9fa !important;
                border-color: #f8f9fa !important;
            }

            .btn-light:active,
            .btn-light:focus {
                color: #212529 !important;
                background-color: #f8f9fa !important;
                border-color: #f8f9fa !important;
            }

            .btn-outline-primary {
                color: royalblue !important;
                border-color: royalblue !important;
            }

            .btn-outline-primary:hover {
                background-color: initial !important;
                color: royalblue !important;
                border-color: royalblue !important;
            }

            .btn-success {
                background-color: seagreen !important;
                border-color: seagreen !important;
            }

            .btn-success:hover {
                background-color: seagreen !important;
                border-color: seagreen !important;
            }

            .btn-success:active,
            .btn-success:focus {
                background-color: seagreen !important;
                border-color: seagreen !important;
            }

            .btn-danger {
                background-color: firebrick !important;
                border-color: firebrick !important;
            }

            .btn-danger:hover {
                background-color: firebrick !important;
                border-color: firebrick !important;
            }

            .btn-danger:active,
            .btn-danger:focus {
                background-color: firebrick !important;
                border-color: firebrick !important;
            }

            .btn-outline-danger {
                color: firebrick !important;
                border-color: firebrick !important;
            }

            .btn-outline-danger:hover {
                color: firebrick !important;
                border-color: firebrick !important;
            }

            .btn-outline-success {
                color: seagreen !important;
                border-color: seagreen !important;
            }

            .btn-outline-success:hover {
                color: seagreen !important;
                border-color: seagreen !important;
            }

            .form-control,
            .form-field-multi-line-text.editable,
            .btn.dropdown-toggle,
            .input-group-text {
                font-size: 13px !important;
            }

            .form-control,
            .form-field-multi-line-text.editable,
            .btn.dropdown-toggle {
                border-radius: 10px !important;
            }

            .input-group .input-group-text {
                border-radius: 10px 0px 0px 10px !important;
            }

            .input-group .form-control {
                border-radius: 0px 10px 10px 0px !important;
            }

            .form-control:not(.custom-select):focus {
                border-color: transparent !important;
                box-shadow: 0 0 0 3px ${App.get('primaryColor') + '6b'} !important;
            }

            .form-field-multi-line-text.editable:focus,
            .btn.dropdown-toggle:focus {
                border-color: transparent !important;
                box-shadow: 0 0 0 4px ${App.get('primaryColor') + '6b'} !important;
            }

            /* Override bootstrap alert style */
            .alert {
                border: none;
                border-radius: 10px;
            }

            .alert-robi-primary {
                background: ${App.get('primaryColor') + '20'} !important;
                color: hsl(${HSLDarker(App.get('primaryColorHSL'), 5)}) !important;
            }

            .alert-robi-primary *:not(.btn) {
                color: hsl(${HSLDarker(App.get('primaryColorHSL'), 5)}) !important;
            }

            .alert-robi-secondary {
                background: ${App.get('backgroundColor')} !important;
                color: ${App.get('defaultColor')} !important;
            }

            .alert-robi-secondary *:not(.btn) {
                color: ${App.get('defaultColor')} !important;
            }
            
            /* Override bootstrap drop down style */
            .dropdown-item {
                cursor: pointer;
            }

            .dropdown-item:active {
                color: initial;
                background-color: initial;
            }
            
            /** Bootstrap badge colors */
            .badge-success {
                background: seagreen !important;
            }

            /* Robi text */
            .text-robi {
                color: ${App.get('primaryColor')} !important;
            }

            /** Code mirror */
            .CodeMirror * {
                color: unset;
                font-family: 'Inconsolata', monospace;
                font-size: 14px;
            }

            .robi-code-background {
                background: #292D3E;
            }

            .loading-file {
                font-family: 'Inconsolata', monospace;    
            }

            .file-title {
                width: 100%;
                background-color: #292D3E;
                display: flex;
                align-items: center;
                /* justify-content: space-between; */
                /* border-bottom: solid 1px #676E95; */
                /* padding-top: 1rem; */
                padding-bottom: .75rem;
                /* margin-bottom: .75rem; */
                /* z-index: 100; */
                /* position: sticky; */
                /* top: 0px; */
            }

            .file-title * {
                font-family: 'Inconsolata', monospace; 
                font-size: 14px;
                color: white;
            }

            .file-icon-container {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 10px;
                margin-left: .75rem;
            }

            .file-icon {
                font-size: 16px;
            }

            .file-icon-css {
                fill: dodgerblue !important;
            }

            .file-icon-html {
                fill: dodgerblue !important;
            }

            .file-icon-js {
                fill: #F7DF1E !important;
            }

            /* Add padding to all modals */
            /* .modal-content {
                padding: 30px;
            } */

            /* Intl Tel Input */
            .iti__flag {background-image: url('./Images/flags.png');}

            @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
                .iti__flag {background-image: url('./Images/flags@2x.png');}
            }

            /* Install Console */
            .console {
                width: 100%;
                height: 100%;
                overflow: overlay;
                background: #1E1E1E;
            }

            .console * {
                color: #CCCCCC !important;
            }

            .console-title {
                font-family: 'M PLUS Rounded 1c', sans-serif; /* FIXME: experimental */
            }

            .line-number {
                display: inline-block;
                font-weight: 600;
                width: 30px;
            }

            .install-modal {
                padding: 60px;
            }

            .install-alert {
                left: 10px;
                right: 10px;
                bottom: 10px;
                border-radius: 10px;
                padding: 10px 15px;
                border: none;
                background: #1E1E1E;
                color: white !important;
                animation: fade-in-bottom 200ms ease-in-out forwards;
            };

            .install-alert * {
                color: white !important;
            };

            @keyframes fade-alert {
                0% {
                    bottom: -10px;
                    transform: scale(.5);
                    opacity: 0;
                }

                100% {
                    bottom: 10px;
                    transform: scale(1);
                    opacity: 1;
                }
            }

            /* Dialog boxes */
            @keyframes dialog-fade {
                0% {
                    transform: scale(.5);
                    opacity: 0;
                }

                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            .dialog-box {
                animation: dialog-fade 200ms ease-in-out forwards;
            }

            /* Taggle */
            @keyframes bounce {
                0%,
                20%,
                50%,
                80%,
                100% {
                    -webkit-transform: translateY(0);
                    transform: translateY(0);
                }
                40% {
                    -webkit-transform: translateY(-16px);
                    transform: translateY(-16px);
                }
                60% {
                    -webkit-transform: translateY(-7px);
                    transform: translateY(-7px);
                }
            }

            .bounce {
                -webkit-animation-name: bounce;
                animation-name: bounce;
            }

            /* Shrink app */
            @keyframes shrink-app {
                from {
                    transform: scale(1);
                }

                to {
                    transform: scale(.92);
                }
            }

            .shrink-app {
                animation: 400ms ease-in-out forwards shrink-app;
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
    };

    return component;
}
