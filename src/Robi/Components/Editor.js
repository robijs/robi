import { Component } from '../Core/Component.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Editor(param) {
    const {
        label,
        lines,
        description,
        value,
        placeholder,
        parent,
        position,
        minHeight,
        optional,
        width,
        onChange
    } = param;

    let editor;

    // 18.25 * 12 + 24 = 243
    let editorHeight = '243px';

    if (minHeight) {
        editorHeight = minHeight;
    } else if (lines) {
        editorHeight = `${lines * 18.25 + 24}px`;
    }

    const component = Component({
        html: /*html*/ `
            <div class='quill-editor-container'>
                ${label ? /*html*/ `<label class='field-label'>${label}${optional ? /*html*/ `<span class='optional'><i>Optional</i></span>` : ''}</label>` : ''}
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <div class="editor"></div>
            </div>
        `,
        style: /*css*/ `
            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .ql-container {
                font-family: var(--font-family);
            }

            #id .ql-toolbar {
                border-radius: 10px 10px 0px 0px;
                border-color: var(--border-color);
            }

            #id .ql-editor {
                min-height: ${editorHeight};
                ${width ? `width: ${width};` : ''}
            }

            #id .ql-snow .ql-picker {
                color: var(--color);
            }

            #id .editor {
                border-radius: 0px 0px 10px 10px;
                border-color: var(--border-color);
            }

            #id .ql-snow.ql-toolbar button:hover,
            #id .ql-snow .ql-toolbar button:hover,
            #id .ql-snow.ql-toolbar button:focus,
            #id .ql-snow .ql-toolbar button:focus,
            #id .ql-snow.ql-toolbar button.ql-active,
            #id .ql-snow .ql-toolbar button.ql-active,
            #id .ql-snow.ql-toolbar .ql-picker-label:hover,
            #id .ql-snow .ql-toolbar .ql-picker-label:hover,
            #id .ql-snow.ql-toolbar .ql-picker-label.ql-active,
            #id .ql-snow .ql-toolbar .ql-picker-label.ql-active,
            #id .ql-snow.ql-toolbar .ql-picker-item:hover,
            #id .ql-snow .ql-toolbar .ql-picker-item:hover,
            #id .ql-snow.ql-toolbar .ql-picker-item.ql-selected,
            #id .ql-snow .ql-toolbar .ql-picker-item.ql-selected {
                color: var(--primary);
            }

            #id .ql-snow.ql-toolbar button:hover .ql-stroke,
            #id .ql-snow .ql-toolbar button:hover .ql-stroke,
            #id .ql-snow.ql-toolbar button:focus .ql-stroke,
            #id .ql-snow .ql-toolbar button:focus .ql-stroke,
            #id .ql-snow.ql-toolbar button.ql-active .ql-stroke,
            #id .ql-snow .ql-toolbar button.ql-active .ql-stroke,
            #id .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
            #id .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke,
            #id .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
            #id .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke,
            #id .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke,
            #id .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke,
            #id .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
            #id .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
            #id .ql-snow.ql-toolbar button:hover .ql-stroke-miter,
            #id .ql-snow .ql-toolbar button:hover .ql-stroke-miter,
            #id .ql-snow.ql-toolbar button:focus .ql-stroke-miter,
            #id .ql-snow .ql-toolbar button:focus .ql-stroke-miter,
            #id .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter,
            #id .ql-snow .ql-toolbar button.ql-active .ql-stroke-miter,
            #id .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
            #id .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
            #id .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
            #id .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
            #id .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
            #id .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
            #id .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,
            #id .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
                stroke: var(--primary);
            }

            #id .ql-snow.ql-toolbar button:hover .ql-fill,
            #id .ql-snow .ql-toolbar button:hover .ql-fill,
            #id .ql-snow.ql-toolbar button:focus .ql-fill,
            #id .ql-snow .ql-toolbar button:focus .ql-fill,
            #id .ql-snow.ql-toolbar button.ql-active .ql-fill,
            #id .ql-snow .ql-toolbar button.ql-active .ql-fill,
            #id .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,
            #id .ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill,
            #id .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,
            #id .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill,
            #id .ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill,
            #id .ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill,
            #id .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill,
            #id .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill,
            #id .ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill,
            #id .ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill,
            #id .ql-snow.ql-toolbar button:focus .ql-stroke.ql-fill,
            #id .ql-snow .ql-toolbar button:focus .ql-stroke.ql-fill,
            #id .ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill,
            #id .ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill,
            #id .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
            #id .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
            #id .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
            #id .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
            #id .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
            #id .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
            #id .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill,
            #id .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {
                fill: var(--primary);
            }

            #id .ql-tooltip[data-mode='formula'] {
                left: 0px !important;
                border-radius: 10px;
                border: none;
                padding: 12px 24px;
                color: var(--color);
                box-shadow: var(--box-shadow);
            }

            #id .ql-tooltip[data-mode='formula']::before {
                display: block;
                font-weight: 500;
                content: 'Enter formula';
                font-size: 14px;
                margin-bottom: .5rem;
            }

            #id .ql-tooltip[data-mode='formula'] textarea {
                margin-bottom: 12px;
            }

            #id .ql-tooltip[data-mode='formula'] input,
            #id .ql-tooltip[data-mode='formula'] textarea {
                font-size: 13px !important;
                border-radius: 10px;
                padding: 6px 12px;
                width: 100%;
                height: unset;
                border: solid 1px var(--border-color);
                outline: none;
            }

            #id .ql-tooltip[data-mode='formula'] input:focus,
            #id .ql-tooltip[data-mode='formula'] input:active,
            #id .ql-tooltip[data-mode='formula'] textarea:focus,
            #id .ql-tooltip[data-mode='formula'] textarea:active {
                border-color: transparent !important;
                box-shadow: 0 0 0 3px var(--primary-6b) !important;
            }

            #id .ql-snow .ql-tooltip[data-mode='formula'] a {
                line-height: unset;
            }

            #id .ql-snow .ql-tooltip[data-mode='formula'] a.ql-action::after {
                display: block;
                content: 'Add';
                color: var(--primary);
                background: var(--button-background);
                border-radius: 10px;
                margin: 0px;
                padding: 6px 12px;
                font-weight: 500;
                text-align: center;
            }

            #id .ql-snow .ql-tooltip[data-mode='formula'] .katex-ref-link {
                margin-top: 24px;
                font-size: 11px;
            }

            #id .ql-snow .ql-tooltip[data-mode='formula'] .katex-ref-link a,
            #id .ql-snow .ql-tooltip[data-mode='formula'] .katex-ref-link a:active,
            #id .ql-snow .ql-tooltip[data-mode='formula'] .katex-ref-link a:visited {
                color: var(--primary);
            }
        `,
        parent,
        position,
        events: [

        ],
        onAdd() {
            const options = {
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],    // headings / normal body style
                        [{ 'font': [] }],                             // font style
                        ['bold', 'italic', 'underline', 'strike'],    // toggled buttons
                        [{ 'header': 1 }, { 'header': 2 }],           // custom button values
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }], // numbers / bullets
                        [{ 'script': 'sub'}, { 'script': 'super' }],  // superscript/subscript
                        [{ 'indent': '-1'}, { 'indent': '+1' }],      // outdent/indent
                        [{ 'color': [] }, { 'background': [] }],      // dropdown with defaults from theme
                        [{ 'align': [] }],                            // text align
                        ['image', 'code-block', 'formula'],           // embeds
                        ['clean']                                     // remove formatting button
                    ]
                },
                theme: 'snow' // or 'bubble'
            };

            if (placeholder) {
                options.placeholder = placeholder;
            }

            editor = new Quill('.editor', options);

            if (onChange) {
                // NOTE: Considered a hack.
                // FIXME: Replace with API if one comes available.
                // https://github.com/quilljs/quill/issues/1680#issuecomment-493455851
                editor.root.addEventListener('blur', function () {

                    // Opiniated. This should return stringifed contents. Becuase it's most
                    // likely to be used by something like FormFunction to update a list item
                    // field that will utlimaltey be saved as a text document.
                    //
                    // If you need the raw obj itself, use component.getEditor().getContents() directly. 
                    onChange(JSON.stringify(editor.getContents()));
                });

                // DEV: This fires every time the editor changes. Might be too often.
                // editor.on('text-change', function(delta, oldDelta, source) {
                //     if (source == 'api') {
                //         console.log("An API call triggered this change.");
                //     } else if (source == 'user') {
                //         console.log("A user action triggered this change.");
                //     }

                //     onChange(delta);
                // });
            }

            if (value) {
                // https://stackoverflow.com/a/20392392
                try {
                    const parsed = JSON.parse(value);
            
                    if (parsed && typeof parsed === "object") {
                        editor.setContents(parsed);
                    }
                }
                catch (e) { 
                    console.error(e);
                }
            }
    
            // Override default formula behavior, look, and feel
            component
                .find('.ql-toolbar .ql-formula')
                .on('click', event => {
                    const formulaBar = component.find(`.editor .ql-tooltip[data-mode='formula']`);
                    const katexRefLink = formulaBar.querySelector('.katex-ref-link');
    
                    // Add support link
                    if (!katexRefLink) {
                        formulaBar.insertAdjacentHTML('beforeend', /*html*/ `
                            <div class='katex-ref-link'>
                                Need help? 
                                <a href='https://katex.org/docs/supported.html' target='_blank'>
                                    List of supported functions
                                </a>
                            </div>
                        `)
                    }
    
                    // Add textarea
                    let textarea = formulaBar.querySelector('textarea');
    
                    if (!textarea) {
                        const input = formulaBar.querySelector('input')
    
                        input.style.display = 'none';
                        input.insertAdjacentHTML('afterend', /*html*/ `
                            <textarea rows='4'></textarea>
                        `);
    
                        textarea = formulaBar.querySelector('textarea');
                        textarea.addEventListener('keyup', event => {
                            input.value = textarea.value;
                        });
                    }
                });
        }
    });

    component.getEditor = () => {
        return editor;
    }

    return component;
}
// @END-File
