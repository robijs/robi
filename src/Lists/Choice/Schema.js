export default {
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