export default [
    {
        list: 'Test',
        fields: [
            {
                name: 'SLOT',
                display: 'Single line of text',
                type: 'slot'
            },
            {
                name: 'MLOT',
                display: 'Multiple lines of text',
                type: 'mlot'
            },
            {
                name: 'Number',
                display: 'Number',
                type: 'number'
            },
            {
                name: 'Choice',
                display: 'Choice',
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