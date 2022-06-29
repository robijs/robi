// @START-File
/**
 *
 * @param {*} arguments
 */
export function classes() {
    if (!arguments.length === 0) {
        return '';
    }

    return [...arguments]
        .flatMap(arg => {
            if (typeof arg === 'string' || typeof arg === 'number') {
                return arg;
            }

            if (Array.isArray(arg)) {
                return arg.map((subArg) => classes(subArg))
            }

            if (typeof arg === 'object') {
                return Object.entries(arg).filter(([key, value]) => value).map(([key, value]) => key);
            }
        })
        .join(' ');
}
// @END-File
