import {
    Help,
    Missing,
    Unauthorized,
    Users,
    Settings,
    Developer,
    QuestionTypes,
    QuestionBoard,
    QuestionAndReplies
} from './Views.js'

let settings = {};

const App = {
    set(param) {
        let { library, primaryColor } = param;

        // Set mode
        if (location.href.includes('localhost') || location.href.includes('127.0.0.1')) {
            param.mode = 'dev';
        } else {
            param.mode = 'prod';
        }

        if (!library) {
            param.library = 'App';
        }

        // Set site
        if (param.mode === 'prod') {
            console.log('Site:', location.href.split(library || '/App/')[0]);
            console.log('App library:', param.library);

            param.site = location.href.split(library || '/App/')[0];
        }

        // Set color
        param.primaryColorRGB = hex2rgb(colourNameToHex(primaryColor) || primaryColor);

        // Set all settings
        settings = param;
    },
    get(prop) {
        return settings[prop];
    }
}

function colourNameToHex(color) {
    const colors = {
        "aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff",
        "beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887",
        "cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "cyan": "#00ffff",
        "darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f",
        "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1",
        "darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969", "dodgerblue": "#1e90ff",
        "firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff",
        "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "green": "#008000", "greenyellow": "#adff2f",
        "honeydew": "#f0fff0", "hotpink": "#ff69b4",
        "indianred ": "#cd5c5c", "indigo": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c",
        "lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2",
        "lightgrey": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de",
        "lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6",
        "magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee",
        "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5",
        "navajowhite": "#ffdead", "navy": "#000080",
        "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6",
        "palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093", "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080",
        "rebeccapurple": "#663399", "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1",
        "saddlebrown": "#8b4513", "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0", "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4",
        "tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0",
        "violet": "#ee82ee",
        "wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5",
        "yellow": "#ffff00", "yellowgreen": "#9acd32"
    };

    if (typeof colors[color.toLowerCase()] !== undefined) {
        return colors[color.toLowerCase()];
    }
}

const hex2rgb = (hex) => {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `${r},${g},${b}`;
};

Object.freeze(App);

/** Routes */
const Routes = [
    {
        path: '403',
        hide: true,
        go(param) {
            Unauthorized(param);
        }
    },
    {
        path: '404',
        hide: true,
        go(param) {
            Missing(param);
        }
    },
    {
        path: 'Developer',
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
        icon: 'info-circle',
        go(param) {
            Help(param);
        }
    },
    {
        path: 'Questions',
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
        icon: 'bs-gear',
        go(param) {
            Settings(param);
        }
    },
    {
        path: 'Users',
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

const data = {
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
        
                    data.lists[list] = items;
                    break;
                }
            case 'model':
                {
                    const {
                        name,
                        model
                    } = param;
        
                    data.models[name] = model;
                    break;
                }
            default:
                {
                    const {
                        name
                    } = param;
        
                    data.components[name] = param;
                    break;
                }
        }
    },
    addWorker(worker) {
        data.workers.push(worker);
    },
    terminateWorkers() {
        data.workers.forEach(worker => {
            worker.terminate();
        });
    },
    addAbortController(controller) {
        data.abortControllers.push(controller);
    },
    getAbortControllers() {
        return data.abortControllers;
    },
    abortAll() {
        data.abortControllers.forEach(controller => {
            controller.abort();
        });
    },
    get(name) {
        if (data.components[name]) {
            return data.components[name].component;
        } else if (data.lists[name]) {
            return data.lists[name];
        } else if(data.models[name]) {
            return data.models[name];
        } else {
            return undefined;
        }
    },
    getNextId() {
        return `App-${data.elementIdCounter++}`; 
    },
    remove(name) {
        data.components[name].component.remove();
        
        delete data.components[name];
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
        data.components = {};
        // TODO: Do we want to persist data when routing?
        // store.data = [];
    },
    user(userInfo) {
        if (typeof userInfo === 'object') {
            data.user = userInfo;
        } else {
            return data.user;
        }
    },
    viewScrollTop(param) {
        if (param) {
            if (typeof param === 'number') {
                data.viewScrollTop = param;
            } else {
                console.log(`${param} is not a number`);
            }
        } else {
            return data.viewScrollTop;
        }
    },
    setData(name, data) {
        data.data[name] = data;
    },
    getData(name) {
        return data.data[name];
    },
    setRoutes(routes) {
        data.routes = routes;
    },
    routes() {
        return data.routes;
    }
}

Object.freeze(Store);


export { App, Routes, Store };
