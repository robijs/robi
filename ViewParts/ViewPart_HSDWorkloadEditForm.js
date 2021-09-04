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
export default async function ViewPart_HSDWorkloadEditForm(param) {
    const {
        item,
        parent
    } = param;

    const fields = [
        {
            internalFieldName: 'WorkloadServiceLine',
            displayName: 'Workload Service Line'
        },
        {
            internalFieldName: 'WorkloadType',
            displayName: 'Workload Type'
        },
        {
            internalFieldName: 'APC',
            displayName: 'APC'
        },
        {
            internalFieldName: 'PERVU',
            displayName: 'PERVU'
        },
        {
            internalFieldName: 'WRVU',
            displayName: 'WRVU'
        },
        {
            internalFieldName: 'RWP',
            displayName: 'RWP'
        },
        {
            internalFieldName: 'MHBD',
            displayName: 'MHBD'
        },
        {
            internalFieldName: 'DWV',
            displayName: 'DWV'
        },
    ];

    fields.forEach(field => {
        const {
            internalFieldName,
            displayName
        } = field;

        const component = Component_SingleLineTextField({
            label: displayName,
            value: item[internalFieldName]?.toString(),
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
