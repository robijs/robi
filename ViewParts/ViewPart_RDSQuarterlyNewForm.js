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
export default async function ViewPart_RDSQuarterlyNewForm(param) {
    const {
        parent
    } = param;

    const fields = [
        {
            internalFieldName: 'Title',
            displayName: 'Quarter'
        },
        {
            internalFieldName: 'Subtotal',
            displayName: 'Subtotal'
        },
        {
            internalFieldName: 'MEPRSCode',
            displayName: 'MEPRS Code'
        },
        {
            internalFieldName: 'MEPRSDescription',
            displayName: 'MEPRS Description'
        },
        {
            internalFieldName: 'DHAPredictedQuarterlyFTEs',
            displayName: 'DHA Predicted Quarterly FTEs'
        },
        {
            internalFieldName: 'PercentageDHAPredictedFTEs',
            displayName: 'Percentage DHA Predicted FTEs'
        },
        {
            internalFieldName: 'MTFPredictedFTEs',
            displayName: 'MTF Predicted FTEs'
        },
        {
            internalFieldName: 'MTFPredictedPercentage',
            displayName: 'MTF Predicted Percentage'
        },
        {
            internalFieldName: 'MTFExplanation',
            displayName: 'MTF Explanation'
        },
    ];

    fields.forEach(field => {
        const {
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
