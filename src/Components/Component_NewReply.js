/** Settings */
import { App } from '../Core/Settings.js'

/* Actions */
import Component from '../Actions/Action_Component.js'
import Action_CreateItem from '../Actions/Action_CreateItem.js'

export default function Component_NewReply(param) {
    const {
        width,
        action,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='comments-container'>
                <div class='new-reply-label'>New reply</div>
                <!-- New Comment -->
                <div class='new-comment-container'>
                    <div class='new-comment' contenteditable='true'></div>
                    <!-- Button -->
                    <div class='new-comment-button-container'>
                        <div class='new-comment-button'>
                            <svg class='icon'>
                                <use href='#icon-arrow-up2'></use>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            .comments-container {
                width: ${width || '100%'};
                max-height: 80vw;
                padding-bottom: 20px;
            }

            /* New Comment */
            #id .new-comment-container {
                display: flex;
                background: white;
                border-radius: 4px;
            }

            #id .new-comment {
                overflow-wrap: anywhere;
                flex: 2;
                font-size: .9em;
                font-weight: 500;
                padding: 10px 20px;
                border-radius: 4px 0px 0px 4px;
                border-left: solid 1px rgba(0, 0, 0, .1);
                border-top: solid 1px rgba(0, 0, 0, .1);
                border-bottom: solid 1px rgba(0, 0, 0, .1);
            }

            #id .new-comment:active,
            #id .new-comment:focus{
                outline: none;
                border-left: solid 1px ${App.get('primaryColor')};
                border-top: solid 1px ${App.get('primaryColor')};
                border-bottom: solid 1px ${App.get('primaryColor')};
            }

            #id .new-comment-button-container,
            #id .new-comment-button-container {
                border-radius: 0px 4px 4px 0px;
                border-right: solid 1px rgba(0, 0, 0, .1);
                border-top: solid 1px rgba(0, 0, 0, .1);
                border-bottom: solid 1px rgba(0, 0, 0, .1);
            }

            #id .new-comment:active ~ .new-comment-button-container,
            #id .new-comment:focus ~ .new-comment-button-container {
                border-radius: 0px 4px 4px 0px;
                border-right: solid 1px ${App.get('primaryColor')};
                border-top: solid 1px ${App.get('primaryColor')};
                border-bottom: solid 1px ${App.get('primaryColor')};
            }

            /* Button */
            #id .new-comment-button {
                cursor: pointer;
                display: inline-block;
                margin: 5px;
                padding: 5px 7.5px;
                font-weight: bold;
                text-align: center;
                border-radius: 4px;
                color: white;
                background: ${App.get('primaryColor')};
            }

            #id .new-comment-button .icon {
                font-size: 1.2em;
            }

            /* Label */
            #id .new-reply-label {
                font-weight: 500;
                margin-bottom: 5px;
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: '#id .new-comment',
                event: 'keydown',
                async listener(event) {
                    if (event.ctrlKey && event.key === 'Enter') {
                        event.preventDefault();

                        component.find('.new-comment-button').click();
                    }
                }
            },
            {
                selector: '#id .new-comment-button',
                event: 'click',
                async listener(event) {
                    const field = component.find('.new-comment');
                    const value = field.innerHTML;
                   
                    if (value) {
                        action(value);
            
                        field.innerHTML = '';
                    } else {
                        console.log('new comment field is empty');
                    }
                }
            }
        ]
    });

    component.focus = () => {
        component.find('.new-comment').focus();
    }

    return component;
}