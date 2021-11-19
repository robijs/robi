import { 
    Help,
    Missing,
    Unauthorized,
    Users,
    Settings,
    Developer,
    Questions,
    QuestionsBoard,
    Question 
} from './Views.js'

let settings = {};

const App = {
    set(param) {
        let { library } = param;

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

        settings = param;
    },
    get(prop) {
        return settings[prop];
    }
}

Object.freeze(App);

/** Routes */
const Routes = [
    {
        path: '403',
        hide: true,
        go() {
            Unauthorized();
        }
    },
    {
        path: '404',
        hide: true,
        go() {
            Missing();
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
        go() {
            Help();
        }
    },
    {
        path: 'Questions',
        icon: 'chat-right-text',
        go(param) { 
            const {
                pathParts
            } = param;

            if (pathParts.length === 1) {
                Questions();
            } else if (pathParts.length === 2) {
                QuestionsBoard({
                    path: pathParts[1]
                });
            } else if (pathParts.length === 3) {
                Question({
                    path: pathParts[1],
                    itemId: parseInt(pathParts[2])
                });
            }
        } 
    },
    {
        path: 'Settings',
        icon: 'bs-gear',
        go() {
            Settings();
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
                pathParts
            } = param;

            if (pathParts.length === 1) {
                Users();
            } else if (pathParts.length === 2) {
                Users({
                    itemId: parseInt(pathParts[1])
                });
            }
        }  
    }
];

export { App, Routes };
