/** Actions */
import Action_Component from '../Actions/Action_Component.js'
import Action_Route from '../Actions/Action_Route.js'

export default function Component_QPPMarketPlanCard(param) {
    const {
        name,
        facilityId,
        status,
        pinned,
        onPin,
        margin,
        parent,
        position
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div class='card'>
                <div class='card-body'>
                    <h3 class='card-title'>Facility Plan</h3>
                    <div class='badge badge-${setBadgeType(status)}' role='alert'>${status}</div>
                </div>
                <span class='add-fav${pinned ? ' pinned' : ''} facility' title='Add to favorites' data-type='favfacilities' data-facilityid='${facilityId}' data-status='${status}'>
                    <svg class='icon'>
                        <use href='#icon-pushpin'></use>
                    </svg>
                </span>
            </div>
        `,
        style: /*css*/ `
            #id {
                position: relative;
                width: 100%;
                margin: ${margin || '0px'};
            }

            #id .card-body {
                padding: 1.75rem;
            }

            #id .badge {
                display: block;
                width: 100%;
                text-align: center;
                padding: .75rem 1.25rem;
            }

            #id .add-fav.facility {
                opacity: 0;
                position: absolute;
                top: 5px;
                right: 10px;
                font-size: 1.2em;
            }
            
            #id .add-fav .icon {
                stroke: darkgray;
                fill: darkgray;
            }

            #id:hover .add-fav.facility {
                opacity: 1;
                cursor: pointer;
            }

            #id .add-fav.pinned {
                opacity: 1;
                cursor: initial !important;
            }

            #id .add-fav:hover .icon,
            #id .add-fav.pinned .icon {
                stroke: mediumseagreen;
                fill: mediumseagreen;
            }

            #id .badge-group {
                display: inline-flex;
                align-items: center;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .add-fav.facility',
                event: 'mousedown',
                listener(event) {
                    if (this.classList.contains('pinned')) {
                        event.preventDefault();
                        
                        return;
                    }

                    this.classList.add('pinned');

                    onPin({
                        item: {
                            name,
                            status,
                            pathId: facilityId
                        },
                        type: this.dataset.type
                    });
                }
            }
        ]
    });

    function setBadgeType(status) {
        switch(status) {
            case 'Approved':
            case 'Completed':
            case 'Finished':
                return 'success';
            case 'Started':
                return 'primary';
            case 'Submitted':
            case 'In Progress':
                return 'warning';
            case 'Not Started':
                return 'danger';
            default:
                return 'dark';
        }
    }

    return component;
}