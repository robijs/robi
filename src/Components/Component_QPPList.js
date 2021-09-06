/** Actions */
import Action_Component from '../Actions/Action_Component.js'
import Action_Route from '../Actions/Action_Route.js'
import Action_Store from '../Actions/Action_Store.js'
import Action_UpdateItem from '../Actions/Action_UpdateItem.js'

/** Components */
import Component_Notification from '../Components/Component_Notification.js'

export default function Component_Card(param) {
    const {
        items,
        path,
        setting,
        parent,
        position
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div class='card'>
                <ul class='list-group list-group-flush'>
                    ${
                        items.length > 0 ? 
                        buildList(items) : 
                        /*html*/ `
                            <li class='list-group-item none'>None</li>
                        `
                    }
                </ul>
            </div>
        `,
        style: /*css*/ `
            #id {
                width: 100%;
            }

            #id .route {
                cursor: pointer;
            }

            #id li {
                display: inline-flex;
                justify-content: space-between;
                align-items: center;
            }

            #id .icon {
                opacity: 0;
            }

            #id li:hover .icon {
                opacity: 1;
                stroke: #dc3545;
                fill: #dc3545;
            }

            #id .list-group-item.none {
                border: none;
                background: lightgray;
                color: darkslategray;
                padding: 5px 10px;
            }

            /** List item */
            #id .list-group-item {
                padding: 0px;
            }

            #id .name {
                white-space: nowrap;
            }

            #id .name,
            #id .remove {
                padding: .75rem 1.25rem;
            }

            #id .list-group-item:first-child .remove {
                border-top-right-radius: calc(.25rem - 1px);
            }

            #id .list-group-item:last-child .remove {
                border-bottom-right-radius: calc(.25rem - 1px);
            }

            #id .badge-group {
                display: inline-flex;
                align-items: center;
                padding-right: 1.25rem;
            }

            #id .badge {
                display: block;
                padding: 4px 8px;
                font-weight: 500;
                line-height: initial;
                min-width: 80px;
                text-align: center;
            }

            #id .market[data-status='Approved'] {
                background-color: #d4edda;
                color: #155724;s
            }

            #id .market[data-status='In Progress'] {
                background-color: #fff3cd;
                color: #856404;
            }

            #id .market[data-status='Not Started'] {
                background-color: #f8d7da;
                color: #721c24;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .route',
                event: 'click',
                listener: route
            },
            {
                selector: '#id .remove',
                event: 'click',
                listener: remove
            }
        ]
    });

    function buildList(items) {
        return items
        .sort((a, b) => {
            a = a.name.toUpperCase();
            b = b.name.toUpperCase();
            
            if (a < b) {
                return -1;
            }
            
            if (a > b) {
                return 1;
            }
        
            // names must be equal
            return 0;
        })
        .map(item => itemTemplate(item)).join('\n');
    }

    function itemTemplate(item) {
        const {
            name,
            status,
            pathId,
        } = item;

        // return /*html*/ `
        //     <li class='list-group-item route' data-pathid='${pathId}'>
        //         <span class='name'>${name}</span>
        //         <span class='remove' title='Remove from My ${path}'>
        //             <svg class='icon'>
        //                 <use href='#icon-pushpin'></use>
        //             </svg>
        //         </span>
        //     </li>
        // `;
        
        return /*html*/ `
            <li class='list-group-item route' data-pathid='${pathId}'>
                <span class='name'>${name}</span>
                <span class='badge-group'>
                    <span class='remove' title='Remove from favorites'>
                        <svg class='icon'>
                            <use href='#icon-pushpin'></use>
                        </svg>
                    </span>
                    <span class='badge ${setting === 'favDMISIDs' ? `badge-${setAlertType(status)}` : 'market'}' data-status='${status}'>${status}</span>
                </span>
            </li>
        `;
    }

    function setAlertType(status) {
        switch(status) {
            case 'Approved':
                return 'success';
            case 'Submitted':
            case 'In Progress':
                return 'warning';
            case 'Not Started':
                return 'danger';
            default:
                return 'dark';
        }
    }

    function route(event) {
        // console.log(this);
        // console.log(`${path}/${this.dataset.pathid}`);

        Action_Route(`${path}/${this.dataset.pathid}`);
    }

    async function remove(event) {
        /** Don't bubble */
        event.preventDefault();
        event.stopPropagation();

        /** Find card */
        const card = this.closest('li');

        /** Path Id */
        const pathId = parseInt(card.dataset.pathid);

        /** Remove from DOM */
        card.remove();

        /** @todo Don't traverse entire maincontainer DOM. Generalize to component instances */
        let node = Action_Store.get('maincontainer').find(`span.add-fav[data-${setting === 'favMarketIds' ? 'marketid': 'facilityid'}='${pathId}']`);

        if (node) {
            node.classList.remove('pinned');
        }

        /** Add None message if list empty */
        const favs = component.findAll('.route');

        if (favs.length === 0) {
            component.find('.list-group').insertAdjacentHTML('beforeend', /*html*/ `
                <li class='list-group-item none'>None</li>
            `);
        }

        /** Update from User.Settings */
        const Settings = JSON.parse(Action_Store.user().Settings);

        /** @tood Brittle. Needs validation. */
        Settings[setting].splice(Settings[setting].indexOf(pathId), 1);

        /** Show toast */
        const toast = Component_Notification({
            text: `Unpinned ${card.querySelector('.name').innerText}`,
            type: 'bs-toast',
            parent: Action_Store.get('maincontainer')
        });

        toast.add();

        const updatedUser = await Action_UpdateItem({
            list: 'Users',
            itemId: Action_Store.user().Id,
            data: {
                Settings: JSON.stringify(Settings)
            }
        });

        Action_Store.user(updatedUser);

        console.log(updatedUser);
    }

    component.addItem = async (param) => {
        const {
            item
        } = param;

        const {
            name,
            pathId
        } = item;

        /** Check if if list is empty */
        const favs = component.findAll('.route');

        /** Get group */
        const group = component.find('.list-group');

        /** Create template */
        const template = itemTemplate(item);

        if (favs.length === 0) {
            group.innerHTML = template;
        } else {
            group.insertAdjacentHTML('beforeend', template);
        }

        /** Update User.Settings */
        const Settings = JSON.parse(Action_Store.user().Settings);

        /** @tood Brittle. Needs validation. */
        Settings[setting].push(parseInt(pathId));

        /** Show toast */
        const toast = Component_Notification({
            text: `Pinned ${name}`,
            type: 'bs-toast',
            parent: Action_Store.get('maincontainer')
        });

        toast.add();

        const updatedUser = await Action_UpdateItem({
            list: 'Users',
            itemId: Action_Store.user().Id,
            data: {
                Settings: JSON.stringify(Settings)
            }
        });

        Action_Store.user(updatedUser);

        component.find(`.route[data-pathid='${pathId}']`).addEventListener('click', route);
        component.find(`.route[data-pathid='${pathId}'] .remove`).addEventListener('click', remove);
    }

    return component;
}