// import Action_GetQueryParameters from '../Actions/Action_GetQueryParameters.js'
// import Action_Store from '../Actions/Action_Store.js'

let settings = {};

const controller = {
    set(param) {
        settings = param;
    },
    get(prop) {
        return settings[prop];
    }
}

Object.freeze(settings);

export default controller;
