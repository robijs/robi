// @START-IMPORTS
import MLOTNewForm from './Forms/MLOT/NewForm.js'
import SLOTEditForm from './Forms/SLOT/EditForm.js'
import CustomFormNewForm from './Forms/CustomForm/NewForm.js'
import CustomFormEditForm from './Forms/CustomForm/EditForm.js'
// @END-IMPORTS

export default [
    {
        list: 'CustomForm',
        editForm: CustomFormEditForm,
        newForm: CustomFormNewForm,
        display: 'Custom Form',
        fields: [
            {
                name: 'SLOT',
                display: 'Single Line of Text',
                type: 'slot'
            },
            {
                name: 'MLOT',
                display: 'Multiple Lines of Text',
                type: 'mlot'
            },
            {
                name: 'Number',
                type: 'number'
            },
            {
                name: 'Choice',
                type: 'choice',
                value: null,
                choices: [
                    'One',
                    'Two',
                    'Three'
                ]
            },
            {
                name: 'MultiChoice',
                display: 'Multi Choice',
                type: 'multichoice',
                fillIn: true,
                choices: [
                    'One',
                    'Two',
                    'Three'
                ]
            }
        ]
    },
    {
        list: 'SLOT',
        editForm: SLOTEditForm,
        heading: 'Single Line of Text',
        fields: [
            {
                name: 'SLOT',
                display: 'Single Line of Text',
                type: 'slot'
            }
        ]
    },
    {
        list: 'MLOT',
        newForm: MLOTNewForm,
        heading: 'Multiple Lines of Text',
        fields: [
            {
                name: 'MLOT',
                display: 'Multiple Lines of Text',
                type: 'mlot'
            }
        ]
    },
    {
        list: 'Number',
        fields: [
            {
                name: 'Number',
                type: 'number'
            }
        ]
    },
    {
        list: 'Choice',
        fields: [
            {
                name: 'Choice',
                type: 'choice',
                value: null,
                choices: [
                    'One',
                    'Two',
                    'Three'
                ]
            }
        ]
    }
]