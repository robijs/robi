/**
 * 
 * @param {*} ms 
 * @returns 
 */
export function Wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
