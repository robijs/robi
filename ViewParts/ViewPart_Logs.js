/** Actions */
import Action_Get from '../Actions/Action_Get.js'

/** Components */
import Component_FoldingCube from '../Components/Component_FoldingCube.js'
import Component_Container from '../Components/Component_Container.js'
import Component_Alert from '../Components/Component_Alert.js'
import Component_SingleLineTextField from '../Components/Component_SingleLineTextField.js'
import Component_BootstrapButton from '../Components/Component_BootstrapButton.js'
import Action_Route from '../Actions/Action_Route.js'

export default async function View_Errors(param) {
    const {
        sessionId,
        parent
    } = param;

    /** Errors Container */
    const errorsContainer = Component_Container({
        display: 'block',
        width: '100%',
        parent
    });

    errorsContainer.add();

    /** Loading Indicator */
    const loadingIndicator = Component_FoldingCube({
        label: 'Loading logs',
        margin: '40px 0px',
        parent
    });
    
    loadingIndicator.add();

    /** Get Errors */
    const logs = await Action_Get({
        list: 'Log',
        select: 'Id,Title,Message,Module,StackTrace,SessionId,Created,Author/Title',
        expand: 'Author/Id',
        filter: `SessionId eq '${sessionId}'`
    });

    console.log(logs);

    /** Summary Card */
    const alertCard = Component_Alert({
        text: logs.length > 0 ? 
            /*html*/ `
                <h5>Logs: ${logs.length}</h5>
                <hr>
            ` : 
            'No logs associated with this Session Id',
        type: logs.length > 0 ? 'info' : 'warning',
        margin: '0px 20px',
        parent: errorsContainer
    });

    alertCard.add();

    /** Add Errors to Alert */
    logs.forEach((item, index) => {
        const goToErrorButton = Component_BootstrapButton({
            action(event) {
                Action_Route(`Developer/Logs/${item.Id}`);
            },
            parent: alertCard,
            margin: '0px 0px 20px 0px',
            type: 'btn-info',
            value: `Go to log: ${item.Id}`
        });

        goToErrorButton.add();

        const readOnlyFields = [
            {
                internalFieldName: 'SessionId',
                displayName: 'SessionId'
            },
            {
                internalFieldName: 'Title',
                displayName: 'Type'
            },
            {
                internalFieldName: 'FiscalYear',
                displayName: 'FiscalYear'
            },
            {
                internalFieldName: 'Module',
                displayName: 'Module',
            },
            {
                internalFieldName: 'Message',
                displayName: 'Message',
            },
            {
                internalFieldName: 'StackTrace',
                displayName: 'Stack Trace',
                type: 'mlot'
            },
            {
                internalFieldName: 'Created',
                displayName: 'Created',
                type: 'date'
            },
            {
                internalFieldName: 'Author',
                displayName: 'Author'
            }
        ];
    
        readOnlyFields.forEach(field => addReadOnlyField(field));
    
        /** Add Read Only Field */
        function addReadOnlyField(field, parent) {
            const {
                internalFieldName,
                displayName,
                type
            } = field;
            
            let value = item[internalFieldName]?.toString();
    
            if (type === 'date') {
                value = new Date(item[internalFieldName]);
            }

            else if (type === 'mlot') {
                value = item[internalFieldName].split('<hr>').join('\n');
            }

            else if (internalFieldName === 'Message') {
                const data = JSON.parse(item.Message);
                
                value = /*html*/ `
                    <table>
                `;

                for (const property in data) {
                    value += /*html*/ `
                        <tr>
                            <th style='padding-right: 15px;'>${property}</th>
                            <td>${data[property]}</td>
                        </tr>
                    `;
                }

                value += /*html*/ `
                    </table>
                `;
            }
    
            else if (internalFieldName === 'Author') {
                value = item.Author.Title
            }

            const component = Component_SingleLineTextField({
                label: displayName,
                value: value || /*html*/ `<span style='font-size: 1em; display: inline; color: white;' class='badge badge-dark'>No data</span>`,
                readOnly: true,
                fieldMargin: '0px',
                parent: alertCard
            });
    
            component.add();
        }

        if (index < logs.length - 1) {
            alertCard.get().insertAdjacentHTML('beforeend', '<hr>');
        }
    });

    /** Remove Loading Indicator */
    loadingIndicator.remove();
}
