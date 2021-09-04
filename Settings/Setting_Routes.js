/** Views */
import View_403 from '../Views/View_403.js'
import View_404 from '../Views/View_404.js'
import View_Home from '../Views/View_Home.js'
import View_Questions from '../Views/View_Questions.js'
import View_QuestionsBoard from '../Views/View_QuestionsBoard.js'
import View_Question from '../Views/View_Question.js'
import View_Users from '../Views/View_Users.js'
import View_Developer from '../Views/View_Developer.js'
import View_Help from '../Views/View_Help.js'
import View_Settings from '../Views/View_Settings.js'

/** Routes */
export default [
    {
        path: 'Home',
        hide: true,
        go() {
            View_Home();
        }  
    },
    {
        path: 'Questions',
        icon: 'question',
        go(param) { 
            const {
                pathParts
            } = param;

            if (pathParts.length === 1) {
                View_Questions();
            } else if (pathParts.length === 2) {
                View_QuestionsBoard({
                    path: pathParts[1]
                });
            } else if (pathParts.length === 3) {
                View_Question({
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
        icon: 'users',
        go(param) {
            const {
                pathParts
            } = param;

            if (pathParts.length === 1) {
                View_Users();
            } else if (pathParts.length === 2) {
                View_Users({
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
        icon: 'embed2',
        go(param) {
            View_Developer(param);
        }
    },
    {
        path: 'Help',
        icon: 'info',
        go() {
            View_Help();
        }
    },
    {
        path: 'Settings',
        icon: 'cog',
        go() {
            View_Settings();
        }
    },
    {
        path: '403',
        hide: true,
        go() {
            View_403();
        }
    },
    {
        path: '404',
        hide: true,
        go() {
            View_404();
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
]