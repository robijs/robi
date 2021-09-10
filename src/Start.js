/** Actions */
import Action_Store from './Actions/Action_Store.js'
import Action_Log from './Actions/Action_Log.js'
import Action_Error from './Actions/Action_Error.js'
import Action_GetCurrentUser from './Actions/Action_GetCurrentUser.js'
import Action_Route from './Actions/Action_Route.js'
import Action_AddLinks from './Actions/Action_AddLinks.js'
import Action_SetSessionStorage from './Actions/Action_SetSessionStorage.js'
import Action_Data from './Actions/Action_Data.js'
import Action_GenerateUUID from './Actions/Action_GenerateUUID.js'

/** Components */
import Component_SvgDefs from './Components/Component_SvgDefs.js'
import Component_Sidebar from './Components/Component_Sidebar.js'
import Component_AppContainer from './Components/Component_AppContainer.js'
import Component_MainContainer from './Components/Component_MainContainer.js'
import Component_FixedToast from './Components/Component_FixedToast.js'
import Component_Modal from './Components/Component_Modal.js'

/** Settings */
import Setting_App from './Settings/Setting_App.js'
import Setting_Dev from './Settings/Setting_Dev.js'

/** View Parts */
import ViewPart_ReleaseNotes from './ViewParts/ViewPart_ReleaseNotes.js'
import Setting_Routes from './Settings/Setting_Routes.js'

export default function Start(param) {
    const {
        routes,
        settings
    } = param;

    console.log(param);

    /** Add new string method */
    String.prototype.toTitleCase = function () {
        return this
            .toLowerCase()
            .split(' ')
            .map(word => word.replace(word[0], word[0].toUpperCase()))
            .join(' ');
    }

    if (Setting_Dev.ErrorLogging === 'on') {
        /** Format error objects for JSON.stringify() to work properly */
        function replaceErrors(key, value) {
            if (value instanceof Error) {
                var error = {};

                Object.getOwnPropertyNames(value).forEach(function (key) {
                    error[key] = value[key];
                });

                return error;
            }

            return value;
        }

        /** Log errors to SharePoint list */
        window.onerror = async (message, source, lineno, colno, error) => {
            Action_Error({
                Message: message,
                Source: source,
                Line: lineno,
                ColumnNumber: colno,
                Error: JSON.stringify(error, replaceErrors)
            });
        }

        /** Log errors from Promises to SharePoint list */
        window.addEventListener("unhandledrejection", event => {
            Action_Error({
                Message: event.reason.message,
                Source: import.meta.url,
                Line: null,
                ColumnNumber: null,
                Error: event.reason.stack
            });
        });
    }

    /** Start app on page load */
    window.onload = async () => {
        /** App settings */
        const {
            title,
            logo,
            usersList,
            usersFields,
            beforeLoad,
            links,
            lists,
            svgSymbols,
            sessionStorageData,
            sidebarDropdown
        } = Setting_App;

        /** Add links to head */
        Action_AddLinks({
            links
        });

        /** Set sessions storage */
        Action_SetSessionStorage({
            sessionStorageData
        });

        /** Get list items */
        const data = await Action_Data(lists);

        if (data) {
            /** Add list items to store */
            lists.forEach((param, index) => {
                    const {
                        list
                    } = param;

                Action_Store.add({
                    type: 'list',
                    list,
                    items: data[index]
                });
            });
        }

        /** Load svg definitions */
        const svgDefs = Component_SvgDefs({
            svgSymbols
        });

        // console.log('SVG Defs', svgDefs);

        svgDefs.add();

        /** Get AD user and Users list item properties */
        Action_Store.user( await Action_GetCurrentUser({
            list: usersList,
            fields: usersFields
        }));

        /** Add App Container to #app */
        const appContainer = Component_AppContainer();

        Action_Store.add({
            name: 'appcontainer',
            component: appContainer
        });

        // console.log('App Container', appContainer);

        appContainer.add();

        /** Get current route */
        const path = location.href.split('#')[1];

        /** Attach Router to browser back/forward event */
        window.addEventListener('popstate', (event) => {
            if (event.state) {
                Action_Route(event.state.url.split('#')[1], {
                    scrollTop: Action_Store.viewScrollTop()
                }); 
            }
        });

        /** Store routes */
        Action_Store.setRoutes(routes.concat(Setting_Routes));

        /** Sidebar Component */
        const sidebar = Component_Sidebar({
            logo,
            parent: appContainer,
            path,
            sidebarDropdown
        });

        Action_Store.add({
            name: 'sidebar',
            component: sidebar
        });

        sidebar.add();

        /** Main Container */
        const mainContainer = Component_MainContainer({
            parent: appContainer
        });

        Action_Store.add({
            name: 'maincontainer',
            component: mainContainer
        });

        mainContainer.add();
        
        /** Run callback defined in Setting_App.js Before first view loads */
        if (beforeLoad) {
            await beforeLoad();
        }

        /** Show App Container */
        appContainer.show('flex');

        /** Generate Session Id */
        const sessionId = Action_GenerateUUID();

        /** Format Title for Sessin/Local Storage keys */
        const storageKeyPrefix = Setting_App.title.split(' ').join('_');

        /** Set Session Id */
        sessionStorage.setItem(`${storageKeyPrefix}-sessionId`, sessionId)

        /** Log in*/
        try {
            Action_Log({
                Title: 'Log in',
                Message: `${Action_Store.user().Email || 'User'} successfully loaded ${title}`,
                StackTrace: new Error().stack,
                Module: import.meta.url
            });
        } catch (error) {
            console.error(error);
        }

        console.log(Action_Store.routes());

        /** Run current route on page load */
        Action_Route(path, {
            log: false
        });

        /** Check Local Storage for release notes */
        const isReleaseNotesDismissed = localStorage.getItem(`${storageKeyPrefix}-releaseNotesDismissed`);

        if (!isReleaseNotesDismissed) {
            // console.log('Show release notes message.');
            
            /** Release Notes */
            const releaseNotes = Component_FixedToast({
                title: 'New version is live!',
                message: 'View release notes',
                bottom: '20px',
                right: '10px',
                action(event) {
                    const modal = Component_Modal({
                        title: '',
                        fade: true,
                        background: Setting_App.secondaryColor,
                        centered: true,
                        addContent(modalBody) {
                            ViewPart_ReleaseNotes({
                                margin: '0px',
                                parent: modalBody,
                            });
                        },
                        parent: appContainer
                    });
            
                    modal.add();
                },
                onClose(event) {
                    /** Set Local Storage */
                    localStorage.setItem(`${storageKeyPrefix}-releaseNotesDismissed`, 'true');
                },
                parent: appContainer
            });

            releaseNotes.add();
        } else {
            console.log('Release notes message was already dismissed.');
        }
    }
}
