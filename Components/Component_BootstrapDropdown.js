/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Actions */
import Action_Component from '../Actions/Action_Component.js'

/**
 * {@link https://getbootstrap.com/docs/4.5/components/dropdowns/}

 * @param {Object} param 
 * @returns 
 */
export default function Component_BootstrapDropdown(param) {
    const {
        action,
        label,
        parent,
        position,
        items,
        value,
        margin,
        padding
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div>
                <div class='label'>${label}</div>
                <div class="dropdown">
                    <button class="btn btn-outline-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        ${value}
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        ${buildDropdown(items)}
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '0px'};
                padding: ${padding || '0px'};
            }

            #id .label {
                font-size: 1.1em;
                font-weight: bold;
                padding: 5px 0px;
            }

            #id .dropdown-item {
                cursor: pointer;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id .dropdown-item`,
                event: 'click',
                listener: action
            }
        ]
    });

    function buildDropdown(items) {
        return items
        .map(dropdown => dropdownTemplate(dropdown))
        .join('\n');
    }

    function dropdownTemplate(dropdown) {
        const {
            label,
            path
        } = dropdown;

        return /*html*/ `
            <div class='dropdown-item' data-path='${path}'>${label}</div>
        `;
    }

    component.setDropdownMenu = (list) => {
        component.find('.dropdown-menu').innerHTML = buildDropdown(list);

        component.findAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', action);
        });
    }

    component.value = (param) => {
        const field = component.find('.dropdown-toggle');

        if (param !== undefined) {
            field.innerText = param;
        } else {
            return field.innerText;
        }
    }

    return component;
}