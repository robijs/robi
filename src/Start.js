import { Log, LogError, GetCurrentUser, Route, AddLinks, SetSessionStorage, Data, GenerateUUID } from './Core/Actions.js'
import Store from './Core/Store.js';
import Component_SvgDefs from './Components/Component_SvgDefs.js'
import Component_Sidebar from './Components/Component_Sidebar.js'
import Component_AppContainer from './Components/Component_AppContainer.js'
import Component_MainContainer from './Components/Component_MainContainer.js'
import Component_FixedToast from './Components/Component_FixedToast.js'
import Component_Modal from './Components/Component_Modal.js'
import { App, Routes } from './Core/Settings.js'
import ViewPart_ReleaseNotes from './ViewParts/ViewPart_ReleaseNotes.js'

export default function Start(param) {
    const {
        routes,
        settings
    } = param;

    App.set(settings);

    /** Add new string method */
    String.prototype.toTitleCase = function () {
        return this
            .toLowerCase()
            .split(' ')
            .map(word => word.replace(word[0], word[0].toUpperCase()))
            .join(' ');
    }

    if (App.get('dev').ErrorLogging === 'on') {
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
            LogError({
                Message: message,
                Source: source,
                Line: lineno,
                ColumnNumber: colno,
                Error: JSON.stringify(error, replaceErrors)
            });
        }

        /** Log errors from Promises to SharePoint list */
        window.addEventListener("unhandledrejection", event => {
            LogError({
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
        } = settings;

        /** Add links to head */
        AddLinks({
            links
        });

        /** Set sessions storage */
        SetSessionStorage({
            sessionStorageData
        });

        /** Get list items */
        const data = await Data(lists);

        if (data) {
            /** Add list items to store */
            lists.forEach((param, index) => {
                    const {
                        list
                    } = param;

                Store.add({
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
        Store.user( await GetCurrentUser({
            list: usersList,
            fields: usersFields
        }));

        /** Add App Container to #app */
        const appContainer = Component_AppContainer();

        Store.add({
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
                Route(event.state.url.split('#')[1], {
                    scrollTop: Store.viewScrollTop()
                }); 
            }
        });

        /** Store routes */
        Store.setRoutes(routes.concat(Routes));

        /** Sidebar Component */
        const sidebar = Component_Sidebar({
            logo,
            parent: appContainer,
            path,
            sidebarDropdown
        });

        Store.add({
            name: 'sidebar',
            component: sidebar
        });

        sidebar.add();

        /** Main Container */
        const mainContainer = Component_MainContainer({
            parent: appContainer
        });

        Store.add({
            name: 'maincontainer',
            component: mainContainer
        });

        mainContainer.add();
        
        /** Run callback defined in settings Before first view loads */
        if (beforeLoad) {
            await beforeLoad();
        }

        /** Show App Container */
        appContainer.show('flex');

        /** Generate Session Id */
        const sessionId = GenerateUUID();

        /** Format Title for Sessin/Local Storage keys */
        const storageKeyPrefix = settings.title.split(' ').join('_');

        /** Set Session Id */
        sessionStorage.setItem(`${storageKeyPrefix}-sessionId`, sessionId)

        /** Log in*/
        try {
            Log({
                Title: 'Log in',
                Message: `${Store.user().Email || 'User'} successfully loaded ${title}`,
                StackTrace: new Error().stack,
                Module: import.meta.url
            });
        } catch (error) {
            console.error(error);
        }

        /** Run current route on page load */
        Route(path, {
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
                        background: settings.secondaryColor,
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
        }
    }
}
