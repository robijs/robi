/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_UpdateItem from '../Actions/Action_UpdateItem.js'
import Action_Store from '../Actions/Action_Store.js'

/** Components */
import Component_FoldingCube from '../Components/Component_FoldingCube.js'
import Component_SingleLineTextField from '../Components/Component_SingleLineTextField.js'
import Component_Container from '../Components/Component_Container.js'
import Component_StatusField from '../Components/Component_StatusField.js'
import Component_Notification from '../Components/Component_Notification.js'

/** View Parts */
import ViewPart_Comments from './ViewPart_Comments.js'
import ViewPart_Logs from './ViewPart_Logs.js'

/**
 * ViewPart_EditUser
 * @description
 * @returns {Object} - @method {getFieldValues} call that return values for User
 */
export default function ViewPart_ErrorForm(param) {
    const {
        row,
        table,
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
            displayName: 'Session Id'
        },
        {
            internalFieldName: 'Source',
            displayName: 'Source'
        },
        {
            internalFieldName: 'Message',
            displayName: 'Message',
            type: 'mlot'
        },
        {
            internalFieldName: 'Error',
            displayName: 'Error',
            type: 'mlot'
        },
        {
            internalFieldName: 'Line',
            displayName: 'Line Number'
        },
        {
            internalFieldName: 'ColumnNumber',
            displayName: 'Column Number'
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
            value = item[internalFieldName]?.split('<hr>').join('\n');
        }

        else if (internalFieldName === 'Author') {
            value = item.Author.Title
        }

        const component = Component_SingleLineTextField({
            label: displayName,
            value: value || /*html*/ `<span style='font-size: 1em; display: inline' class='badge badge-dark'>No data</span>`,
            readOnly: true,
            fieldMargin: '0px',
            parent
        });

        component.add();
    }

    /** Status */
    const statusField = Component_StatusField({
        async action(event) {
           statusField.value(event.target.innerText);

           const updatedItem = await Action_UpdateItem({
                list: 'Errors',
                itemId: item.Id,
                select: 'Id,Message,Error,Source,Line,ColumnNumber,SessionId,Status,Created,Author/Title',
                expand: 'Author/Id',
                data: {
                    Status: event.target.innerText
                }
           });

           console.log(`Error Item Id: ${item.Id} updated.`, updatedItem);

           /** Update Table Row */
           table.updateRow({
                row,
                data: updatedItem
            });

            /** Show toast */
            const toast = Component_Notification({
                text: `Id <strong>${item.Id}</strong> set to <strong>${updatedItem.Status}</strong>!`,
                type: 'bs-toast',
                parent: Action_Store.get('maincontainer')
            });

            toast.add();
        },
        parent,
        label: 'Status',
        margin: '0px 20px 40px 20px',
        value: item.Status || 'Not Started'
    });

    statusField.add();
    
    /** Logs */
    ViewPart_Logs({
        sessionId: item.SessionId,
        parent,
    });

    /** Comments */
    ViewPart_Comments({
        parentId: item.Id,
        padding: '0px 20px',
        parent,
    });

    return {
        getFieldValues() {
            const data = {
              
            };

            return data;
        }
    };
}
