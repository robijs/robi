/** Actions */
import Action_Get from '../Actions/Action_Get.js'

/** Components */
import Component_FoldingCube from '../Components/Component_FoldingCube.js'
import Component_SingleLineTextField from '../Components/Component_SingleLineTextField.js'
import Component_Container from '../Components/Component_Container.js'
import Component_StatusField from '../Components/Component_StatusField.js'

/** View Parts */
import ViewPart_Errors from './ViewPart_Errors.js'

/**
 * @description
 * @returns {Object} - @method {getFieldValues} call that return values for User
 */
export default function ViewPart_LogForm(param) {
    const {
        item,
        parent
    } = param;

    const readOnlyFields = [
        {
            internalFieldName: 'id',
            displayName: 'id'
        },
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
            displayName: 'Message'
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

    const readOnlyContainer = Component_Container({
        direction: 'column',
        width: '100%',
        padding: '0px 20px',
        parent
    });

    readOnlyContainer.add();

    readOnlyFields.forEach(field => addReadOnlyField(field, readOnlyContainer));

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
            value: value || /*html*/ `<span style='font-size: 1em; display: inline;' class='badge badge-dark'>No data</span>`,
            readOnly: true,
            fieldMargin: '0px',
            parent
        });

        component.add();
    }

    /** Errors */
    ViewPart_Errors({
        sessionId: item.SessionId,
        parent
    });

    return {
        getFieldValues() {
            const data = {
              
            };

            return data;
        }
    };
}
