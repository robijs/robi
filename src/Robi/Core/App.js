import { GetLocal } from '../Actions/GetLocal.js'

// @START-File
let appSettings = {};
let appLists;

const App = {
    list(name) {
        return appLists.find(item => item.list === name);
    },
    lists() {
        return appLists;
    },
    settings(param) {
        const { lists, routes, settings } = param;
        const { library, defaultRoute } = settings;

        // Set lists
        appLists = lists;

        // Set mode
        if (location.href.includes('localhost') || location.href.includes('127.0.0.1')) {
            settings.mode = 'dev';
        } else {
            settings.mode = 'prod';
        }

        // Set library
        if (!library) {
            settings.library = 'App';
        }

        // Set site
        if (settings.mode === 'prod') {
            console.log('Site:', location.href.split(`/${library}/` || '/App/')[0]);
            console.log('App library:', settings.library);

            settings.site = location.href.split(`/${library}/` || '/App/')[0];
        } else {
            const path = '/dev/app.html';
            const domain = location.href.split(path)[0];

            settings.domain = domain;
            settings.site = `${domain}${path}`;
        }

        // Set default route
        if (!defaultRoute) {
            settings.defaultRoute = routes.filter(r => !r.hide).map(route => route.path)[0];
        }

        // Set autoCollapseWidth
        if (!settings.autoCollapseWidth) {
            settings.autoCollapseWidth = 1305;
        }

        // Set theme
        const localTheme = GetLocal(`${settings.name}-theme`);
        
        if (localTheme) {
            settings.theme = localTheme;
        }

        // Set all
        appSettings = settings;
    },
    get(prop) {
        return appSettings[prop];
    },
    isDev() {
        if (App.get('mode') === 'dev') {
            return true;
        } else {
            return false;
        }
    },
    isProd() {
        if (App.get('mode') == 'prod') {
            return true;
        } else {
            return false;
        }
    },
    set(prop, value) {
        appSettings[prop] = value;
        return appSettings[prop];
    }
}

Object.freeze(App);

export { App }
// @END-File
