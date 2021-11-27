import { Get } from './Get.js'

/**
 * 
 * @param {*} prop 
 * @returns 
 */
export async function GetAppSetting(prop) {
    const getItem = await Get({
        list: 'Settings',
        filter: `Key eq '${prop}'`
    });

    return getItem ? getItem[0] : undefined;
}
