// @START-File
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

export { Routes }
// @END-File