// @START-IMPORTS
import CustomFormNewForm from './Forms/CustomForm/NewForm.js'
import CustomFormEditForm from './Forms/CustomForm/EditForm.js'
// @END-IMPORTS

export default [
    {
        list: 'CustomForm',
        editForm: CustomFormEditForm,
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
                type: 'choice',
                fillIn: true,
                value: null,
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