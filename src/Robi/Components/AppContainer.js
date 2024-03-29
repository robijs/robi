import { Component } from '../Core/Component.js'
import { App } from '../Core/App.js'

// @START-File
/**
 *
 * @returns
 */
export function AppContainer() {
    const cancelButton = `background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' style='fill: ${App.get('prefersColorScheme') === 'dark' ? 'darkgray' : 'darkgray' };'><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>");`

    const component = Component({
        name: 'appcontainer',
        html: /*html*/ `
            <div class='appcontainer'></div>
        `,
        style: /*css*/ `
            /* Override html prefers-color-scheme media query in app.aspx */
            /* TODO: Move to style or css file that loads sooner */

            /* NOTE: Testing */

            .custom-control-label::before {
                background-color: var(--secondary);
                border: solid 1px var(--input-border-color);
            }

            body.grabbing * {
                cursor: grabbing !important;
            }

            /* NOTE: END */

            html {
                background: var(--secondary);
            }

            .appcontainer {
                /* FIXME: show immediately */
                display: none;
                background: var(--secondary);
            }
            
            *, ::after, ::before {
                box-sizing: border-box;
            }

            .appcontainer,
            .appcontainer {
                transition: background-color 300ms;
            }
            
            body {
                padding: 0px;
                margin: 0px;
                box-sizing: border-box;
                overflow: hidden;
                font-family: var(--font-family);
                color: var(--color);
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
                background: var(--scrollbar);
                width: 8px;
                height: 8px;
                border: 3px solid transparent;
                border-radius: 8px;
                background-clip: content-box;
            }
            
            table {
                border-collapse: collapse;
            }

            .smooth-tranisition {
                transition: all 300ms ease-in-out;
            }
            
            /* Stop Chrome from changing input background color when autocomplete enabled */
            input:-webkit-autofill,
            input:-webkit-autofill:hover, 
            input:-webkit-autofill:focus, 
            input:-webkit-autofill:active  {
                box-shadow: 0 0 0 30px white inset !important;
            }

            /* Font Weight */
            .font-weight-500 {
                font-weight: 500;
            }

            /* Icon */
            .icon {
                display: inline-block;
                width: 1em;
                height: 1em;
                stroke-width: 0;
            }

            /* Wait */
            .appcontainer.wait,
            .appcontainer.wait * {
                pointer-events: none;
                cursor: wait !important;
            }

            /* Links */
            a:hover {
                color: var(--primary);
                text-decoration: underline;
            }
            
            a {
                color: var(--primary);
                text-decoration: none;
                background-color: transparent;
            }

            /* Code */
            code {
                font-size: 1em;
                color: var(--primary);
            }

            /* Button */
            button:focus {
                outline: none;
            }

            .btn {
                font-size: 14px;
                border-radius: 10px;
                color: var(--color);
            }

            .btn:hover {
                color: var(--color);
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

            .btn-robi-reverse,
            .btn-robi-reverse:hover {
                background: var(--primary);
                color: var(--secondary) !important;
                font-weight: 500;
            }

            .btn-robi,
            .btn-robi:hover {
                color: var(--primary);
                background: var(--button-background);
                font-weight: 500;
            }

            .btn-robi-success,
            .btn-robi-success:hover {
                color: seagreen;
                background: var(--button-background);
                font-weight: 500;
            }

            .btn-robi-light,
            .btn-robi-light:hover {
                color: var(--primary);
                background: inherit;
                font-weight: 500;
            }

            .btn-outline-robi {
                color: var(--primary);
                background-color: initial;
                border-color: var(--primary);
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

            .btn-subtle-primary {
                color: royalblue !important;
                border-color: var(--background) !important;
                background-color: var(--background) !important;
            }

            .btn-subtle-primary:hover {
                color: royalblue !important;
                border-color: var(--background) !important;
                background-color: var(--background) !important;
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

            /* Cards */
            .card-footer {
                border-top: solid 1px var(--border-color);
            }

            /* Form Controls */
            .form-field {
                display: flex;
                flex-direction: column;
                /* justify-content: space-between; */
            }

            .form-field .form-field-description {
                height: 100%;
            }

            .form-control,
            .form-field-multi-line-text.content-editable,
            .btn.dropdown-toggle {
                font-size: 13px !important;
                background: var(--input-background);
            }

            .input-group-text {
                background: var(--background);
                font-size: 13px !important;
            }

            .form-control,
            .form-field-multi-line-text.content-editable,
            .input-group-text {
                border: 1px solid var(--border-color);
            }

            .form-control:focus,
            .form-field-multi-line-text.content-editable:focus,
            .btn.dropdown-toggle:focus {
                border: 1px solid var(--border-color);
                background: var(--input-background);
            }

            .form-control,
            .form-field-multi-line-text.content-editable,
            .btn.dropdown-toggle,
            .dropdown-menu {
                border-radius: 10px !important;
            }

            .input-group .input-group-text {
                color: var(--color);
                border-radius: 10px 0px 0px 10px !important;
            }

            .input-group .form-control {
                border-radius: 0px 10px 10px 0px !important;
            }

            .form-control:not(.dataTables_length .custom-select):focus,
            .custom-select:not(.dataTables_length .custom-select):focus,
            .form-field-multi-line-text.content-editable:focus,
            .btn.dropdown-toggle:focus {
                border-color: transparent !important;
                box-shadow: 0 0 0 3px var(--primary-6b) !important;
            }

            .custom-select,
            .cusomt-select:focus,
            .form-control,
            .form-control:focus {
                color: var(--color);
            }

            .custom-select {
                background: var(--input-background) !important;
                border-color: var(--border-color);
            }

            input[type='search'] {
                background: var(--button-background) !important;
                border-color: transparent;
            }

            input[type='search']:active,
            input[type='search']:focus,
            select:focus,
            select:focus {
                outline: none;
            }

            input[type='search']:active,
            input[type='search']:focus {
                box-shadow: none !important;
            }

            input[type='search']::-webkit-search-cancel-button {
                -webkit-appearance: none;
                cursor: pointer;
                height: 16px;
                width: 16px;
                ${cancelButton};
            }            

            /* Alert */
            .alert {
                font-size: 14px;
                border: none;
                border-radius: 10px;
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

            .alert-robi-primary {
                background: var(--primary-20) !important;
                color: var(--primary-hsl-5) !important;
            }

            .alert-robi-primary *:not(.btn) {
                color: var(--primary-hsl-5) !important;
            }

            .alert-robi-primary-high-contrast {
                background: var(--primary-19) !important;
                color: var(--primary-hsl-10) !important;
            }

            .alert-robi-primary-high-contrast *:not(.btn) {
                color: var(--primary-hsl-10) !important;
            }

            .alert-robi-reverse {
                background: var(--primary) !important;
                color: var(--secondary) !important;
            }

            .alert-robi-secondary {
                background: var(--background) !important;
                color: var(--color) !important;
            }

            .alert-robi-secondary *:not(.btn) {
                color: var(--color) !important;
            }

            .alert-robi-primary hr,
            .alert-robi-primary-high-contrast hr {
                border-top: 1px solid var(--primary-30);
            }

            .alert-robi-secondary hr {
                border-top: 1px solid var(--background-HSL-5);
            }
            
            /** Badge */
            .badge-success {
                background: seagreen !important;
            }

            /* Text */
            .text-robi {
                color: var(--primary) !important;
            }

            /** Code mirror */
            .CodeMirror * {
                color: unset;
                font-family: 'Inconsolata', monospace;
                font-size: 14px;
            }

            .robi-code-background {
                background: #1e1e1e;
            }

            .loading-file {
                font-family: 'Inconsolata', monospace;    
            }

            .file-title {
                width: 100%;
                background-color: #1e1e1e;
                display: flex;
                align-items: center;
                padding-bottom: .75rem;
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

            /* Install Console */
            .console {
                width: 100%;
                height: 100%;
                overflow: overlay;
                background: var(--background);
            }

            .console * {
                color: var(--color) !important;
            }

            .console::-webkit-scrollbar {
                width: 15px;
            }

            .console::-webkit-scrollbar-thumb {
                min-height: 50px;
                border-radius: 20px;
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
                background: var(--background);
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
                    transform: scale(.95);
                }
            }

            .shrink-app {
                animation: 400ms ease-in-out forwards shrink-app;
            }

            /* Switches */
            .custom-control-input:checked ~ .custom-control-label::before {
                color: #fff;
                border-color: var(--primary);
                background-color: var(--primary);
            }

            .custom-control-input:focus ~ .custom-control-label::before {
                box-shadow: 0 0 0 4px var(--primary-6b) !important;
            }

            .custom-control-input:focus:not(:checked) ~ .custom-control-label::before {
                border-color: var(--primary-6b);
            }
            
            .custom-control-input:active {
                background: var(--primary);
            }

            /* Dropdown */
            .dropdown-toggle {
                min-height: 33.5px;
                min-width: 160px;
                font-size: 13px;
                border-radius: 0.125rem 0px;
                border: 1px solid var(--border-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .dropdown-toggle::after {
                content: '▼';
                font-size: 11px;
                color: var(--primary);
                border: none;
            }
            
            .dropdown-menu {
                background: var(--input-background);
                margin: .125rem;
                padding: .125rem;
                border: solid 1px var(--border-color);
                background: var(--input-background);
            }
            
            .scroll-container {
                overflow: overlay;
            }

            .dropdown-item {
                color: var(--color);
                cursor: pointer;
                font-size: 13px;
                border-radius: 8px;
            }

            .dropdown-item:active {
                color: initial;
                background-color: initial;
            }

            .dropdown-item:focus,
            .dropdown-item:hover {
                color: var(--color);
                text-decoration: none;
                background-color: var(--primary-20);
            }

            /* Sortable */
            .ui-sortable-handle {
                cursor: grab !important;
            }

            .ui-sortable-helper {
                cursor: grabbing !important;
            }

            /* Row */
            .  {
                /* transition: background-color 250ms ease, padding 250ms ease, margin 250ms ease, transform 250ms ease, box-shadow 250ms ease; */
                /* border-radius: 20px !important; */ /* original */
                border-radius: 10px !important;
            }

            /* .robi-row-transition {
                transition: background-color 250ms ease, padding 250ms ease, margin 250ms ease, transform 250ms ease, box-shadow 250ms ease;
            }

            .robi-row.ui-sortable-handle {
                margin: 20px 0px !important;
                padding: 20px !important;
                background: var(--secondary) !important;
                box-shadow: 0px 0px 0px 2px var(--primary) !important;
            } */

            .robi-row.ui-sortable-helper::before {
                background: var(--secondary);
                z-index: -1;
            }

            /* Menu */
            .grow-in-top-left,
            .grow-in-center {
                background: var(--input-background);
                box-shadow: var(--box-shadow);
            }

            @keyframes grown-in-top-left {
                from {
                    transform: scale(0);
                    transform-origin: top left;
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    transform-origin: top left;
                    opacity: 1;
                }
            }
            
            .dt-button-collection {
                animation: 150ms ease-in-out forwards grown-in-top-left;
            }

            .grow-in-top-left {
                animation: 150ms ease-in-out forwards grown-in-top-left;
                border-radius: 10px;
                padding: .5rem;
            }

            .grow-in-center {
                border-radius: 20px;
                padding: 10px;
                display: flex;
            }

            .dropdown-divider {
                border-color: var(--border-color);
            }

            /* hr */
            .alert-robi-primary hr, .alert-robi-primary-high-contrast hr {
                border-top: 1px solid var(--primary-30);
            }
            
            hr {
                margin-top: 1rem;
                margin-bottom: 1rem;
                border: 0;
                border-top: 1px solid rgba(0,0,0,.1);
                height: 0;
                overflow: visible;
                box-sizing: content-box;
            }

            /* Article */
            article pre,
            article p,
            article ul,
            article li,
            article div {
                font-size: 13px;
            }

            article pre {
                margin: 8px 0px;
                background: var(--background);
                padding: 8px 12px;
                border-radius: 8px;
                color: var(--color);
            }

            article code {
                border-radius: 0px 8px;
            }

            article h1,
            article h2,
            article h3,
            article h4,
            article h5,
            article h6 {
                font-weight: 700;
            }

            /*
                h1 | 2em    | 32px
                h2 | 1.5em  | 24px
                h3 | 1.17em | 18.72px
                h4 | 1em    | 16px
                h5 | 0.83em | 13.28px
                h6 | 0.67em | 10.72px
            */

                article h1 {
                font-size: 24px;
            }

            article h2 {
                font-size: 20px;
            }

            article h3 {
                font-size: 18px;
            }

            article h4 {
                font-size: 16px;
            }

            article h5 {
                font-size: 12px;
            }

            article h6 {
                font-size: 10px;
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
// @END-File
