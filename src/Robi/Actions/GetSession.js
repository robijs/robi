import { App } from '../Core/App.js'

// @START-File
/**
 * Set session storage key value pairs.
 * @param {Array} session
 */
export function GetSession(key) {
    return sessionStorage.getItem(`${App.get('name') ? `${App.get('name')}-` : '' }${key}`);
}
// @END-File
