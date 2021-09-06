/** Actions */
import Action_Component from '../Actions/Action_Component.js'
import Action_Route from '../Actions/Action_Route.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js';

export default function Component_QPPMarketPlanCard(param) {
    const {
        title,
        marketId,
        status,
        facilities,
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
                    <h3 class='card-title'>Market Plan</h3>
                    <div class='alert alert-${setAlertType(status)}' role='alert'>${status}</div>
                    <h5 class='card-subtitle mb-2'>
                        <span>Facility Plans</span>
                        <span class='text-muted ml-2'>${facilities.filter(facility => facility.status === 'Approved').length} / ${facilities.length}</span>
                    </h5>
                    <div class='facilities mb-4'>
                        ${buildFacilities(facilities)}
                    </div>
                </div>
                <span class='add-fav${pinned ? ' pinned' : ''}' title='Add to favorites' data-type='favmarkets' data-marketid='${marketId}' data-status='${status}'>
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

            #id .facility {
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                margin-bottom: 4px;
            }

            #id .facility:hover {
                border-radius: 4px;
                background: ${Setting_App.secondaryColor}
            }

            #id .facility:not(:last-child) {
                margin-bottom: 5px;
            }

            #id .facility-name {
                white-space: nowrap;
                margin-right: 15px;
            }

            #id .alert {
                text-align: center;
            }

            #id .facility .badge {
                display: block;
                padding: 4px 8px;
                font-weight: 500;
                line-height: initial;
                min-width: 80px;
                text-align: center;
            }

            #id .add-fav:not(.facility) {
                opacity: 0;
                position: absolute;
                top: 5px;
                right: 10px;
                font-size: 1.2em;
            }

            #id .add-fav.facility {
                opacity: 0;
                font-size: 1em;
                padding: 0rem 1.25rem;
            }
            
            #id .add-fav .icon {
                stroke: darkgray;
                fill: darkgray;
            }

            #id:hover .add-fav:not(.facility),
            #id .facility:hover .add-fav.facility {
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
                selector: '#id .facility-name',
                event: 'click',
                listener(event) {
                    Action_Route(`Markets/${marketId}/${this.closest('.facility').dataset.facilityid}`);
                }
            },
            {
                selector: '#id .facility .badge',
                event: 'click',
                listener(event) {
                    Action_Route(`Markets/${marketId}/${this.closest('.facility').dataset.facilityid}`);
                }
            },
            {
                selector: '#id .add-fav:not(.facility)',
                event: 'click',
                listener(event) {
                    if (this.classList.contains('pinned')) {
                        event.preventDefault();

                        return;
                    }

                    this.classList.add('pinned');

                    onPin({
                        item: {
                            name: title,
                            status,
                            pathId: marketId,
                        },
                        type: this.dataset.type
                    });
                }
            },
            {
                selector: '#id .add-fav.facility',
                event: 'mousedown',
                listener(event) {
                    if (this.classList.contains('pinned')) {
                        event.preventDefault();
                        
                        return;
                    }

                    this.classList.add('pinned');

                    const facility = this.closest('div.facility');

                    onPin({
                        item: {
                            name: facility.querySelector('.facility-name').innerText,
                            status: facility.dataset.status,
                            pathId: facility.dataset.facilityid
                        },
                        type: this.dataset.type
                    });
                }
            }
        ]
    });

    function buildFacilities(facilities) {
        return facilities.map(facility => {
            const {
                name,
                facilityId,
                status,
                pinned
            } = facility;

            return /*html*/ `
                <div class='facility' title='Go to facility plan' data-facilityid='${facilityId}' data-status='${status}'>
                    <span class='facility-name'>${name}</span>
                    <span class='badge-group'>
                        <span class='add-fav${pinned ? ' pinned' : ''} facility' title='Add to favorites' data-type='favfacilities' data-facilityid='${facilityId}'>
                            <svg class='icon'>
                                <use href='#icon-pushpin'></use>
                            </svg>
                        </span>
                        <span class='badge badge-${setAlertType(status)}'>${status}</span>
                    </span>
                </div>
            `;
        }).join('\n');
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

    return component;
}