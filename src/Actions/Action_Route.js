/** Actions */
import Action_History from './Action_History.js'
import Action_Store from './Action_Store.js'
import Action_Log from './Action_Log.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'
import Setting_Routes from '../Settings/Setting_Routes.js'

export default function Action_Route(path = Setting_App.get('defaultRoute'), options = {}) {
    const {
        scrollTop
    } = options;

    /** Remove modal overlay */
    const overlay = document.querySelector('.modal-backdrop');

    if (overlay) {
        overlay.remove();
    }

    /** Abort all pending fetch requests */
    Action_Store.abortAll();

    /** Terminate all running workers */
    Action_Store.terminateWorkers();

    /** Get references to core app components */
    const appContainer = Action_Store.get('appcontainer');
    const sidebar = Action_Store.get('sidebar');
    const mainContainer = Action_Store.get('maincontainer');

    /** Set scroll top */
    // App.ViewScrollTop = mainContainer.get().scrollTop;
    Action_Store.viewScrollTop(mainContainer.get().scrollTop);

    /** Remove all events attached to the maincontainer */
    mainContainer.removeEvents();

    /** Turn maincontainer padding on (default: 20px 50px) */
    mainContainer.paddingOn();

    /** Empty mainconatainer DOM element */
    mainContainer.empty();

    /** Empty store */
    Action_Store.empty();

    /** Re-add core app component references to store */
    Action_Store.add({
        name: 'appcontainer',
        component: appContainer
    });
    Action_Store.add({
        name: 'maincontainer',
        component: mainContainer
    });
    Action_Store.add({
        name: 'sidebar',
        component: sidebar
    });

    /** Check route path */
    const pathAndQuery = path.split('?');
    const pathParts = pathAndQuery[0].split('/');
    const queryParameters = pathAndQuery.length > 1 ? pathAndQuery[1] : '';

    /** Attach default query parameters */
    const defaultQueryParameters = Setting_App.Setting_App.getDefaultQueryParameters;

    if (!queryParameters && defaultQueryParameters) {
        path += `?${Setting_App.Setting_App.getDefaultQueryParameters}`;
    }

    /** Set browswer history state */
    Action_History({
        url: `${location.href.split('#')[0]}${(path) ? `#${path}` : ''}`,
        title: `${Setting_App.title}${(path) ? ` - ${pathAndQuery[0]}` : ''}`
        // title: `${App.title}${(path) ? ` - ${path}` : ''}`
    });

    /** Only select first path, remove any ? that might be passed in */
    const route = Action_Store.routes().find(item => item.path === pathParts[0]);

    if (!route) {
        // Action_Route('404');
        
        return;
    }

    sidebar.selectNav(route.path);

    /** Log route*/
    if (options.log !== false) {
        try {
            Action_Log({
                Title: 'Route',
                Message: `${Action_Store.user().Email || 'User'} routed to ${route.path}`,
                StackTrace: new Error().stack,
                // SessionId: '', // randomly generated UUID
                Module: import.meta.url
            });
        } catch (error) {
            console.error(error);
        }
    }

    /** Call .go() method */
    route.go({
        pathParts,
        props: queryStringToObject(path.split('?')[1])
    });
    
    /** 
     * Modified from {@link https://stackoverflow.com/a/61948784} 
     */
    function queryStringToObject(queryString) {
        if (!queryString) {
            return {}
        };

        const pairs = queryString.split('&');
        // → ["foo=bar", "baz=buzz"]
        
        const array = pairs.map(el => {
            const parts = el.split('=');
            return parts;
        });
        // → [["foo", "bar"], ["baz", "buzz"]]
        
        return Object.fromEntries(array);
        // → { "foo": "bar", "baz": "buzz" }
    }

    /** Set Scroll Top */
    /** @todo this needs to run only after all async calls have completed */
    /** @note maybe Views should always return a promise? */
    /** @note or could just use a callback passed to the view */
    if (scrollTop) {
        console.log(scrollTop);

        Action_Store.get('maincontainer').get().scrollTo({
            top: scrollTop
        });
    }
}
