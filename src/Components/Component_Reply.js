/** Actions */
import Action_Component from '../Actions/Action_Component.js'
import Action_Store from '../Actions/Action_Store.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

export default function Component_Reply(param) {
    const {
        reply,
        label,
        margin,
        onEdit,
        parent,
        position
    } = param;

    const {
        Body,
        Author,
        Editor,
        Created,
        Modified
    } = reply;

    const component = Action_Component({
        html: /*html*/ `
            <div class='card'>
                ${
                    Author.Name === Action_Store.user().LoginName ?
                    /*html*/ `
                        <div class='button-group'>
                            <button type='button' class='btn btn-secondary cancel'>Cancel</button>
                            <button type='button' class='btn btn-primaryColor edit'>Edit reply</button>
                        </div>
                    ` :
                    ''
                }
                <div class='card-body'>
                    <h6 class='card-subtitle mb-2 text-muted'>
                        <span>${Author.Title} ${formatDate(Created)}</span>
                        ${
                            label === 'new' ? 
                            /*html*/ `
                                <span class='badge badge-warning' role='alert'>New</span>
                            ` : 
                            ''
                        }
                    </h6>
                    <div class='card-text mb-2'>${Body || ''}</div>
                    <h6 class='card-subtitle mt-2 text-muted edit-text'>${edited(Created, Modified) ? `Last edited by ${Editor.Title} ${formatDate(Modified)} ` : ''}</h6>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                width: 100%;
                margin: ${margin || '0px'};
                position: relative;
            }

            #id .card-title {
                display: flex;
                justify-content: space-between;
            }

            #id .card-subtitle {
                font-size: .9em;
                font-weight: 400;
            }

            #id .question-card-body {
                padding: 1.75rem;
            }

            /* Reply */
            #id .button-group {
                position: absolute;
                display: none;
                top: 5px;
                right: 5px;
            }

            #id .button-group .btn {
                margin-left: 5px;
            }
            
            #id .edit,
            #id .cancel {
                font-size: .8em;
                padding: .275rem .75rem;
            }

            #id .cancel {
                display: none;
            }

            #id:hover .button-group {
                display: flex !important;
            }

            #id .btn-primaryColor {
                background: ${Setting_App.get('primaryColor')};
                color: white;
            }

            #id .btn-primaryColor:focus,
            #id .btn-primaryColor:active {
                box-shadow: none;
            }

            #id .editable {
                padding: 10px;
                margin-top: 20px;
                border: solid 2px mediumseagreen;
                border-radius: 4px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .cancel',
                event: 'click',
                listener(event) {
                    event.target.style.display = 'none';

                    const editButton = component.find('.edit');
                    editButton.innerText = 'Edit reply';
                    editButton.classList.add('btn-primaryColor');
                    editButton.classList.remove('btn-success');

                    const buttonGroup = component.find('.button-group');
                    buttonGroup.style.display = 'none';

                    const cardText = component.find('.card-text');
                    cardText.setAttribute('contenteditable', false);
                    cardText.classList.remove('editable');
                }
            },
            {
                selector: '#id .edit',
                event: 'click',
                listener(event) {
                    const cardText = component.find('.card-text');
                    const buttonGroup = component.find('.button-group');
                    const cancelButton = component.find('.cancel');

                    if (event.target.innerText === 'Edit reply') {
                        event.target.innerText = 'Update';
                        event.target.classList.remove('btn-primaryColor');
                        event.target.classList.add('btn-success');

                        cardText.setAttribute('contenteditable', true);
                        cardText.classList.add('editable');
                        cardText.focus();

                        cancelButton.style.display = 'block';
                        buttonGroup.style.display = 'flex';
                    } else {
                        onEdit(cardText.innerHTML);

                        event.target.innerText = 'Edit reply';
                        event.target.classList.add('btn-primaryColor');
                        event.target.classList.remove('btn-success');

                        cardText.setAttribute('contenteditable', false);
                        cardText.classList.remove('editable');

                        cancelButton.style.display = 'none';
                        buttonGroup.style.display = 'none';
                    }
                }
            }
        ]
    });

    function formatDate(date) {
        const thisDate = new Date(date);

        if (isToday(thisDate)) {
            // console.log('is today');
        }

        return `
            ${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString('default', {
                hour: 'numeric',
                minute: 'numeric'
            })}
        `;
    }

    function isToday(date) {
        const thisDate = new Date(date).toDateString();
        const today = new Date().toDateString();

        if (thisDate === today) {
            return true;
        } else {
            return false;
        }
    }

    function isGreaterThanOneHour(date) {
        const thisDate = new Date(date).toDateString();
        const today = new Date().toDateString();

        if (thisDate === today) {
            return true;
        } else {
            return false;
        }
    }

    function edited(created, modified) {
        // console.log(`CREATED:\t${formatDate(created)}`)
        // console.log(`MODIFIED:\t${formatDate(modified)}`);

        if (formatDate(created) !== formatDate(modified)) {
            return true;
        } else {
            return false;
        }
    }

    component.setModified = (param) => {
        const {
            Modified,
            Editor
        } = param;

        component.find('.edit-text').innerHTML = `Last edited by ${Editor.Title} ${formatDate(Modified)}`;
    }

    return component;
}