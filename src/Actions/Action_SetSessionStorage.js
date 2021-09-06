/**
 * Set session storage key value pairs.
 * @param {Object}   param          Interface to module.   
 */
export default async function Action_SetSessionStorage(param) {
    const {
        sessionStorageData
    } = param;

    sessionStorageData.forEach(item => {
        const {
            key,
            value
        } = item;

        sessionStorage.setItem(key, value);
    });
}