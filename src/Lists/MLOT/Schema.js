export default {
    list: 'MLOT',
    display: 'Multiple Lines of Text',
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
}