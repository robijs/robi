import { GenerateUUID } from './GenerateUUID.js'
import { GetCurrentUser } from './GetCurrentUser.js'
import { SetSessionStorage } from './SetSessionStorage.js'
import { Route } from './Route.js'
import { Log } from './Log.js'
import { Sidebar } from '../Components/Sidebar.js'
import { MainContainer } from '../Components/MainContainer.js'
import { FixedToast } from '../Components/FixedToast.js'
import { Modal } from '../Components/Modal.js'
import { ReleaseNotesContainer } from '../Components/ReleaseNotesContainer.js'
import { App } from '../Core/App.js'
import { Routes } from '../Core/Routes.js'
import { Store } from '../Core/Store.js'
import { Feedback } from '../Components/Feedback.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function LaunchApp(param) {
    const {
        releaseNotes,
        routes,
        settings
    } = param;

    const {
        debug,
        title,
        sessionStorageData,
        sidebar,
        maincontainer,
        allowFeedback,
        beforeLaunch,
        usersList
    } = settings;
    
    // Get/Set User
    Store.user(await GetCurrentUser({
        list: usersList
    }));

    // Before load
    if (beforeLaunch) {
        await new Promise((resolve) => {
            beforeLaunch({
                user: Store.user(),
                resolve
            });
        });
    }

    // Set sessions storage
    SetSessionStorage({
        sessionStorageData
    });

    // Get current route
    const path = location.href.split('#')[1];

    // Attach Router to browser back/forward event
    window.addEventListener('popstate', (event) => {
        if (event.state) {
            Route(event.state.url.split('#')[1], {
                scrollTop: Store.viewScrollTop()
            });
        }
    });

    // Store routes
    Store.setRoutes(routes.concat(Routes));

    // Get app container
    const appContainer = Store.get('appcontainer');

    // Sidebar
    const sidebarParam = {
        parent: appContainer,
        path
    };

    const sidebarComponent = sidebar ? sidebar(sidebarParam) : Sidebar(sidebarParam);

    Store.add({
        name: 'sidebar',
        component: sidebarComponent
    });

    sidebarComponent.add();

    // Main Container
    const mainContainerParam = {
        parent: appContainer
    };

    const mainContainer = maincontainer ? maincontainer(mainContainerParam) : MainContainer(mainContainerParam);

    Store.add({
        name: 'maincontainer',
        component: mainContainer
    });

    mainContainer.add();

    // Show App Container
    appContainer.show('flex');

    // Generate Session Id
    const sessionId = GenerateUUID();

    // TODO: Use GetLocal();
    // Format Title for Sessin/Local Storage keys
    const storageKeyPrefix = settings.title.split(' ').join('-');

    // Set Session Id
    sessionStorage.setItem(`${storageKeyPrefix}-sessionId`, sessionId);

    // Log in
    try {
        // TODO: Standarize LOG and ERROR format
        Log({
            Title: `Log in`,
            Message: `${Store.user().Email || 'User'} successfully loaded ${title}`,
            StackTrace: new Error().stack,
            Module: import.meta.url
        });
    } catch (error) {
        console.error(error);
    }

    if (allowFeedback) {
        Feedback();
    }

    // Debug mode enabled: attach App to window object (global)
    if (debug || App.isDev()) {
        window.App = App;
    }

    // Run current route on page load
    Route(path, {
        log: false
    });

    if (releaseNotes) {
        const { show, version, title, message } = releaseNotes;

        const isDismissed = localStorage.getItem(`${storageKeyPrefix}-releaseNotesDismissed-${version}`);

        if (show && !isDismissed) {
            const toast = FixedToast({
                type: 'robi',
                title,
                message,
                bottom: '20px',
                right: '10px',
                action(event) {
                    const modal = Modal({
                        fade: true,
                        background: settings.secondaryColor,
                        centered: true,
                        close: true,
                        addContent(modalBody) {
                            ReleaseNotesContainer({
                                margin: '0px',
                                parent: modalBody,
                            });
                        },
                        parent: appContainer
                    });
    
                    modal.add();
                },
                onClose(event) {
                    localStorage.setItem(`${storageKeyPrefix}-releaseNotesDismissed-${version}`, 'true');
                },
                parent: appContainer
            });
    
            toast.add();
        }
    }
}
// @END-File
