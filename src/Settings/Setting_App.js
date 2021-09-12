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
