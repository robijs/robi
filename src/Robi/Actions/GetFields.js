import { App } from '../Core/App.js'

// @START-File
/**
 * 
 * @param {Object} param - Interface to this Robi action
 * @returns {Array}
 */
export function GetFields(param) {
    const {
        list,
        view
    } = param;

    const { fields, views } = App.list(list);

    // return tableFields
    return views
        .find(item => item.name === view)
        .fields.flatMap(name => fields.find(field => field.name === name) ? fields.find(field => field.name === name) : [])
        .map(field => {
            const { name, display, type, render } = field;
            
            return { name, display, type, render };
        });
}
// @END-File
