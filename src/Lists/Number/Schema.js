export default {
    list: 'Number',
    display: 'Number',
    fields: [
        {
            name: 'Number',
            display: 'Number',
            type: 'number',
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