/** Actions */
import Action_Get from '../Actions/Action_Get.js'

/* Components */
import Component_FoldingCube from '../Components/Component_FoldingCube.js'
import Component_SingleLineTextField from '../Components/Component_SingleLineTextField.js'
import Component_DropDownField from '../Components/Component_DropDownField.js'

/**
 * ViewPart_EditUser
 * @description
 * @returns {Object} - @method {getFieldValues} call that return values for User
 */
export default async function ViewPart_HSDEnrollmentNewForm(param) {
    const {
        parent
    } = param;

    const fields = [
        {
            internalFieldName: 'ADStatus',
            displayName: 'AD Status'
        },
        {
            internalFieldName: 'Gender',
            displayName: 'Gender'
        },
        {
            internalFieldName: 'AgeGroup',
            displayName: 'Age Group'
        },
        {
            internalFieldName: 'Forecast',
            displayName: 'Forecast'
        },
        {
            internalFieldName: 'Adjusted',
            displayName: 'Adjusted'
        },
    ]

    fields.forEach(field => {
        const {
            internalFieldName,
            displayName
        } = field;

        const component = Component_SingleLineTextField({
            label: displayName,
            fieldMargin: '0px 40px 20px 40px',
            parent
        });
    
        component.add();
    });

    return {
        getFieldValues() {
            const data = {};

            return data;
        }
    };
}
