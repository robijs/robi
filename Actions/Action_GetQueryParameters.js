 /** 
 * Modified from {@link https://stackoverflow.com/a/61948784} 
 */
const queryParameters = location.href.split('?')[1];

function queryStringToObject(queryParameters) {
    const pairs = queryParameters.split('&');
    // → ["foo=bar", "baz=buzz"]
    
    const array = pairs.map(el => {
        const parts = el.split('=');
        return parts;
    });
    // → [["foo", "bar"], ["baz", "buzz"]]

    return Object.fromEntries(array);
    // → { "foo": "bar", "baz": "buzz" }
}

export default !queryParameters ? {} : queryStringToObject(queryParameters);
