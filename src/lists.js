// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.
// Otherwise, changes made from CLI and GUI tools won't work properly.

// @START-IMPORTS
// @END-IMPORTS

export default [
    {
        list: 'CustomForm',
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
        heading: 'Single Line of Text',
        fields: [
            {
                name: 'SLOT',
                display: 'Single Line of Text',
                type: 'slot',
                validate(value) {
                    if (value === 'Test') {
                        return true;
                    } else {
                        return false;
                    }
                }
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
                type: 'mlot',
                validate(value) {
                    if (value === 'Test') {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        ]
    },
    {
        list: 'Number',
        fields: [
            {
                name: 'Number',
                type: 'number',
                validate(value) {
                    if (value === 1) {
                        return true;
                    } else {
                        return false;
                    }
                }
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
                ],
                validate(value) {
                    if (value === 'Two') {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        ]
    }
]