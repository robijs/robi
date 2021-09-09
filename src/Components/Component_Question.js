/** Actions */
import Action_Component from '../Actions/Action_Component.js'
import Action_Store from '../Actions/Action_Store.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

export default function Component_QuestionCard(param) {
    const {
        question,
        margin,
        parent,
        onEdit,
        position
    } = param;

    const {
        Title,
        Body,
        Featured,
        Author,
        Editor,
        Created,
        Modified,
        replies
    } = question;

    const replyCount = replies.length;
    const lastReply = replies[0];
    
    const component = Action_Component({
        html: /*html*/ `
            <div class='question'>
                <div class='card'>
                    <div class='card-body'>
                        <h5 class='card-title'>
                            <span class='title-text'>${Title}</span>
                            ${
                                Featured ? 
                                /*html*/ `
                                    <span class='badge badge-info' role='alert'>Featured</span>
                                ` : 
                                ''
                            }
                        </h5>
                        <h6 class='card-subtitle mb-2 text-muted'>${Author.Title} ${formatDate(Created)}</h6>
                        <div class='card-text mb-2'>${Body || ''}</div>
                        <h6 class='card-subtitle mt-2 text-muted edit-text'>${edited(Created, Modified) ? `Last edited by ${Editor.Title} ${formatDate(Modified)} ` : ''}</h6>
                    </div>
                    ${buildFooter(lastReply)}
                </div>
                ${
                    Author.Name === Action_Store.user().LoginName ?
                    /*html*/ `
                        <div class='edit-button-container'>
                            <button type='button' class='btn btn-primaryColor edit'>Edit question</button>
                        </div>
                    ` :
                    ''
                }
                <div class='reply-count'>
                    <span class='reply-count-label'>Replies</span>
                    <span class='badge badge-secondary reply-count-value'>${replyCount}</span>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                width: 100%;
                margin: ${margin || '0px'};
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

            /** Edit button */
            #id .btn-primaryColor {
                background: ${Setting_App.primaryColor};
                color: white;
            }

            #id .btn-primaryColor:focus,
            #id .btn-primaryColor:active {
                box-shadow: none;
            }
            
            #id .edit-button-container {
                display: flex;
                justify-content: flex-end;
                margin: 20px 0px;
            }

            /** Replies */
            #id .reply-count {
                margin: 20px 0px;
                font-size: 1.3em;
            }
            
            #id .badge-info {
                padding: 4px 8px;
                margin: 0px;
                font-weight: 400;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .edit',
                event: 'click',
                listener: onEdit
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

    function buildFooter(lastReply) {
        if (lastReply) {
            return /*html*/ `
                <div class='card-footer question-last-reply'>
                   ${lastReplyTemplate(lastReply)}
                </div>
            `;
        } else {
           return '';
        }
    }
    
    function lastReplyTemplate(lastReply) {
        const {
            Author,
            Body,
            Created
        } = lastReply;

        return /*html*/ `
            <span>
                <span>Last reply by ${Author.Title}</span>
                <span>${formatDate(Created)}</span>
            </span>
            <p class='card-text mt-2'>${Body}</p>
        `;
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

    component.setQuestion = (param) => {
        const {
            Title,
            Body,
            Modified,
            Editor
        } = param;

        component.find('.title-text').innerHTML = Title; 
        component.find('.card-text').innerHTML = Body || '';
        component.find('.edit-text').innerHTML = `Last edited by ${Editor.Title} ${formatDate(Modified)}`;
    }

    component.addCount = () => {
        const replyCount = component.find('.reply-count-value');

        replyCount.innerText = parseInt(replyCount.innerText) + 1;
    }

    component.updateLastReply = (reply) => {
        let footer = component.find('.card-footer');

        if (footer) {
            footer.innerHTML = lastReplyTemplate(reply);
        } else {
            component.find('.card').insertAdjacentHTML('beforeend', buildFooter(reply));
        }

    }
    
    component.editButton = () => {
        return component.find('.edit');
    }

    return component;
}