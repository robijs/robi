import { 
    Home,
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
        path: 'Home',
        hide: true,
        go() {
            Home();
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
        path: 'Settings',
        icon: 'bs-gear',
        go() {
            Settings();
        }
    },
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
    /** TEST */
    {
        path: 'Worker',
        hide: true,
        go() {
            View_Worker();
        }
    }
];

export { App, Routes };
