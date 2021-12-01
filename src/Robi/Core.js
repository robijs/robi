import { NameToHex, HexToRGB, HexToHSL } from './Actions/Colors.js'
import { Help } from './Components/Help.js'
import { Missing } from './Components/Missing.js'
import { Unauthorized } from './Components/Unauthorized.js'
import { Users } from './Components/Users.js'
import { Settings } from './Components/Settings.js'
import { Developer } from './Components/Developer.js'
import { QuestionTypes } from './Components/QuestionTypes.js'
import { QuestionBoard } from './Components/QuestionBoard.js'
import { QuestionAndReplies } from './Components/QuestionAndReplies.js'

let appSettings = {};

const App = {
    set(param) {
        const { routes, settings } = param;
        const { library, primaryColor, defaultRoute } = settings;

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
            console.log('Site:', location.href.split(library || '/App/')[0]);
            console.log('App library:', settings.library);

            settings.site = location.href.split(library || '/App/')[0];
        } else {
            settings.site = 'http://localhost';
        }

        // Set default route
        if (!defaultRoute) {
            settings.defaultRoute = routes.map(route => route.path)[0];
        }

        // Format color
        settings.primaryColorRGB = HexToRGB(NameToHex(primaryColor) || primaryColor);
        settings.primaryColorHSL = HexToHSL(NameToHex(primaryColor) || primaryColor);

        // Set all
        appSettings = settings;
    },
    get(prop) {
        return appSettings[prop];
    }
}

Object.freeze(App);

/** Routes */
const Routes = [
    {
        path: '403',
        type: 'system',
        hide: true,
        go(param) {
            Unauthorized(param);
        }
    },
    {
        path: '404',
        type: 'system',
        hide: true,
        go(param) {
            Missing(param);
        }
    },
    {
        path: 'Developer',
        type: 'system',
        roles: [
            'Developer'
        ],
        icon: 'code-slash',
        go(param) {
            Developer(param);
        }
    },
    {
        path: 'Help',
        type: 'system',
        icon: 'info-circle',
        go(param) {
            Help(param);
        }
    },
    {
        path: 'Questions',
        type: 'system',
        icon: 'chat-right-text',
        go(param) {
            const {
                parent,
                pathParts
            } = param;

            if (pathParts.length === 1) {
                QuestionTypes(param);
            } else if (pathParts.length === 2) {
                QuestionBoard({
                    parent,
                    path: pathParts[1]
                });
            } else if (pathParts.length === 3) {
                QuestionAndReplies({
                    parent,
                    path: pathParts[1],
                    itemId: parseInt(pathParts[2])
                });
            }
        }
    },
    {
        path: 'Settings',
        type: 'system',
        icon: 'bs-gear',
        go(param) {
            Settings(param);
        }
    },
    {
        path: 'Users',
        type: 'system',
        roles: [
            'Developer',
            'Administrator'
        ],
        icon: 'people',
        go(param) {
            const {
                parent,
                pathParts
            } = param;

            if (pathParts.length === 1) {
                Users(param);
            } else if (pathParts.length === 2) {
                Users({
                    itemId: parseInt(pathParts[1]),
                    parent
                });
            }
        }
    }
];

const store = {
    elementIdCounter: 0,
    viewScrollTop: 0,
    data: {},
    abortControllers: [],
    workers: [],
    components: {},
    models: {},
    lists: {},
    user: {},
    routes: []
};

const Store = {
    add(param) {
        const {
            type,
        } = param;

        switch (type) {
            case 'list':
                {
                    const {
                        list,
                        items
                    } = param;
        
                    store.lists[list] = items;
                    break;
                }
            case 'model':
                {
                    const {
                        name,
                        model
                    } = param;
        
                    store.models[name] = model;
                    break;
                }
            default:
                {
                    const {
                        name
                    } = param;
        
                    store.components[name] = param;
                    break;
                }
        }
    },
    addWorker(worker) {
        store.workers.push(worker);
    },
    terminateWorkers() {
        store.workers.forEach(worker => {
            worker.terminate();
        });
    },
    addAbortController(controller) {
        store.abortControllers.push(controller);
    },
    getAbortControllers() {
        return store.abortControllers;
    },
    abortAll() {
        store.abortControllers.forEach(controller => {
            controller.abort();
        });
    },
    get(name) {
        if (store.components[name]) {
            return store.components[name].component;
        } else if (store.lists[name]) {
            return store.lists[name];
        } else if(store.models[name]) {
            return store.models[name];
        } else {
            return undefined;
        }
    },
    getNextId() {
        return `App-${store.elementIdCounter++}`; 
    },
    remove(name) {
        store.components[name].component.remove();
        
        delete store.components[name];
    },
    // register(actionData) {
    //     store.data.push(actionData);
    // },
    // deregister(actionData) {
    //     const index = store.data.indexOf(actionData);

    //     store.data.splice(index, 1);
    // },
    // recall() {
    //     return store.data;
    // },
    empty() {
        store.components = {};
        // TODO: Do we want to persist data when routing?
        // store.data = [];
    },
    user(userInfo) {
        if (typeof userInfo === 'object') {
            store.user = userInfo;
        } else {
            return store.user;
        }
    },
    viewScrollTop(param) {
        if (param) {
            if (typeof param === 'number') {
                store.viewScrollTop = param;
            } else {
                console.log(`${param} is not a number`);
            }
        } else {
            return store.viewScrollTop;
        }
    },
    setData(name, data) {
        store.data[name] = data;
    },
    getData(name) {
        return store.data[name];
    },
    setRoutes(routes) {
        store.routes = routes;
    },
    routes() {
        return store.routes;
    }
}

Object.freeze(Store);


export { App, Routes, Store };
