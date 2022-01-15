export default {
    list: 'MulitChoice',
    display: 'Multi Choice',
    fields: [
        {
            name: 'MultiChoice',
            display: 'Multi Choice',
            type: 'multichoice',
            fillIn: true,
            choices: [
                'One',
                'Two',
                'Three'
            ],
            validate(value) {
                if (value === 'Test') {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]
}