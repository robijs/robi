/* Tasker */

export default function CreateGetFilter(param) {
    /** Interface */
    const {
        lookupField,
        field,
        operator,
        data
    } = param;

    let filter = '';

    data.forEach((item, index, data) => {
        /** Wrap value in single quotes ('') if it is a string */
        let typedValue;

        if (!field) {
            typedValue = typeof value === 'string' ? `'${item}'` : item;
        } else {
            typedValue = typeof value === 'string' ? `'${item[field]}'` : item[field];
        }

        filter += `${lookupField} eq '${typedValue}'`;

        if (data.length > 1 && index !== data.length - 1) {
            filter += ` ${operator} `
        }
    });

    return filter;
}