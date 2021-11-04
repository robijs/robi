export default [
    {
        list: 'TestFieldTypes',
        fields: [
            {
                name: 'SLOT',
                type: 'slot'
            },
            {
                name: 'MLOT',
                type: 'mlot'
            },
            {
                name: 'Number',
                type: 'number'
            },
            {
                name: 'choiceColumn',
                type: 'choice',
                choices: [
                    'One',
                    'Two',
                    'Three'
                ]
            }
        ]
    }
]