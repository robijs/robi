/* Actions */
import Action_Component from '../Actions/Action_Component.js'
// import Action_GetAdUsers from '../Actions/Action_GetAdUsers.js'
import Action_GetSiteUsers from '../Actions/Action_GetSiteUsers.js'
import Action_Route from '../Actions/Action_Route.js'

/* Components */
import Component_DropDownMenu from './Component_DropDownMenu.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

export default function Component_NameField(param) {
    const {
        label,
        description,
        fieldMargin,
        parent,
        position,
        onSetValue,
        onInput
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div class='form-field'>
                <div class='form-field-label'>${label}</div>
                ${description ? /*html*/`<div class='form-field-description'>${description}</div>` : ''}
                <div class='search-wrapper'>
                    <div class='form-field-name' tabindex='0' contenteditable='true'></div>
                </div>
            </div>
        `,
        style: /*css*/ `
            /* Rows */
            #id.form-field {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
            }

            /* Labels */
            #id .form-field-label {
                font-size: 1.1em;
                font-weight: bold;
                padding: 5px 0px;
            }

            #id .form-field-description {
                font-size: .9em;
                padding: 5px 0px;
            }

            #id .form-field-name {
                font-size: .9em;
                font-weight: 500;
                margin-top: 2px;
                margin-bottom: 4px;
                margin-right: 20px;
                min-height: 36px;
                max-width: 300px;
                min-width: 300px;
                padding: 5px 10px;
                background: white;
                border-radius: 4px;
                border: ${Setting_App.defaultBorder};
            }

            #id .form-field-name:active,
            #id .form-field-name:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 2px ${Setting_App.primaryColor};
            }

            /** Errors */
            #id span.alert-link:hover {
                cursor: pointer;
                text-decoration: underline;
            }

            /** Search */
            #id .search-wrapper {
                display: flex;
                align-items: baseline;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: `#id .form-field-name`,
                event: 'input',
                listener(event) {
                    /** Show empty drop down immediately */
                    // addDropDownMenu(event);
                    
                    /**
                     * @author Stephen Matheis
                     * @date 2020.10.28
                     * 
                     * Trying to fix menu not going away.
                     * 
                     * This does the trick, and I think I know why.
                     * But more research is necessary before I feel
                     * this is the best way to do it.
                     */
                    if (event.isTrusted) {
                        searchSiteUsers(event);

                        if (onInput) {
                            onInput(event);
                        }
                    }
                }
            }
        ]
    });

    let menu;

    function addDropDownMenu(event, data) {
        const key = event.key;

        if (key && key.includes('Arrow') || key === 'Enter') {
            event.preventDefault();

            return;
        }

        // Reset menu
        resetMenu();
        
        // Set menu
        menu = Component_DropDownMenu({
            dropDownField: component,
            field: event.target,
            data: data,
            onSetValue
        });

        // Add to DOM
        menu.add();
    }

    /** Reset menu */
    function resetMenu() {
        if (menu) {
            menu.removeEvents();
            menu.remove();
        }
    }

    /** Search site users */
    let queries = [];

    async function searchSiteUsers(event) {
        event.preventDefault();
        
        /** Abort previous queries */ 
        queries.forEach(query => {
            query.abortController.abort();
        });

        const query = event.target.innerText.toLowerCase();

        if (query === '') {
            event.target.dataset.itemid = '';
            
            resetMenu();
            removeSpinner();

            return;
        }
        
        removeNonefoundMessage();
        addSpinner();
 
        const newSearch = Action_GetSiteUsers({
            query
        });

        queries.push(newSearch);

        console.log(newSearch);

        const response = await newSearch.response;

        if (response) {
            const data = response.map(user => {
                const {
                    // Title
                    Name
                } = user;

                return {
                    id: user.Id,
                    // value: Title,
                    value: Name,
                    info: user
                };
            });

            if (data.length > 0) {
                // removeSpinner();
                addDropDownMenu(event, data);
            } else {
                // removeSpinner();
                addNoneFoundMessage();
            }
        }
    }

    /** Add none found message */
    function addNoneFoundMessage() {
        const message = component.find('.none-found');
        
        if (!message) {
            const html = /*html*/ `
                <span class='none-found' style='color: firebrick;'>
                    No accounts found that match this name.
                </span>
            `;

            component.get().insertAdjacentHTML('beforeend', html);
        }
    }

    /** Remove none found message */
    function removeNonefoundMessage() {
        const message = component.find('.none-found');
        
        if (message) {
            message.remove();
        }
    }

    /** Add Spinner */
    function addSpinner() {
        const spinner = component.find('.searching');
        
        if (!spinner) {
            const html = /*html*/ `
                <span class='searching'>
                    <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> 
                    Searching for CarePoint accounts...
                <span>
            `;

            component.find('.search-wrapper').insertAdjacentHTML('beforeend', html);
        }
    }

    /** Add Spinner */
    function removeSpinner() {
        const spinner = component.find('.searching');
        
        if (spinner) {
            spinner.remove();
        }
    }

    component.focus = () => {
        const field = component.find('.form-field-name');

        field.focus();
    }

    component.addError = (param) => {
        /** Remove previous errors */
        component.removeError();
        
        /** Param can be a string or an object */
        let text = typeof param === 'object' ? param.text : param;

        /** Build error HTML */
        const html = /*html*/ `
            <div class='alert alert-danger' role='alert'>
                ${text}
                ${param.button ? 
                    /*html*/ ` 
                    <button type='button' class='close' data-dismiss='alert' aria-label='Close'>
                        <span aria-hidden='true'>&times;</span>
                    </button>
                    ` 
                    : ''
                }
            </div>
        `;

        /** Add HTML to DOM */
        component.find('.form-field-name').insertAdjacentHTML('beforebegin', html);
        
        /** Add Event Listeners to embedded links */
        component.findAll('.alert .alert-link').forEach(link => {
            link.addEventListener('click', event => {
                if (event.target.dataset.route) {
                    Action_Route(event.target.dataset.route);
                }
            });
        });
    }

    component.removeError = () => {
        const message = component.find('.alert');

        if (message) {
            message.remove();
        }
    }

    component.value = (param) => {
        const nameField = component.find(`.form-field-name`);

        if (param) {
            nameField.innerText = param;
        } else if (param === '') {
            nameField.innerText = '';
        } else {
            const nameAndAccount = nameField.innerText.replace(' (US)', '').split(' - ');
            const fullName = nameAndAccount[0];
            const nameParts = fullName.split(', ');
            const lastName = nameParts[0];
            const firstNameParts = nameParts[1].split(' ');
            const firstName = firstNameParts[0];
            const command = firstNameParts[firstNameParts.length - 1];
            const accountParts = nameAndAccount[1].split('\\');
            const domain = accountParts[0];
            const account = accountParts[1];

            return {
                fullName,
                lastName,
                firstName,
                domain,
                account,
                command
            };
        }
    }

    return component;
}