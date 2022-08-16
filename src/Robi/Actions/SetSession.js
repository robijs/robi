import { App } from '../Core/App.js'

// @START-File
/**
 *
 * @param {*} param
 */
export function SetSession(key, value) {
    sessionStorage.setItem(`${App.get('name')}-${key}`, value);
}
// @END-File
