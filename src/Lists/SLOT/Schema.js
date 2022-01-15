export default {
    list: 'SLOT',
    display: 'Single Line of Text',
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
}