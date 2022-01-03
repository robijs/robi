export default [
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
                fillIn: true,
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