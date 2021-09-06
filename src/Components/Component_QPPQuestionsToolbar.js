/** Actions */
import Action_Component from '../Actions/Action_Component.js'

export default function Component_QPPQuestionsToolbar(param) {
    const {
        selected,
        parent,
        onFilter,
        onSearch,
        onClear,
        onAsk,
        position
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div class='btn-toolbar mb-3' role='toolbar' aria-label='Toolbar with button groups' id='App-18'>
                <button type='button' class='btn btn-primary ask-a-question'>Ask a question</button>
                <div class='input-group'>
                    <input class='form-control mr-sm-2 search-questions' type='search' placeholder='Search' aria-label='Search'>
                </div>    
                <div class='btn-group mr-2' role='group' aria-label='First group'>
                    ${buildFilters()}
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: 20px 0px 0px 0px;
                align-items: center;
            }

            #id .btn:focus,
            #id .btn:active {
                box-shadow: none ;
            }
            
            #id .search-questions {
                min-width: 250px;
                margin: 0rem .5rem;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .filter',
                event: 'click',
                listener(event) {
                    const isSelected = event.target.classList.contains('btn-outline-primary');

                    /** Deselect all options */
                    component.findAll('.filter').forEach(button => {
                        button.classList.remove('btn-primary');
                        button.classList.add('btn-outline-primary');
                    });
                    
                    if (isSelected) {
                        event.target.classList.remove('btn-outline-primary');
                        event.target.classList.add('btn-primary');
                    } else {
                        event.target.classList.remove('btn-primary');
                        event.target.classList.add('btn-outline-primary');
                    }

                    onFilter(event.target.innerText);
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'keyup',
                listener(event) {
                    onSearch(event.target.value.toLowerCase());
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'search',
                listener: onClear
            },
            {
                selector: `#id .ask-a-question`,
                event: 'click',
                listener: onAsk
            }
        ]
    });

    function buildFilters() {
        const filterOptions = [
            'All',
            'Mine',
            'Unanswered',
            'Answered',
            'Featured'
        ];

        return filterOptions.map(option => {
            return /*html*/ `
                <button type='button' class='btn ${selected === option ? 'btn-primary' : 'btn-outline-primary'} filter'>${option}</button>
            `
        }).join('\n');
    }

    return component;
}